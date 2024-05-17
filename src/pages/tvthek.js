var TVTHEK_URL = serverip + "tvthek";
var preferredKategorie = "Comedy-Satire";
var sendungsListe = {};
loadSendungen = function () {
    getRequest(TVTHEK_URL, function (res) {
        if (res.message == null || Object.keys(e.message).length == 0) console.log("nix");
        else {
            sendungsListe = res.message;
            setupSendungen();
        }
    });
}
loadSendungen();


var kategorieDropdown = document.getElementById("kategorieDropdown");
var sendungDropdown = document.getElementById("sendungDropdown");


function setupSendungen() {
    setupKategorien();
    updateSendungenForKategorie();
}

function setupKategorien() {
    kategorieDropdown.innerText = "";
    for (var Kategorie in sendungsListe) {
        kategorieDropdown.appendChild(createDropdownOption(Kategorie))
    }

    if (Object.keys(sendungsListe)[0]) {
        kategorieDropdown.value = localStorage.getItem("tvthekKategorie");
        if (kategorieDropdown.value == "") kategorieDropdown.value = Object.keys(sendungsListe)[0];
    }
    //if (sendungsListe.hasOwnProperty(preferredKategorie)) { }
};

kategorieDropdown.addEventListener("change", function () {
    updateSendungenForKategorie();
    localStorage.setItem("tvthekKategorie", kategorieDropdown.value);
});
sendungDropdown.addEventListener("change", function () {
    localStorage.setItem("tvthekSendung", sendungDropdown.value)
})

function updateSendungenForKategorie() {
    sendungDropdown.innerText = "";

    for (var i = 0; i < sendungsListe[kategorieDropdown.value].length; i++) {
        sendungDropdown.appendChild(createDropdownOption(sendungsListe[kategorieDropdown.value][i].title));
    }
    sendungDropdown.value = localStorage.getItem("tvthekSendung");
    if (sendungDropdown.value == "") sendungDropdown.value = sendungsListe[kategorieDropdown.value][0].title;
}


function createDropdownOption(name) {
    var option = document.createElement("option");
    option.classList = "";
    option.innerText = name;
    return option;
}


var tvthekAbspielenButton = document.getElementById("tvthekAbspielenButton");
tvthekAbspielenButton.addEventListener("click", function () {
    var Kategorie = kategorieDropdown.value;// sendungsListe[kategorieDropdown.value];

    var Sendung = sendungDropdown.selectedIndex;//sendungsListe[kategorieDropdown.value][sendungDropdown.selectedIndex].title;
    requestTvthekPlayback(Kategorie, Sendung);
});


function requestTvthekPlayback(kategorie, index) {
    var task = {};
    task.task = "playTvthek";
    task.Kategorie = kategorie;
    task.index = index;
    console.log(task)
    postRequest(TODO_IP, task, function () { });
}