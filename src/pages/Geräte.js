//GERÄTE
var onOffKordel = document.getElementById("onOffKordel");
onOffKordel.addEventListener("click", function () {
  if (!onOffKordel.checked) {
    var request = {};
    request.task = "Herunterfahren";
    postRequest(serverip + "todo", request, function (msg) {
      console.log(msg);
    });
  } else {
    showDialog("Befehl nicht möglich", "Kordel bitte manuell einschalten", null, "OK", null, null);
    onOffKordel.checked = false;
  }
});
onOffKordel.addEventListener("contextmenu", function (e) {
  if (onOffKordel.checked) {
    var request = {};
    request.task = "Neustarten";
    postRequest(serverip + "todo", request, function (msg) { });
    e.preventDefault();
  }
});


var onOffPC = document.getElementById("onOffPc");
onOffPC.addEventListener("click", function () {
  var request = {};
  if (!onOffPC.checked) {
    request.task = "turnOffPc";
    postRequest(serverip + "todo", request, function (msg) {});
  } else {
    request.task = "turnOnPc";
    postRequest(serverip + "todo", request, function (msg) {});
  }
});

function updateGeraete(response) {
  onOffPC.checked = response.Status.PcOnline;
};