/*
const CONFIG = {
  allowedTags: {
    'p': 'publii-paragraph',
    'h1': 'publii-header',
    'h2': 'publii-header',
    'h3': 'publii-header',
    'h4': 'publii-header',
    'h5': 'publii-header',
    'h6': 'publii-header'
  },
  allowedNestedTags: {
    'p': [
      'a',
      'strong',
      'em',
      'mark',
      'code'
    ]
  },
  allowedAttributes: {
    'a': [
      'href',
      'target'
    ]
  }
};
*/

function flatStructure (input) {
  let output = input;
  return output;
}

function stripTags (input) {
  let output = input;
  return output;
}

function stripNestedTags (input) {
  let output = input;
  return output;
}

function stripAttributes (input) {
  let output = input.replace(/<([a-z0-9-]{1,})\s(.*?)>/gmi, function () {

  });
  return output;
}

export default function pasteRichText (input) {
  let output = '';
  output = flatStructure(input);
  output = stripTags(output);
  output = stripNestedTags(output);
  output = stripAttributes(output);

  return output;
};
