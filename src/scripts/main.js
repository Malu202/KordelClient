//DRAWER
var drawerEl = document.getElementsByClassName('mdc-drawer--modal')[0];
var menuButton = document.getElementById('menu');
var body = document.body;

menuButton.onclick = openDrawer;
function openDrawer() {
  drawerEl.classList.add("mdc-drawer--open");
  //notwendig für iphone...
  body.style.cursor = "pointer";
  document.addEventListener('click', openDrawerClick);
}
//überprüft bei geöffnetem Drawer alle klicks ob der Drawer geschlossen werden muss
function openDrawerClick(clickEvent) {
  var clickedElement = clickEvent.srcElement;
  if (clickedElement != menuButton && clickedElement != drawerEl && clickedElement != drawerEl.firstElementChild) {
    closeDrawer();
    body.style.cursor = "";
    document.onclick = null;
  }
}
function closeDrawer() {
  drawerEl.classList.remove("mdc-drawer--open");
}
//open drawer on launch (only on mobile)

var menuButtonDisplay = window.getComputedStyle(menuButton).display;
if (menuButtonDisplay != "none") {
  openDrawer();
}

//OWN JS IMPLEMENTATION FOR MDC ELEMENTS
var CHECKED_SWITCH_CLASSNAME = "mdc-switch--checked";
function toggleSwitch(Switch) {
  var SwitchDiv = Switch.parentElement.parentElement.parentElement
  if (SwitchDiv.classList.contains(CHECKED_SWITCH_CLASSNAME)) {
    SwitchDiv.classList.remove(CHECKED_SWITCH_CLASSNAME);
    return false;
  }
  else {
    SwitchDiv.classList.add(CHECKED_SWITCH_CLASSNAME);
    return true;
  }
}

function setSwitchState(Switch, state) {
  var SwitchDiv = Switch.parentElement.parentElement.parentElement;
  if (state == true) {
    SwitchDiv.classList.add(CHECKED_SWITCH_CLASSNAME);
  }
  if (state == false) {
    SwitchDiv.classList.remove(CHECKED_SWITCH_CLASSNAME);
  }
}
//TOOLBAR mdc-toolbar-fixed-adjust damit sich der adjust anpasst beim resizen
//window.addEventListener("resize", resize, true);


// function resize() {
//   // var toolbar = new mdc.topAppBar.MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
//   // toolbar.fixedAdjustElement = document.querySelector('.mdc-top-app-bar--fixed-adjust');
// }
//var serverip = "http://10.0.0.40:1337/";
var serverip = "http://192.168.0.185:1337/";
var TODO_IP = serverip + "todo";

var rewindButton = document.getElementById("rewindButton");
var skipForwardButton = document.getElementById("skipForwardButton");
//var skipBackButton = document.getElementById("skipBackButton");
var forwardButton = document.getElementById("forwardButton");
var goToTimestampButton = document.getElementById("goToTimestampButton");
let goToTimestampDialog = document.getElementById("goToTimestampDialog");
let goToTimestampDialogInput = document.getElementById("goToTimestampDialogInput");


rewindButton.addEventListener('click', function () {
  var request = { "task": "Playerzurueckspulen" };
  postRequest(TODO_IP, request, function () { });
});
forwardButton.addEventListener('click', function () {
  var request = { "task": "Playervorspulen" };
  postRequest(TODO_IP, request, function () { });
});
skipForwardButton.addEventListener('click', function () {
  var request = { "task": "Playerskippen" };
  postRequest(TODO_IP, request, function () { });
});
goToTimestampButton.addEventListener('click', function () {
  showCustomDialog("Gehe zu Timestamp", goToTimestampDialog, "Abbrechen", "Bestätigen", null, function () {
    let inputValue = goToTimestampDialogInput.value;
    // let minuteDivider = inputValue.indexOf(':');
    // let hours, minutes, seconds;
    // if (minuteDivider > 0) {
    //   let secondsDivider = inputValue.substring(minuteDivider).indexOf(':');
    //   if (secondsDivider < 0) { //mm:ss
    //     secondsDivider = minuteDivider;
    //     minuteDivider = 0;
    //   } else { //hh:mm:ss

    //   }
    // }
    // else { //ss
    //   seconds = parseInt(goToTimestampDialogInput.value);
    // }
    // seconds = parseInt(goToTimestampDialogInput.value.substring(secondsDivider));
    // minutes = parseInt(goToTimestampDialogInput.value.substring(minuteDivider, secondsDivider));
    // hours = parseInt(goToTimestampDialogInput.value.substring(0, minuteDivider));
    let seconds = 0;
    inputValue = inputValue.split(":");
    if (inputValue.length <= 3) {
      for (let i = inputValue.length - 1; i >= 0; i--) {
        seconds += inputValue[i] * Math.pow(60, inputValue.length - 1 - i);
      }
    }
    if (isNaN(seconds)) {
      snackbarNotification("ERROR, ungültige Eingabe: " + goToTimestampDialogInput.value, null, null)
      return;
    }
    var request = { "task": "Playergehezutimestamp", "timestamp": seconds };
    postRequest(TODO_IP, request, function () { });
  });
});

