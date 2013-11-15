Ajax = function(options) {

  var xhr = new XMLHttpRequest();

  xhr.onload = processRequest;

  function processRequest () {
    if(options.callback) options.callback(xhr);
  }

  this.doGet = function() {
    xhr.open("GET", options.url, true);
    xhr.overrideMimeType(options.contentType);
    xhr.send(null);
  }
}