//=include ../node_modules/material-components-web/dist/material-components-web.js
mdc.autoInit();
//TOOLS
var getRequest = function (url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.addEventListener('load', function (event) {
    var json = JSON.parse(xhr.responseText);
    callback(json);
  });
  xhr.send();
}

var postRequest = function (url, jsondata, callback) {
  var http = new XMLHttpRequest();
  http.open("POST", url, true);

  http.setRequestHeader("Content-type", "application/json");

  http.onreadystatechange = function () {
    if (http.readyState == 4) {
      callback(http.responseText);
    }
  }
  http.send(JSON.stringify(jsondata));
}

var deleteRequest = function (url, jsondata, callback) {
  var http = new XMLHttpRequest();
  http.open("DELETE", url, true);

  http.setRequestHeader("Content-type", "application/json");

  http.onreadystatechange = function () {
    if (http.readyState == 4) {
      callback(http.responseText);
    }
  }
  http.send(JSON.stringify(jsondata));
}
var content = document.getElementById("content");
function showDialog(heading, body, cancel, accept, oncancel, onaccept) {
  var dialog = document.createElement("aside");
  dialog.className = "mdc-dialog";
  dialog.role = "alertdialog";
  var surface = document.createElement("div");
  surface.className = "mdc-dialog__surface";
  var header = document.createElement("header");
  header.className = "mdc-dialog__header";
  var h2 = document.createElement("h2");
  h2.className = "mdc-dialog__header__title";
  var headertext = document.createTextNode(heading);
  var section = document.createElement("section");
  section.className = "mdc-dialog__body";
  var bodytext = document.createTextNode(body);
  var footer = document.createElement("footer");
  footer.className = "mdc-dialog__footer";
  var buttonCancel = document.createElement("button");
  buttonCancel.className = "mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel";
  buttonCancel.type = "button";
  var buttonAccept = document.createElement("button");
  buttonAccept.className = "mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept";
  buttonAccept.type = "button";
  var backdrop = document.createElement("div");
  backdrop.className = "mdc-dialog__backdrop";
  var canceltext = document.createTextNode(cancel);
  var accepttext = document.createTextNode(accept);

  content.appendChild(dialog);
  dialog.appendChild(surface);
  surface.appendChild(header);
  header.appendChild(h2);
  h2.appendChild(headertext);
  surface.appendChild(section);
  section.appendChild(bodytext);
  surface.appendChild(footer);
  if (cancel != null) footer.appendChild(buttonCancel);
  if (accept != null) footer.appendChild(buttonAccept);
  buttonCancel.appendChild(canceltext);
  buttonAccept.appendChild(accepttext);
  dialog.appendChild(backdrop);
  var dialogjs = new window.mdc.dialog.MDCDialog(dialog);
  dialogjs.listen('MDCDialog:accept', onaccept);
  dialogjs.listen('MDCDialog:cancel', oncancel);
  dialogjs.show();
}

//DRAWER
var drawerEl = document.querySelector('.mdc-temporary-drawer');
var MDCTemporaryDrawer = mdc.drawer.MDCTemporaryDrawer;
var drawer = new MDCTemporaryDrawer(drawerEl);
document.querySelector('.menu').addEventListener('click', function () {
  drawer.open = true;
});

//TOOLBAR mdc-toolbar-fixed-adjust damit sich der adjust anpasst beim resizen
window.addEventListener("resize", resize, true);


function resize() {
  var toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
  toolbar.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust');
}
var serverip = "http://10.0.0.16:1337/";

//RADIO
var musikTabBar = new mdc.tabs.MDCTabBar(document.querySelector('.mdc-tab-bar'));
var senderSubPage = document.getElementById("sender");
var playlistSubPage = document.getElementById("playlist");
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



var removedialog = new mdc.dialog.MDCDialog(document.querySelector('#removeRadiosenderDialog'));
var sender = document.getElementById("sender");
var removeRadioBody = document.getElementById("removeRadioBody");

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
    var currentname = name;
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
    console.log(msg)
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
var playlist = document.getElementById("playlist");
function addPlaylistItems(status) {
  var songs = status.Playlist;
  if (songs != null) {
    for (var i = songs.length - 1; i >= 0; i--) {
      var songname = songs[i].Task.name;
      var listitem = document.createElement("li");
      var node = document.createTextNode(songname);
      listitem.appendChild(node);
      playlist.appendChild(listitem);
    }
  }
}
//PLAYLISTCONTROL
mdc.textfield.MDCTextfield.attachTo(document.querySelector('#songinput'));

function stop() {
  var request = {};
  request.task = "Playerstoppen";
  postRequest(serverip + "todo", request, function (msg) {
    console.log(msg);
  });
}

var playpausebuttonjs = new mdc.iconToggle.MDCIconToggle(document.getElementById("playpause"));

