//GERÄTE
var onOffPc = document.getElementById("onOffPc");
onOffPc.addEventListener("click", function () {
  var request = {};
  if (!toggleSwitch(onOffPc)) {
    request.task = "turnOffPc";
    postRequest(serverip + "todo", request, function (msg) { });
  } else {
    request.task = "turnOnPc";
    postRequest(serverip + "todo", request, function (msg) { });
  }
});


var onOffSimulationStation = document.getElementById("onOffEmulationstation");
onOffSimulationStation.addEventListener("click", function () {
  var request = {};
  if (toggleSwitch(onOffSimulationStation)) {
    request.task = "startEmulationStation";
    postRequest(serverip + "todo", request, function (msg) { });
  } else {
    request.task = "killEmulationStation";
    postRequest(serverip + "todo", request, function (msg) { });
  }
});

var onOffTv = document.getElementById("onOffTV");
onOffTv.addEventListener("click", function () {
  var request = {};
  if (toggleSwitch(onOffTv)) {
    showDialog("Nicht notwendig", "TV started automatisch bei Wiedergabe", null, "ok", null, null);
  } else {
    request.task = "turnOffTv";
    postRequest(serverip + "todo", request, function (msg) { });
  }
});

let onOffAmp = document.getElementById("onOffAmp");
onOffAmp.addEventListener("click", function () {
  var request = {};
  if (toggleSwitch(onOffAmp)) {
    request.task = "turnOnAmp";
    postRequest(serverip + "todo", request, function (msg) { });
  } else {
    request.task = "turnOffAmp";
    postRequest(serverip + "todo", request, function (msg) { });
  }
});

var onOffKordel = document.getElementById("onOffKordel");
onOffKordel.addEventListener("click", function () {
  if (!toggleSwitch(onOffKordel)) {
    var request = {};
    request.task = "Herunterfahren";
    postRequest(serverip + "todo", request, function (msg) {
      console.log(msg);
    });
  } else {
    //showDialog("Befehl nicht möglich", "Kordel bitte manuell einschalten", null, "OK", null, null);
    showDialog("Befehl nicht möglich", "Bitte Kordel manuell einschalten", null, "ok", null, null);
    toggleSwitch(onOffKordel);
  }
});
onOffKordel.addEventListener("contextmenu", function (e) {
  if (!toggleSwitch(onOffKordel)) {
    var request = {};
    request.task = "Neustarten";
    postRequest(serverip + "todo", request, function (msg) { });
    e.preventDefault();
    toggleSwitch(onOffKordel);
  }
});

function updateGeraete(response) {
  setSwitchState(onOffPc, response.Status.PcOnline);
};