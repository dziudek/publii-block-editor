function contentFilter (code) {
  code = code.replace(/&gt;/gmi, '>');
  code = code.replace(/&lt;/gmi, '<');
  code = code.replace(/&nbsp;/gmi, '&');
  code = code.replace(/<script/gmi, '<publii-script');
  code = code.replace(/<\/script/gmi, '</publii-script');
  code = code.replace(/<iframe/gmi, '<publii-iframe');
  code = code.replace(/<\/iframe/gmi, '</publii-iframe');
  return code;
}

export default contentFilter;
