

var TD = {};

function __modifyCorsUrl (url) {
  return 'http://127.0.0.1:8081/' + url;
}
jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = __modifyCorsUrl(options.url);
    }
});
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
function navigateTo(path, replace) {
  if (replace) {
    window.history.replaceState({}, null, path);
  } else {
    window.history.pushState({}, null, path);
    window.dispatchEvent(new CustomEvent('location-changed'));
  }
}
function isDragSourceExternalFile(dataTransfer){
  // Source detection for Safari v5.1.7 on Windows.
  if (typeof Clipboard != 'undefined') {
    if (dataTransfer.constructor == Clipboard) {
      if (dataTransfer.files.length > 0)
        return true;
      else
        return false;
    }
  }

  // Source detection for Firefox on Windows.
  if (typeof DOMStringList != 'undefined'){
    var DragDataType = dataTransfer.types;
    if (DragDataType.constructor == DOMStringList){
      if (DragDataType.contains('Files'))
        return true;
      else
        return false;
    }
  }

  // Source detection for Chrome on Windows.
  if (typeof Array != 'undefined'){
    var DragDataType = dataTransfer.types;
    if (DragDataType.constructor == Array){
      if (DragDataType.indexOf('Files') != -1)
        return true;
      else
        return false;
    }
  }
}