const playpausebutton = document.getElementById('playpause');
playpausebutton.addEventListener('MDCIconToggle:change', ({ detail }) => {
  var request = {};
  if (detail.isOn) request.task = "Playerpausieren";
  else request.task = "Playerfortsetzen";
  postRequest(serverip + "todo", request, function (msg) {
    console.log(msg);
  });
});

const SPACE_KEYCODE = 32;
const ESCAPE_KEYCODE = 27;
const ENTER_KEYCODE = 13;

document.addEventListener("keyup", function (event) {
  var keyCode = event.which || event.keyCode || event.charCode;
  if (keyCode == SPACE_KEYCODE) {
    playpausebutton.click();
  }
  if (keyCode == ESCAPE_KEYCODE) {
    stop();
  }
})

var songinputlabel = document.getElementById("songinputlabel");
var song = document.getElementById('song');
song.addEventListener("keyup", function (event) {
  var keyCode = event.which || event.keyCode || event.charCode;
  if (keyCode == ENTER_KEYCODE) {
    addtoPlaylist();
  }
});

var textinputs = document.getElementsByTagName("input");
for (var i = 0; i < textinputs.length; i++) {
  textinputs[i].addEventListener("keyup", function (event) {
    var keyCode = event.which || event.keyCode || event.charCode;
    if (keyCode == SPACE_KEYCODE) {
      //Verhindert beim schreiben, dass pausiert wird
      event.stopPropagation();
      event.preventDefault();
      event.returnValue = false;
      event.cancelBubble = true;
    }
  });
}

var videocheckbox = document.getElementById("video");
var nextCheckbox = document.getElementById("next");
function addtoPlaylist() {
  var request = {};
  if (videocheckbox.checked) request.task = "YoutubeVideostreamen";
  else request.task = "YoutubeAudiostreamen";
  if (nextCheckbox.checked) request.next = true;
  else request.next = false;

  request.name = song.value;

  postRequest(serverip + "todo", request, function (msg) {
    console.log(msg);
  });

  song.value = "";
  //Fix, weil label (Song eingeben...) nicht wieder in die textbox geht, wenn man den button anklickt
  songinputlabel.classList.remove('mdc-textfield__label--float-above');
}

//ONLOAD
function update() {
  //Radiosender abrufen
  getRequest(serverip + "radiosender", function (res) {
    var i = 0;
    for (var sender in res) {
      addRadio(res[sender], i);
      i++;
    }
    //componentHandler.upgradeAllRegistered();
    //weil sonst manchmal kein mdl style auf den radio buttons ist...


    getRequest(serverip + "status", function (status) {
      //Bei wiedergabe pausebutton anzeigen und umgekehrt
      if (status.Pausiert == false) playpausebuttonjs.on = false;
      else playpausebuttonjs.on = true;
      //Spielenden Radio markieren
      if (status.task == "WebRadiospielen") {
        var senderliste = (document.getElementById("sender")).childNodes;
        for (var i = 0; i < senderliste.length; i++) {
          if (senderliste[i].childNodes[1] != undefined) {
            if ((senderliste[i].childNodes[1]).textContent == status.name) {
              (senderliste[i].childNodes[0]).firstChild.checked = true;
              break;
            }
          }
        }
      }
      addPlaylistItems(status);
    });
  });
}
update();

var previousPageId = null;
function showPage(pageid, button) {
  drawer.open = false;
  //Elemente von alter page verstecken
  if (previousPageId != null) {
    var previousPageElements = document.getElementsByClassName(previousPageId);
    for (var i = 0; i < previousPageElements.length; i++) {
      if (previousPageElements[i].classList.contains("tabs")) {
        if (screen.width <= 480) previousPageElements[i].style.display = "none";
      }
      else if (previousPageElements[i].parentElement.parentElement.tagName.toLowerCase() == "nav") {
        previousPageElements[i].classList.remove("mdc-permanent-drawer--selected");
      } else {
        previousPageElements[i].style.display = "none";
      }
    }
  }
  //Elemente von neuer page einblenden
  var pageElements = document.getElementsByClassName(pageid);
  for (var i = 0; i < pageElements.length; i++) {
    if (pageElements[i].classList.contains("tabs")) {
      if (screen.width <= 480) pageElements[i].style.display = "block";
    }
    else if (pageElements[i].parentElement.parentElement.tagName.toLowerCase() == "nav") {
      pageElements[i].classList.add("mdc-permanent-drawer--selected");
    }
    else {
      if (pageElements[i].classList.contains("contentpage")) {
        pageElements[i].style.display = "flex";

      } else {
        pageElements[i].style.display = "block";
      }  
    }
  }
  //Toolbar platzhalter aktualisieren (tabs können hinzugekommen/verschwunden sein)
  resize();
  previousPageId = pageid;
}
showPage("musik");
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

function streamMedia(url) {
  var request = { "task": "YoutubeVideostreamen", "url": url, "now": true };
}

window.onerror = function (msg, url, linenumber) {
  showDialog("Error", msg + '\nURL: ' + url + '\nLine Number: ' + linenumber, null, "OK", null, null);
  return true;
}
