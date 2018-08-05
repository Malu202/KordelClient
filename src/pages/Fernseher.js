//FERNSEHER
var tvplaying = false;
var fernsehenButton = document.getElementById("fernsehen");
fernsehenButton.addEventListener("click", function () {
  var request = {};
  if (tvplaying) {
    request["task"] = "turnOffTv";
    fernsehenButton.classList.remove("mdc-button--secondary");
  }
  else {
    request["task"] = "Fernsehen";
    fernsehenButton.classList.add("mdc-button--secondary");
  }
  postRequest(serverip + "todo", request, function () { });
  tvplaying = !tvplaying;
});

var hdmi1Button = document.getElementById("hdmi1");
hdmi1Button.addEventListener("click", function () {
  var request = {};
  request["task"] = "HDMI1";
  postRequest(serverip + "todo", request, function () { });
});

var pcButton = document.getElementById("pc");
pcButton.addEventListener("click", function () {
  var request = {};
  request["task"] = "PCundTV";
  postRequest(serverip + "todo", request, function () { });
});