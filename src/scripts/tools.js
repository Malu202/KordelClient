//TOOLS
var getRequest = function (url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.addEventListener('load', function (event) {
    var json = JSON.parse(xhr.responseText);
    update(json);
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
      var responseJSON = JSON.parse(http.responseText);
      const dataObj = {
        message: responseJSON.message,
      };
      snackbar.show(dataObj);
      update(responseJSON);
      callback(responseJSON);
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
      var responseJSON = JSON.parse(http.responseText);
      const dataObj = {
        message: responseJSON.message,
      };
      snackbar.show(dataObj);
      update(responseJSON);
      callback(responseJSON);
    }
  }
  http.send(JSON.stringify(jsondata));
}
var content = document.getElementById("content");
function showDialog1(heading, body, cancel, accept, oncancel, onaccept) {
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
  //var dialogjs = new window.mdc.dialog.MDCDialog(dialog);
  dialogjs.listen('MDCDialog:accept', onaccept);
  dialogjs.listen('MDCDialog:cancel', oncancel);
  dialogjs.show();
}

var radioDialog = document.getElementById("dialog");
var dialogHeading = document.getElementById("dialogHeading")
var dialogBody = document.getElementById("dialogBody");
var dialogCancel = document.getElementById("dialogCancel");
var dialogAccept = document.getElementById("dialogAccept");

function showDialog(heading, body, cancel, accept, oncancel, onaccept) {
  dialogHeading.innerHTML = heading;
  dialogBody.innerHTML = body;
  dialogCancel.innerHTML = cancel;
  dialogAccept.innerHTML = accept;


  dialogCancel.addEventListener("click", function () {
    hideDialog();
    if (oncancel) oncancel();
  });
  dialogAccept.addEventListener("click", function () {
    hideDialog();
    if (onaccept) onaccept();
  });

  dialog.classList.add("mdc-dialog--open");
}

function hideDialog() {
  dialog.classList.remove("mdc-dialog--open");
}