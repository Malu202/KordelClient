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
  postRequest(serverip + "todo", request, function (msg) {});
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

  postRequest(serverip + "todo", request, function (msg) {});

  song.value = "";
}

var songname = document.getElementById("song-name");


function update(response) {
  updateMusic(response);

  var status = response.Status;
  if (status == undefined) status = {};
  if (status.Pausiert == false) playpausebuttonjs.on = false;
  else playpausebuttonjs.on = true;

  //Laufendes Lied eintragen
  if (status.name) songname.innerHTML = status.name;
  else songname.innerHTML = "Song";
    
  updateGeraete(response);

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

const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('#mainSnackbar'));
// const dataObj = {
//   message: "test",
//   // actionText: 'Undo',
//   // actionHandler: function () {
//   //   console.log('my cool function');
//   // }
// };
// snackbar.show(dataObj);

function streamMedia(url) {
  var request = { "task": "YoutubeVideostreamen", "url": url, "now": true, "autoplay": false };
  postRequest(serverip + "todo", request, function (msg) { });
}

window.onerror = function (msg, url, linenumber) {
  showDialog("Error", msg + '\nURL: ' + url + '\nLine Number: ' + linenumber, null, "OK", null, null);
  return true;
}
