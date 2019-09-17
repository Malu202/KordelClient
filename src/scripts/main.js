mdc.autoInit();


//DRAWER
var drawerEl = document.getElementsByClassName('mdc-drawer--modal')[0];
var menuButton = document.getElementById('menu');
menuButton.onclick = openDrawer;

function openDrawer() {
  drawerEl.classList.add("mdc-drawer--open");
  document.onclick = openDrawerClick;
}
//überprüft bei geöffnetem Drawer alle klicks ob der Drawer geschlossen werden muss
function openDrawerClick(clickEvent) {
  if (clickEvent.srcElement != menuButton && clickEvent.srcElement != drawerEl) {
    closeDrawer();
    document.onclick = null;
  }
}
function closeDrawer() {
  drawerEl.classList.remove("mdc-drawer--open");
}
//open drawer on launch (only on mobile)
console.log(menuButton.style.display)

var menuButtonDisplay = window.getComputedStyle(menuButton).display;
if(menuButtonDisplay != "none"){
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

function setSwitchState(Switch, state){
  var SwitchDiv = Switch.parentElement.parentElement.parentElement;
  if(state == true){
    SwitchDiv.classList.add(CHECKED_SWITCH_CLASSNAME);
  } 
  if(state == false){
    SwitchDiv.classList.remove(CHECKED_SWITCH_CLASSNAME);
  }
}
//TOOLBAR mdc-toolbar-fixed-adjust damit sich der adjust anpasst beim resizen
window.addEventListener("resize", resize, true);


function resize() {
  var toolbar = new mdc.topAppBar.MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
  toolbar.fixedAdjustElement = document.querySelector('.mdc-top-app-bar--fixed-adjust');
}
//var serverip = "http://10.0.0.40:1337/";
var serverip = "http://192.168.0.185:1337/";
var TODO_IP = serverip + "todo";

var rewindButton = document.getElementById("rewindButton");
//var skipForwardButton = document.getElementById("skipForwardButton");
//var skipBackButton = document.getElementById("skipBackButton");
var forwardButton = document.getElementById("forwardButton");

rewindButton.addEventListener('click', function () {
  var request = { "task": "Playerzurueckspulen" };
  postRequest(TODO_IP, request, function () { });
});
forwardButton.addEventListener('click', function () {
  var request = { "task": "Playervorspulen" };
  postRequest(TODO_IP, request, function () { });
});

function stop() {
  var request = {};
  request.task = "Playerstoppen";
  postRequest(TODO_IP, request, function (msg) {
    checkRadio(null);
  });
}

var playpausebuttonjs = new mdc.iconToggle.MDCIconToggle(document.getElementById("playpause"));

const playpausebutton = document.getElementById('playpause');
playpausebutton.addEventListener('MDCIconToggle:change', ({ detail }) => {
  var request = {};
  if (detail.isOn) request.task = "Playerpausieren";
  else request.task = "Playerfortsetzen";
  postRequest(TODO_IP, request, function (msg) { });
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

  postRequest(TODO_IP, request, function (msg) { });

  song.value = "";
}

var songname = document.getElementById("song-name");


function update(response) {
  updateMusic(response);
  updateFootball(response);

  var status = response.Status;
  if (status == undefined) status = {};
  if (status.Pausiert == false) playpausebuttonjs.on = false;
  else playpausebuttonjs.on = true;

  //Laufendes Lied eintragen
  if (status.name) songname.innerHTML = status.name;
  else songname.innerHTML = "";

  updateGeraete(response);

}
getRequest(serverip + "Status", function () { });

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
  resize();
  previousPageId = pageid;
}
showPage("musik");

//const  = new mdc.snackbar.MDCSnackbar(document.querySelector('#mainSnackbar'));
// const dataObj = {
//   message: "test",
//   // actionText: 'Undo',
//   // actionHandler: function () {
//   //   console.log('my cool function');
//   // }
// };
// snackbar.show(dataObj);



// window.onerror = function (msg, url, linenumber) {
//   showDialog("Error", msg + '\nURL: ' + url + '\nLine Number: ' + linenumber, null, "OK", null, null);
//   return true;
// }
