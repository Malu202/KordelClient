//RADIO
var musikTabBar = new mdc.tabBar.MDCTabBar(document.querySelector('.mdc-tab-bar'));

var senderSubPage = document.getElementById("sender");
var playlistSubPage = document.getElementById("playlist");
//eventuall :activated
musikTabBar.listen('MDCTabBar:change', function ({ detail: tabs }) {
  var tabIndex = tabs.activeTabIndex;
  if (tabIndex == 0) {
    senderSubPage.style.display = "block";
    playlistSubPage.style.display = "none";
  }
  else {
    senderSubPage.style.display = "none";
    playlistSubPage.style.display = "block";
  }
});

var onOffAutoplay = document.getElementById("onOffAutoplay");
onOffAutoplay.addEventListener("click", function () {
  var request = {};
  if (onOffAutoplay.checked) request.task = "Autoplayaktivieren";
  else request.task = "Autoplaydeaktivieren";;
  postRequest(serverip + "todo", request, function (msg) {
  });
});



var removedialog = new mdc.dialog.MDCDialog(document.getElementById('removeRadiosenderDialog'));
var sender = document.getElementById("sender");
var removeRadioBody = document.getElementById("removeRadioBody");

function updateMusic(response) {
  //Radiosender abrufen
  var Senderliste = response.Radiosender;
  var i = 0;
  clearRadio();
  for (var radiosender in Senderliste) {
    addRadio(Senderliste[radiosender], i);
    i++;
  }

  //Spielenden Radio markieren
  if (response.Status.task == "WebRadiospielen") {
    checkRadio(response.Status.name);
  }
  addPlaylistItems(response.Status);

 }

function clearRadio() {
  while (sender.firstChild) {
    sender.removeChild(sender.firstChild);
  }
}

function checkRadio(name) {
  //var senderliste = (document.getElementById("sender")).childNodes;/  
  var senderliste = sender.childNodes;
  if (name != null) {
    for (var i = 0; i < senderliste.length; i++) {
      if (senderliste[i].childNodes[1] != undefined) {
        if ((senderliste[i].childNodes[1]).textContent == name) {
          (senderliste[i].childNodes[0]).firstChild.checked = true;
          break;
        }
      }
    }
  }
  else {
    for (var i = 0; i < senderliste.length; i++) {
      if (senderliste[i].childNodes[1] != undefined) {
        (senderliste[i].childNodes[0]).firstChild.checked = false;
      }
    }
  }
}

var addRadio = function (name, nummer) {
  var formfield = document.createElement("div");
  formfield.className = "mdc-form-field";
  formfield.style.display = "flex"; //formfield hat sonst "display: inline-flex" und die sender werden horizontal gelistet

  var radio = document.createElement("div");
  radio.className = "mdc-radio";

  var input = document.createElement("input");
  input.type = "radio";
  input.id = "option-" + nummer;
  input.className = "mdc-radio__native-control";
  input.setAttribute("name", "options");
  input.value = "nummer";

  var radiobackground = document.createElement("div");
  radiobackground.className = "mdc-radio__background";

  var radiooutercircle = document.createElement("div");
  radiooutercircle.className = "mdc-radio__outer-circle";

  var radioinnercircle = document.createElement("div");
  radioinnercircle.className = "mdc-radio__inner-circle";

  var label = document.createElement("label");
  label.className = ""; //eventuell ripple einfügen
  label.setAttribute("for", "option-" + nummer);

  var node = document.createTextNode(name);

  label.appendChild(node);
  radiobackground.appendChild(radiooutercircle);
  radiobackground.appendChild(radioinnercircle);
  radio.appendChild(input);
  radio.appendChild(radiobackground);
  formfield.appendChild(radio);
  formfield.appendChild(label);
  sender.appendChild(formfield);

  //Rechte Maustaste
  formfield.addEventListener('contextmenu', function (e) {
    while (removeRadioBody.firstChild) {
      removeRadioBody.removeChild(removeRadioBody.firstChild);
    }
    var node = document.createTextNode('"' + name + '"' + " löschen?");
    removeRadioBody.appendChild(node);
    removedialog.show();
    e.preventDefault();
  }, false);

  input.onclick = (function () {
    //var currentname = name;
    return function () {
      radiosenderSpielen(name);
    };
  })();
}

removedialog.listen('MDCDialog:accept', function () {
  var removetext = removeRadioBody.childNodes[0].nodeValue;
  var sendername = (removetext.split('"'))[1];
  var request = {};
  request.name = sendername;
  deleteRequest(serverip + "Radiosender", request, function () {
  });
});

var radiosenderSpielen = function (name) {
  var request = {};
  request.task = "WebRadiospielen";
  request.name = name;
  console.log("abgesendeter request: " + JSON.stringify(request));
  postRequest(serverip + "todo", request, function (msg) {
    checkRadio(name);
  });
}

//Radiosender hinzufügen
var dialog = new mdc.dialog.MDCDialog(document.querySelector('#addRadiosenderDialog'));
var radioname = document.getElementById("radioname");
var radiourl = document.getElementById("radiourl");

dialog.listen('MDCDialog:accept', function () {
  console.log('accepted');
  var request = {};
  request.name = radioname.value;
  request.url = radioname.value;
  postRequest(serverip + "Radiosender", request, function () {
    console.log("Radiosender hinzugefügt");
  });
})

document.querySelector('#addRadioButton').addEventListener('click', function (evt) {
  //dialog.lastFocusedTarget = evt.target;
  dialog.show();
})

//PLAYLIST
//var playlist = document.getElementById("playlist");
var playlistSongs = document.getElementById("playlistSongs");
function addPlaylistItems(status) {
  while (playlistSongs.firstChild) {
    playlistSongs.removeChild(playlistSongs.firstChild);
  }
  var songs = status.Playlist;
  if (songs != null) {
    for (var i = songs.length - 1; i >= 0; i--) {
      var songname = songs[i].Task.name;
      var listitem = document.createElement("li");
      var node = document.createTextNode(songname);
      listitem.appendChild(node);
      playlistSongs.appendChild(listitem);
    }
  }
}