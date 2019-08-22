export default class ConversionHelpers {
  stripTags (input) {
    let div = document.createElement('div');
    div.innerHTML = input;
    let output = div.innerText;

    return output;
  }
}
