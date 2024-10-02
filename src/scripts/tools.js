//TOOLS



var detectedServerUrl = null;
var detectServerUrlTask = null;
var serverIpCandidates = ["10.0.0.135", "192.168.0.52"];

function detectServerUrl() {
  if (detectedServerUrl) return Promise.resolve(detectedServerUrl);
  if (detectServerUrlTask) return detectServerUrlTask;
  console.log("Detecting server URL...");
  detectServerUrlTask = Promise.any(serverIpCandidates.map(function (host) {
    var url = "http://" + host + "/";
    return fetch(url + "Status", getFetchOptions()).then(function (response) {
      if (response.ok) {
        return url;

      } else {
        throw new Error("Failed to fetch " + url);
      }
    });
  })).then(function (url) {
    console.log("Detected server URL: " + url);
    detectedServerUrl = url;
    return url;
  }).finally(function () {
    detectServerUrlTask = null;
  });
  return detectServerUrlTask;
}

function replaceServerUrl(url) {
  return detectServerUrl().then(function (serverUrl) {
    return url.replace(/^<detect-server-url>/, serverUrl);
  });
}

function getFetchOptions(fetchOptions) {
  fetchOptions = fetchOptions || {};
  if (USE_PRIVATE_NETWORK_ACCESS) {
    fetchOptions.targetAddressSpace = "private";
    fetchOptions.mode = "cors";
  }
  return fetchOptions;
}

var getRequest = function (url, callback) {
  if (url.startsWith("<detect-server-url>")) {
    replaceServerUrl(url).then(function (newUrl) {
      return fetch(newUrl, getFetchOptions());
    })
      .then(function (response) { return response.json(); })
      .then(function (json) {
        update(json);
        callback(json);
      })
      .catch(function (error) {
        console.error('Error:', error);
      });
  } else {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.addEventListener('load', function (event) {
      var json = JSON.parse(xhr.responseText);
      update(json);
      callback(json);
    });
    xhr.send();
  }
  // console.log("-------GET");
  // console.log(url);
}

var postRequest = function (url, jsondata, callback) {
  if (url.startsWith("<detect-server-url>")) {
    replaceServerUrl(url).then(function (newUrl) {
      return fetch(newUrl, getFetchOptions({
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(jsondata),
      }));
    })
      .then(function (response) { return response.json(); })
      .then(function (responseJSON) {
        snackbarNotification(responseJSON.message, null, null);
        update(responseJSON);
        callback(responseJSON);
      })
      .catch(function (error) {
        console.error('Error:', error);
      });
  } else {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);

    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = function () {
      if (http.readyState == 4) {
        var responseJSON = JSON.parse(http.responseText);
        // const dataObj = {
        //   message: responseJSON.message,
        // };
        //snackbar.show(dataObj);
        snackbarNotification(responseJSON.message, null, null);
        update(responseJSON);
        callback(responseJSON);
      }
    }
    http.send(JSON.stringify(jsondata));
  }

  // console.log("-------POST");
  // console.log(url);
  // console.log("data: ");
  // console.log(jsondata);
}

var deleteRequest = function (url, jsondata, callback) {
  var http = new XMLHttpRequest();
  http.open("DELETE", url, true);

  http.setRequestHeader("Content-type", "application/json");

  http.onreadystatechange = function () {
    if (http.readyState == 4) {
      var responseJSON = JSON.parse(http.responseText);
      // const dataObj = {
      //   message: responseJSON.message,
      // };
      // snackbar.show(dataObj);
      snackbarNotification(responseJSON.message, null, null);
      update(responseJSON);
      callback(responseJSON);
    }
  }
  http.send(JSON.stringify(jsondata));
  // console.log("-------DELETE");
  // console.log(url);
  // console.log("data: ");
  // console.log(jsondata);
}
// var radioDialog = document.getElementById("dialog");
// var dialogHeading = document.getElementById("dialogHeading")
// var dialogBody = document.getElementById("dialogBody");
// var dialogCancel = document.getElementById("dialogCancel");
// var dialogAccept = document.getElementById("dialogAccept");

var snackbar = document.getElementById("mainSnackbar");
var snackbarText = document.getElementById("mainSnackbarText")
function snackbarNotification(text, buttonText, onButtonClick) {
  snackbarText.innerHTML = text;
  snackbar.classList.add("mdc-snackbar--open");
  setTimeout(function () {
    snackbar.classList.remove("mdc-snackbar--open");
  }, 1200);
}
function showCustomDialog(heading, bodyObject, cancel, accept, oncancel, onaccept) {
  dialogHeading.innerHTML = heading;
  //dialogBody.innerHTML = body;
  dialogBody.innerHTML = "";
  dialogBody.appendChild(bodyObject);

  if (cancel) {
    dialogCancel.innerHTML = cancel;

    dialogCancel.onclick = function () {
      hideDialog();
      if (oncancel) oncancel();
    };

  } else {
    dialogCancel.style.display = "none";
  }
  if (accept) {
    dialogAccept.innerHTML = accept;

    dialogAccept.onclick = function () {
      hideDialog();
      if (onaccept) onaccept();
    };
  } else {
    dialogAccept.style.display = "none";
  }

  dialog.classList.add("mdc-dialog--open");
}

function hideDialog() {
  dialog.classList.remove("mdc-dialog--open");
  dialogAccept.style.display = "block";
  dialogCancel.style.display = "block";
}
function showDialog(heading, bodyText, cancel, accept, oncancel, onaccept) {
  var bodyDiv = document.createElement("div");
  bodyDiv.innerHTML = bodyText;
  showCustomDialog(heading, bodyDiv, cancel, accept, oncancel, onaccept);
}
//showDialog("heading", "bodyText", "cancel", "accept", null, null);
