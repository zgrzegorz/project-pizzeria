import { settings, select } from '../settings.js';

//deklaracja klasy AmountWidget
class AmountWidget {
  constructor(element) {
    const thisWidget = this;
    thisWidget.getElements(element);//elementem bedzie div o klasie widget-amount
    thisWidget.value = settings.amountWidget.defaultValue;//początkowa wartość i poprzednia wartość
    thisWidget.setValue(thisWidget.input.value);//przekazujemy do funkcji wartość jaka znajduje się lub wpisaliśmy do inputa typu text
    thisWidget.initActions();
    console.log('AmountWidget:', thisWidget);
    console.log('constructor arguments:', element);//elementem bedzie div o klasie widget-amount
  }

  getElements(element) {
    const thisWidget = this;
    /*elementem bedzie div o klasie widget-amount*/
    thisWidget.element = element;
    /*na div widget-amount wyszukaj inputa o atrybucie input[name="amount"]*/
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    /*na div widget-amount wyszukaj link o atrybucie a[href="#less"]*/
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    /*na div widget-amount wyszukaj link o atrybucie a[href="#more"]*/
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }
  setValue(value) {
    const thisWidget = this;
    const newValue = parseInt(value);//konwersja stringa na liczbę ponieważ input jest type="text"
    /*TODO: Add validation*/
    if (newValue != thisWidget.value && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
      thisWidget.value = newValue;//dodanie do obiektu AmountWidget właśc.value o wartości przekazanej z f.setValue
      thisWidget.announce();//wywołanie eventu wbudowanego w przeglądarkę
    }
    thisWidget.input.value = thisWidget.value;//nadpisanie starej wartości value z inputa nową wartością newValue
  }
  initActions() {//metoda ustawia oczekiwanie na zdarzenie zawierająca 3 eventy
    const thisWidget = this;
    thisWidget.input.addEventListener('change', function () {
      thisWidget.setValue(thisWidget.input.value);
    });

    thisWidget.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
  announce() {//tworzy instancję zdarzenia w oparciu o klasę Event wbudowaną w przeglądarkę
    const thisWidget = this;
    //const event = new Event('updated');
    const event = new CustomEvent('updated', { bubbles: true }); //dla customowego eventu bąbelkowanie trzeba włączyć samemu
    thisWidget.element.dispatchEvent(event);
  }
}
export default AmountWidget;
