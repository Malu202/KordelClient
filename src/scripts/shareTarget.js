function streamMedia(url) {
    var request = { "task": "YoutubeVideostreamen", "url": url, "now": true, "autoplay": false };
    postRequest(TODO_IP, request, function (msg) { });
}

window.addEventListener('DOMContentLoaded', function () {
    const parsedUrl = new URL(window.location);
    // searchParams.get() will properly handle decoding the values.
    console.log('Title shared: ' + parsedUrl.searchParams.get('title'));
    console.log('Text shared: ' + parsedUrl.searchParams.get('text'));
    console.log('URL shared: ' + parsedUrl.searchParams.get('url'));
    streamMedia(parsedUrl.searchParams.get('url'));
});