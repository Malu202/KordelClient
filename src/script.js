//=include ../node_modules/material-components-web/dist/material-components-web.js
// ../node_modules/material-components-web/index.js
mdc.autoInit();


//DRAWER
var drawerEl = document.querySelector('.mdc-drawer--temporary');
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
var serverip = "http://10.0.0.40:1337/";

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



var removedialog = new mdc.dialog.MDCDialog(document.getElementById('removeRadiosenderDialog'));
var sender = document.getElementById("sender");
var removeRadioBody = document.getElementById("removeRadioBody");


function clearRadio() {
  while (sender.firstChild) {
    sender.removeChild(sender.firstChild);
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

//PLAYLISTCONTROL
//mdc.textfield.MDCTextfield.attachTo(document.querySelector('#songinput'));

var rewindButton = document.getElementById("rewindButton");
//var skipForwardButton = document.getElementById("skipForwardButton");
//var skipBackButton = document.getElementById("skipBackButton");
var forwardButton = document.getElementById("forwardButton");

rewindButton.addEventListener('click', function () {
  var request = { "task": "Playerzurueckspulen" };
  postRequest(serverip + "todo", request, function () { });
});
forwardButton.addEventListener('click', function () {
  var request = { "task": "Playervorspulen" };
  postRequest(serverip + "todo", request, function () { });
});

function stop() {
  var request = {};
  request.task = "Playerstoppen";
  postRequest(serverip + "todo", request, function (msg) {
    checkRadio(null);
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

//var songinputlabel = document.getElementById("songinputlabel");
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
var nowCheckbox = document.getElementById("now");
function addtoPlaylist() {
  var request = {};
  if (videocheckbox.checked) request.task = "YoutubeVideostreamen";
  else request.task = "YoutubeAudiostreamen";
  if (nowCheckbox.checked) request.now = true;
  else request.now = false;

  request.name = song.value;

  postRequest(serverip + "todo", request, function (msg) {
    console.log(msg);
  });

  song.value = "";
  //Fix, weil label (Song eingeben...) nicht wieder in die textbox geht, wenn man den button anklickt
  //songinputlabel.classList.remove('mdc-textfield__label--float-above');
}

var songname = document.getElementById("song-name");


//ONLOAD
// function update() {
//   //Radiosender abrufen
//   getRequest(serverip + "radiosender", function (res) {
//     var i = 0;
//     for (var sender in res) {
//       addRadio(res[sender], i);
//       i++;
//     }
//     //componentHandler.upgradeAllRegistered();
//     //weil sonst manchmal kein mdl style auf den radio buttons ist...


//     getRequest(serverip + "status", function (status) {
//       //Bei wiedergabe pausebutton anzeigen und umgekehrt
//       if (status.Pausiert == false) playpausebuttonjs.on = false;
//       else playpausebuttonjs.on = true;
//       //Spielenden Radio markieren
//       if (status.task == "WebRadiospielen") {
//         var senderliste = (document.getElementById("sender")).childNodes;
//         for (var i = 0; i < senderliste.length; i++) {
//           if (senderliste[i].childNodes[1] != undefined) {
//             if ((senderliste[i].childNodes[1]).textContent == status.name) {
//               (senderliste[i].childNodes[0]).firstChild.checked = true;
//               break;
//             }
//           }
//         }
//       }
//       addPlaylistItems(status);
//     });
//   });
// }
// update();

function update(response) {
  console.log("update")
  //Radiosender abrufen
  var Senderliste = response.Radiosender;
  var i = 0;
  clearRadio();
  for (var radiosender in Senderliste) {
    addRadio(Senderliste[radiosender], i);
    i++;
  }

  var status = response.Status;
  if (status == undefined) status = {};
  if (status.Pausiert == false) playpausebuttonjs.on = false;
  else playpausebuttonjs.on = true;

  //Spielenden Radio markieren
  if (status.task == "WebRadiospielen") {
    checkRadio(status.name);
  }
  addPlaylistItems(status);

  //Laufendes Lied eintragen
  if (status.name) songname.innerHTML = status.name;
  else songname.innerHTML = "Song";
    
  //Geraete
  console.log("onOffPc set to: " + status.PcOnline + " via update");
  onOffPC.checked = status.PcOnline;

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
getRequest(serverip + "Status", function () { });





var previousPageId = null;
function showPage(pageid, button) {
  drawer.open = false;

  var tabindikator = document.getElementById("tabindikator");
  var showtabs = (tabindikator.currentStyle ? tabindikator.currentStyle.display : getComputedStyle(tabindikator, null).display) == "block";

  //Elemente von alter page verstecken
  if (previousPageId != null) {
    var previousPageElements = document.getElementsByClassName(previousPageId);
    for (var i = 0; i < previousPageElements.length; i++) {
      if (previousPageElements[i].classList.contains("tabs")) {
        previousPageElements[i].style.display = "none";
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
      //if (screen.width <= 480) pageElements[i].style.display = "block";
      //tabindikator (größe: 0) wird über mediaqueries ein/ausgeblendet als indikator ob tabs via javascript ein/ausgeblendet werden müssen
      if (showtabs) {
        pageElements[i].style.display = "block";
      }
    }
    else if (pageElements[i].parentElement.parentElement.tagName.toLowerCase() == "nav") {
      pageElements[i].classList.add("mdc-permanent-drawer--selected");
    }
    else {
      if (pageElements[i].classList.contains("contentpage")) {
        pageElements[i].style.display = "flex";

      } else {
        pageElements[i].style.display = "flex";
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


// onOffPC.addEventListener("click", function () {
//   var request = {}
//   request.task = "PC-ONOFF";
//   postRequest(serverip + "todo", request, function (msg) { console.log(msg);});
//  });

function streamMedia(url) {
  var request = { "task": "YoutubeVideostreamen", "url": url, "now": true, "autoplay": false };
  postRequest(serverip + "todo", request, function (msg) { });
}

window.onerror = function (msg, url, linenumber) {
  showDialog("Error", msg + '\nURL: ' + url + '\nLine Number: ' + linenumber, null, "OK", null, null);
  return true;
}
