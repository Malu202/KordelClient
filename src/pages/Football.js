var footballPage = document.getElementById("football");

function updateFootball(response) {
    var spiele = response.Footballspiele;
    footballPage.innerHTML = "";

    // var footballControls = document.createElement("div");
    // footballControls.classList = "footballcontrols";

    // // footballControls.appendChild(fbButton("play", play));
    // footballControls.appendChild(fbButton("play/pause", pauseFootball));
    // footballControls.appendChild(fbButton("vorspulen", vorspulenFootball));
    // footballControls.appendChild(fbButton("stop", stopFootball));


    // footballPage.appendChild(footballControls);

    for (var i = 0; i < spiele.length; i++) {
        var button = document.createElement("button");
        button.classList = "mdc-button mdc-button--raised";
        button.innerHTML = spiele[i];

        (function (index) {
            button.onclick = function () {
                var request = {};
                request.task = "playFootballGame";
                request.index = index;
                postRequest(serverip + "todo", request, function (msg) { });
            }
        })(i)
        footballPage.appendChild(button);
        // footballPage.innerHTML += spiele[i] + "<br />"
    }
}

function vorspulenFootball() {
    var request = {};
    request.task = "fastForwardFootballGame";
    postRequest(serverip + "todo", request, function (msg) { });
}
function pauseFootball() {
    var request = {};
    request.task = "pauseFootballGame";
    postRequest(serverip + "todo", request, function (msg) { });
}
function playFootball() {
    var request = {};
    request.task = "playFootballGame";
    postRequest(serverip + "todo", request, function (msg) { });
}
function stopFootball() {
    var request = {};
    request.task = "stopFootballGame";
    postRequest(serverip + "todo", request, function (msg) { });
}
function fbButton(name, click) {
    var button = document.createElement("button");
    button.classList = "mdc-button mdc-button--raised";
    button.innerHTML = name;
    button.onclick = click;
    return button;
}