function stop() {
  var request = {};
  request.task = "Playerstoppen";
  postRequest(TODO_IP, request, function (msg) {
    checkRadio(null);
  });
}

// var playpausebuttonjs = new mdc.iconToggle.MDCIconToggle(document.getElementById("playpause"));

var playpausebutton = document.getElementById('playpause');
function setPlayPauseButtonState(state) {
  if (state == "paused") {
    playpausebutton.firstElementChild.innerHTML = "play_arrow";
    playpausebutton.onclick = function () {
      postRequest(TODO_IP, { task: "Playerfortsetzen" }, function (msg) { });
    }
  } else if (state == "playing") {
    playpausebutton.firstElementChild.innerHTML = "pause";
    playpausebutton.onclick = function () {
      postRequest(TODO_IP, { task: "Playerpausieren" }, function (msg) { });
    }
  }
}
setPlayPauseButtonState("paused");


// playpausebutton.addEventListener('MDCIconToggle:change', ({ detail }) => {
//   var request = {};
//   if (detail.isOn) request.task = "Playerpausieren";
//   else request.task = "Playerfortsetzen";
//   postRequest(TODO_IP, request, function (msg) { });
// });

var SPACE_KEYCODE = 32;
var ESCAPE_KEYCODE = 27;
var ENTER_KEYCODE = 13;

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

  postRequest(TODO_IP, request, function (msg) { });

  song.value = "";
}

var songname = document.getElementById("song-name");



var previousPageId = null;
function showPage(pageid, button) {
  //drawer.open = false;

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
  //resize();
  previousPageId = pageid;
  if (pageid != "Geraete") localStorage.setItem('lastVisitedPage', pageid);
}

let lastVisitedPage = localStorage.getItem("lastVisitedPage");
if (lastVisitedPage == null) lastVisitedPage = "tvthek";
showPage(lastVisitedPage);
//showPage("Debug");

//const  = new mdc.snackbar.MDCSnackbar(document.querySelector('#mainSnackbar'));
// const dataObj = {
//   message: "test",
//   // actionText: 'Undo',
//   // actionHandler: function () {
//   //   console.log('my cool function');
//   // }
// };
// snackbar.show(dataObj);



window.onerror = function (msg, url, linenumber, columnNo, error) {
  showDialog("Error", msg + '<br/>URL: ' + url + '<br/>Line Number: ' + linenumber + ", " + columnNo + "<br/>" + JSON.stringify(error), null, "OK", null, null);
  return false;
}
var onlineIndicator = document.getElementById("onlineIndicator");
function setOnlineStatus(online) {
  if (online) {
    onlineIndicator.innerHTML = "leak_add";
  } else {
    onlineIndicator.innerHTML = "leak_remove";
  }
}



function update(response) {
  setOnlineStatus(true);
  updateMusic(response);
  updateFootball(response);

  var status = response.Status;
  if (status == undefined) status = {};
  if (status.Pausiert == false) setPlayPauseButtonState("playing");
  else setPlayPauseButtonState("paused");

  //Laufendes Lied eintragen
  if (status.name) songname.innerHTML = status.name;
  else songname.innerHTML = "";

  updateGeraete(response);

}
function getStatus() {
  getRequest(serverip + "Status", function () { });
}
getStatus();
//loadSerien();

function focus(stuff) {
  console.log("fh")

  // getStatus();
  //Serien inkludiert natürlich status
  loadSerien();
  loadSendungen();
}

function blur() {
  console.log("bh");
  setOnlineStatus(false);
}

window.addEventListener("focus", focus);
document.addEventListener("focus", focus);
window.addEventListener("blur", blur);
document.addEventListener("blur", blur);

