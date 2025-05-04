function streamMedia(url) {
    var request = { "task": "YoutubeVideostreamen", "name": url, "now": true };
    postRequest(TODO_IP, request, function (msg) { });
}

function isSharedUrlStreamable(string) {
    if (typeof string !== 'string') {
        return false;
    }
    if (string.length === 0) {
        return false;
    }
    const allowedProtocols = ['http:', 'https:'];
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return allowedProtocols.indexOf(url.protocol) !== -1 && url.hostname && url.hostname.length > 0;
}

window.addEventListener('DOMContentLoaded', function () {
    const parsedUrl = new URL(window.location);
    // searchParams.get() will properly handle decoding the values.
    const title = parsedUrl.searchParams.get('title');
    const text = parsedUrl.searchParams.get('text');
    const url = parsedUrl.searchParams.get('url');
    console.log('Title shared: ' + title);
    console.log('Text shared: ' + text);
    console.log('URL shared: ' + url);
    // android yt page sends it in the text field  - check all three fields if it contains a url
    let firstStreamable = [url, text, title].find(function (s) { return isSharedUrlStreamable(s) });
    if (null != firstStreamable) {
        console.log('Found streamable url: ' + firstStreamable);
        streamMedia(firstStreamable);
    }
});

// var url = event.clipboardData.getData('text/plain');
// console.log(url)
// var pasteButton = document.getElementById("addUrlToPlaylist");

// function addUrlToPlaylist() {
//     song.focus();
//     song.select();
//     document.execCommand('paste');
// }
