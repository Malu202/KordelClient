var SERIEN_URL = serverip + "LokaleFilme";
getRequest(SERIEN_URL, function (res) {
    if (res.message == null) console.log("nix");
});

var serien = document.getElementById("serien");
var Serien = [];


var SerienListe = {};
for (var k = 1; k < 4; k++) {
    var Serienname = "Serie " + k;

    var Staffeln = {};
    for (var j = 1; j < 5; j++) {
        var Staffelname = "Staffel " + j;

        var Folgen = [];
        for (var i = 1; i < 300; i++) {
            //SerienListe[Serienname][Staffelname][i] = "Folge " + i;
            Folgen.push("Folge " + i + " von " + Serienname);
        }
        Staffeln[Staffelname] = Folgen;
    }
    SerienListe[Serienname] = Staffeln;
}

console.log(SerienListe);
SerienListe.length = Object.keys(SerienListe).length;
console.log(SerienListe.length);




var sp = document.getElementById("sp");

var addButton = function (name, onclick) {
    var button = document.createElement("button");
    button.className = "mdc-button serienSubPage";
    button.innerHTML = name;

    sp.appendChild(button);

    button.onclick = (function () {
        return function () {
            onclick(name);
        };
    })();
}

var Serienname = "";
var Serienstaffel = "";
var Serienfolge = "";

function setupButtons() {
    clearButtons();
    for (var i = 0; i < SerienListe.length; i++) {
        addButton(Object.keys(SerienListe)[i], function (name) {
            Serienname = name;
            clearButtons();
            for (var j = 0; j < Object.keys(SerienListe[Serienname]).length; j++) {
                addButton(Object.keys(SerienListe[Serienname])[j], function (name) {
                    Serienstaffel = name;
                    clearButtons();

                    var Folgen = (SerienListe[Serienname])[Serienstaffel];
                    for (var k = 0; k < ((SerienListe[Serienname])[Serienstaffel]).length; k++) {
                        addButton(((SerienListe[Serienname])[Serienstaffel])[k], function (name) {
                            requestSeriesPlayback(Serienname, Serienstaffel, Serienfolge);
                        });
                    }
                });
            }
        });
    }
}    
setupButtons();
function clearButtons() {
    sp.innerHTML = "";
}

function requestSeriesPlayback(Serienname, Serienstaffel, Serienfolge) {
    var task = {};
    task.Task = "LokaleSerieSpielen";
    task.Serie = Serienname;
    task.Staffel = Serienstaffel;
    task.Folge = Serienfolge;
    postRequest(serverip + "todo", task, function () {

    });
}