/* global Handlebars, dataSource */

const utils = {}; // eslint-disable-line no-unused-vars

utils.createDOMFromHTML = function (htmlString) {
  let div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};

utils.createPropIfUndefined = function (obj, key, value = []) {
  //console.log('output1', obj); //powstaje pusty obiekt
  if (!obj.hasOwnProperty(key)) { //np.sprawdza czy w obiekcie output istnieje klucz o nazwie np. amount i odwraca znaczenie
    obj[key] = value; //to do pustego obiektu dodaj klucz i przypisz mu wartość pustej tablicy i wynik przekaż do wywołania
  }
  console.log('output2', obj);
};

utils.serializeFormToObject = function (form) {
  let output = {};
  if (typeof form == 'object' && form.nodeName == 'FORM') {
    //console.log('form.elements', form.elements);//dotyczy tylko inputa dla produktu cake ma 1 input
    //let licznik = 0;
    for (let field of form.elements) { //na pojedyńczym inpucie-select formularza/uzyskujemy dostęp do inputów/selektów formularza
      //licznik++;
      //console.log('dla cake', licznik);
      /*ma name i (!nie ma disabled)ale ! ozn. zmiana na true i type różne od file -reset -submit-button tak warunek ok*/
      if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') { //na pojedyńczym inpucie formularza odczytaj...
        if (field.type == 'select-multiple') {
          for (let option of field.options) { //wykonuje pętlę 6 razy na wszystkich elementach option należących do selectu
            if (option.selected) {
              utils.createPropIfUndefined(output, field.name);
              output[field.name].push(option.value);
            }
          }
        } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
          utils.createPropIfUndefined(output, field.name); //wywołaj na obiekcie metodę z arg1(bedącą obiektem pustym) i arg2(nazwą inputa amount)
          output[field.name].push(field.value); //dla obiektu o kluczu np amount dodaj do wartości która jest tablicą element o wartości =1
          //console.log('czym jest output', output);
        }
      }
    }
  }
  //console.log('czym jest output', output);
  return output;
};
/*stara funkcja Handlebars z modulu_8
Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
*/
utils.convertDataSourceToDbJson = function () { //konwersja dataSource.products na format JSON
  const productJson = [];
  for (let key in dataSource.products) {
    productJson.push(Object.assign({ id: key }, dataSource.products[key]));
  }
  console.log(productJson);
  console.log(JSON.stringify({ product: productJson, order: [] }, null, '  '));
};

Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('joinValues', function (input, options) {
  return Object.values(input).join(options.fn(this));
});
