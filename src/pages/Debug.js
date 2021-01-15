let DEBUG_IP = serverip + "debug";

var getDebugData = document.getElementById("getDebugData");

getDebugData.addEventListener("click", function () {
    var request = { changeDebugState: "off" };
    debugPostRequest(DEBUG_IP, request, function (msg) {
        updateDebugData(msg)
    });
});
var debugStats = document.getElementById("debugStats");
function updateDebugData(msg) {
    console.log(msg)
    debugStats.innerText = "CPU-Temp: " + msg.cpuTemp + "°C";
    logs.innerText = msg.logs;
}


var debugPostRequest = function (url, jsondata, callback) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);

    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            var responseJSON = JSON.parse(http.responseText);
            callback(responseJSON);
        }
    }
    http.send(JSON.stringify(jsondata));
}

var logs = document.getElementById("logs");
var onOffLinebrek = document.getElementById("onOffLinebrek");
onOffLinebrek.addEventListener("click", function () {
    if (!toggleSwitch(onOffLinebrek)) {
        logs.style.whiteSpace = "nowrap";
    } else {
        logs.style.whiteSpace = "";
    }
});
logs.style.whiteSpace = "nowrap";