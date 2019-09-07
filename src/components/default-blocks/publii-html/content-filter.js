function contentFilter (code) {
  code = code.replace(/&gt;/gmi, '>');
  code = code.replace(/&lt;/gmi, '<');
  code = code.replace(/&nbsp;/gmi, '&');
  code = code.replace(/<script/gmi, '<publii-script');
  code = code.replace(/<\/script/gmi, '</publii-script');
  code = code.replace(/<webview[\s\S]*?>[\s\S]*?<\/[\s\S]*?webview>/gmi, '');
  code = code.replace(/<iframe/gmi, '<webview');
  code = code.replace(/<\/[\s\S]*?iframe/gmi, '</webview');

  return code;
}

module.exports = contentFilter;
