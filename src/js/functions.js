/* global Handlebars */

const utils = {}; // eslint-disable-line no-unused-vars

utils.createDOMFromHTML = function (htmlString) {
  let div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};

utils.createPropIfUndefined = function (obj, key, value = []) {
  //console.log('output1', obj); //powstaje pusty obiekt
  if (!obj.hasOwnProperty(key)) { //np.sprawdza czy w obiekcie output istnieje klucz o nazwie np. amount
    obj[key] = value; //to do pustego obiektu o danym kluczu nadpisz pustą tablicą
  }
  console.log('output2', obj);
};

utils.serializeFormToObject = function (form) {
  let output = {};
  if (typeof form == 'object' && form.nodeName == 'FORM') {
    //console.log('form.elements', form.elements);//dotyczy tylko inputa dla produktu cake ma 1 input
    //let licznik = 0;
    for (let field of form.elements) { //na pojedyńczym inpucie formularza/uzyskujemy dostęp inputów formularza
      //licznik++;
      //console.log('dla cake', licznik);
      if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') { //na pojedyńczym inpucie formularza odczytaj...
        if (field.type == 'select-multiple') {
          for (let option of field.options) { //dostęp do opcji inputa
            if (option.selected) {
              utils.createPropIfUndefined(output, field.name);
              output[field.name].push(option.value);
            }
          }
        } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
          utils.createPropIfUndefined(output, field.name); //wywołaj na obiekcie metodę z arg1(bedącą obiektem) i arg2(nazwą)
          output[field.name].push(field.value); //dla obiektu o kluczu np amount dodaj do wartości która jest tablicą element o wartości =1
        }
      }
    }
  }
  //console.log('czym jest output', output);
  return output;
};

Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
