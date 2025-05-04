function streamMedia(url) {
    var request = { "task": "YoutubeVideostreamen", "name": url, "now": true };
    postRequest(TODO_IP, request, function (msg) { });
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
    if (typeof url == "string" && url.length > 0) {
        streamMedia(url);
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
