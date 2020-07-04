var SERIEN_URL = serverip + "LokaleSerien";
//var SERIEN_URL = "http://kordel.selfhost.at/LokaleSerien.json" //MOCKUP FÜR DEBUGGING OHNE RASPBERRY, NICHT COMMITEN!!!!
var SerienListe = [];
loadSerien = function () {
    getRequest(SERIEN_URL, function (res) {
        if (res.message == null) console.log("nix");
        else {
            setupSerienCards(res.message);
            SerienListe = res.message;
        }
    });
}
loadSerien();

var serienPage = document.getElementById("serien");

var serienBluePrint = document.getElementsByClassName("serienBluePrint")[0];
var serienStaffelOption = document.getElementsByClassName("serienStaffelOption")[0];

function newSerienCard(serie) {

    var name = serie.name;
    var staffeln = serie.staffeln;

    var neueOption = serienStaffelOption.cloneNode(true);
    var neueSerie = serienBluePrint.cloneNode(true);

    neueSerie.classList.remove("serienBluePrint");
    neueSerie.getElementsByClassName("serienName")[0].innerHTML = name;
    var staffelSelect = neueSerie.getElementsByClassName("serienStaffelOption")[0].parentElement;
    staffelSelect.innerHTML = "";
    var folgeSelect = neueSerie.getElementsByClassName("serienFolgeOption")[0].parentElement;
    folgeSelect.innerHTML = "";
    var folgeAbspielenButton = neueSerie.getElementsByClassName("folgeAbspielenButton")[0];

    for (var i = 0; i < staffeln.length; i++) {
        var neueStaffel = neueOption.cloneNode(true);
        neueStaffel.innerHTML = staffeln[i].name;
        neueStaffel.value = i;
        staffelSelect.appendChild(neueStaffel);
    }
    //Die Folgen dürfen nur hinzugefügt werden wenn die passende staffel ausgewählt ist
    var staffelOnChange = function () {
        var i = staffelSelect.value;
        var staffeln = serie.staffeln;
        var neueOption = serienStaffelOption.cloneNode(true);
        folgeSelect.innerHTML = "";
        for (var j = 0; j < staffeln[i].folgen.length; j++) {
            var neueFolge = neueOption.cloneNode(true);
            neueFolge.innerHTML = staffeln[i].folgen[j].name;
            neueFolge.value = j;
            folgeSelect.appendChild(neueFolge);
        }
    };
    staffelSelect.addEventListener("change", staffelOnChange);

    folgeAbspielenButton.addEventListener("click", function () {
        var i = staffelSelect.value;
        var j = folgeSelect.value;
        requestSeriesPlayback(serie.staffeln[i].folgen[j].path);
    })
    folgeAbspielenButton.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        var Verlauf = "";
        if (serie.history) {
            for (var index = 0; index < serie.history.length; index++) {
                Verlauf += "Staffel: " + serie.history[index].Staffel + " Folge: " + serie.history[index].Folge + "<br />";
            }
        } else {
            Verlauf = "Kein Verlauf gefunden";
        }

        showDialog(serie.name, Verlauf, null, "ok", null, null);
    })
    serienPage.appendChild(neueSerie);
    return [staffelSelect, folgeSelect];
}

function selectLastWatched(serieSelects, serie) {
    var staffelSelect = serieSelects[0];
    var folgeSelect = serieSelects[1];

    //Select Last watched Episode
    var currentStaffelIndex = 0;
    var currentFolgenIndex = 0;
    if (serie.history) {
        for (var i = 0; i < serie.staffeln.length; i++) {
            if (serie.staffeln[i].name == serie.history[serie.history.length - 1].Staffel) {
                currentStaffelIndex = i;
                break;
            }
        }
        for (var j = 0; j < serie.staffeln[currentStaffelIndex].folgen.length; j++) {
            if (serie.staffeln[currentStaffelIndex].folgen[j].name == serie.history[serie.history.length - 1].Folge) {
                currentFolgenIndex = j;
                break;
            }
        }
        if (serie.staffeln[currentStaffelIndex].folgen.length > currentFolgenIndex + 1) {
            currentFolgenIndex++;
        } else {
            if (serie.staffeln.length > currentStaffelIndex + 1) {
                currentStaffelIndex++;
                currentFolgenIndex = 0;
            }
        }
    }

    staffelSelect.value = currentStaffelIndex;
    staffelSelect.dispatchEvent(new Event('change', { 'bubbles': false }))
    folgeSelect.value = currentFolgenIndex;
}
var serienSelects;
var previousHistory = [];
function setupSerienCards(serien) {
    // console.log(previousHistory);
    if (SerienListe.length != serien.length) {
        serienPage.innerHTML = "";
        serienSelects = [];
        for (var i = 0; i < serien.length; i++) {
            newSelects = newSerienCard(serien[i]);
            serienSelects.push(newSelects);
        }
    }
    for (var i = 0; i < serien.length; i++) {
        var history = undefined;
        if(serien[i].history != undefined ) history = serien[i].history[serien[i].history.length - 1].Staffel + serien[i].history[serien[i].history.length - 1].Folge;
        if (history != previousHistory[i]) {
            selectLastWatched(serienSelects[i], serien[i]);
        }
        previousHistory[i] = history;
    }


}

function requestSeriesPlayback(path) {
    var task = {};
    task.task = "LokaleSeriespielen";
    task.path = path;
    postRequest(TODO_IP, task, function () { });
}