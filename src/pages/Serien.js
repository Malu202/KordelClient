var SERIEN_URL = serverip + "LokaleSerien";
//var SERIEN_URL = "http://kordel.selfhost.at/LokaleSerien.json" //MOCKUP FÜR DEBUGGING OHNE RASPBERRY, NICHT COMMITEN!!!!
getRequest(SERIEN_URL, function (res) {
    if (res.message == null) console.log("nix");
    else {
        SerienListe = res.message;
        setupSerienCards(SerienListe);
    }
});

serienPage = document.getElementById("serien");

var serienBluePrint = document.getElementsByClassName("serienBluePrint")[0];
// var serienName = document.getElementsByClassName("serienName")[0];
var serienStaffelOption = document.getElementsByClassName("serienStaffelOption")[0];
// var serienFolgeOption = document.getElementsByClassName("serienFolgeOption")[0];
// var folgeAbspielenButton = document.getElementsByClassName("folgeAbspielenButton")[0];

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
        //neueStaffel.value = staffeln[i].name;
        neueStaffel.value = i;
        staffelSelect.appendChild(neueStaffel);
    }
    
    staffelOnChange = function(){        
        var i = staffelSelect.value;
        var staffeln = serie.staffeln;
        var neueOption = serienStaffelOption.cloneNode(true);
        folgeSelect.innerHTML = "";
        for (var j = 0; j < staffeln[i].folgen.length; j++) {
            var neueFolge = neueOption.cloneNode(true);
            neueFolge.innerHTML = staffeln[i].folgen[j].name;
            //neueFolge.value = staffeln[i].folgen[j].name;
            neueFolge.value = j;
            folgeSelect.appendChild(neueFolge);
        }
    };
    staffelSelect.addEventListener("change", staffelOnChange);

    folgeAbspielenButton.addEventListener("click",function(){
        var i = staffelSelect.value;
        var j = folgeSelect.value;
        requestSeriesPlayback(serie.staffeln[i].folgen[j].path);
    })

    serienPage.appendChild(neueSerie);
    staffelOnChange();    
}

function setupSerienCards(serien) {
    serienPage.innerHTML = "";
    for (var i = 0; i < serien.length; i++) {
        newSerienCard(serien[i]);
    }
}

function requestSeriesPlayback(path) {
    var task = {};
    task.task = "LokaleSeriespielen";
    task.path = path;
    postRequest(TODO_IP, task, function () {

    });
}