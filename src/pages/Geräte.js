//GERÄTE
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
    showDialog("Befehl nicht möglich", "Bitte Kordel manuell einschalten",null,"ok",null,null);
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


var onOffPC = document.getElementById("onOffPc");
onOffPC.addEventListener("click", function () {
  var request = {};
  if (!toggleSwitch(onOffPC)) {
    request.task = "turnOffPc";
    postRequest(serverip + "todo", request, function (msg) {});
  } else {
    request.task = "turnOnPc";
    postRequest(serverip + "todo", request, function (msg) {});
  }
});


var onOffSimulationStation = document.getElementById("onOffEmulationstation");
onOffSimulationStation.addEventListener("click", function () {
  var request = {};
  if (toggleSwitch(onOffSimulationStation)) {
    request.task = "startEmulationStation";
    postRequest(serverip + "todo", request, function (msg) {});
  } else { 
    request.task = "killEmulationStation";
    postRequest(serverip + "todo", request, function (msg) {});
  }
});

function updateGeraete(response) {
  setSwitchState(onOffPC, response.Status.PcOnline);
};