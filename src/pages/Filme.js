var FILME_URL = serverip + "LokaleFilme";

var filme;
function loadFilme() {
    filme = [];
    getRequest(FILME_URL, function (res) {
        if (res.message == null) console.log("nix");
        else {
            filme = res.message;
            setupFilme(res.message);
        }
    });
}
loadFilme();

var filmSelect = document.getElementById("filmSelect")
function setupFilme(filme) {
    filmSelect.innerText = "";
    var options = [];
    for (var i = 0; i < filme.length; i++) {
        var filmOption = document.createElement("option");
        filmOption.value = i;
        filmOption.innerText = filme[i].name;
        options.push(filmOption);
    }
    for (var i = 0; i < options.length; i++) {
        filmSelect.appendChild(options[i]);
    }
}

var playFilmButton = document.getElementById("playFilmButton");
playFilmButton.addEventListener("click", function () {
    var path = filme[parseInt(filmSelect.value)].path;
    playFilm(path);
})

function playFilm(path) {
    var task = {};
    task.task = "LokalenFilmspielen";
    task.path = path;
    postRequest(TODO_IP, task, function () { });
}