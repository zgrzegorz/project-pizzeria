import { settings, select } from '../settings.js';
import BaseWidget from './BaseWidget.js';

//deklaracja klasy AmountWidget która dziedziczy klasę BaseWidget
class AmountWidget extends BaseWidget {
  constructor(element) { //elementem jest div hours-amount i div people-amount
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;
    thisWidget.getElements(element);//elementem bedzie div o klasie widget-amount

    thisWidget.initActions();
    console.log('AmountWidget:', thisWidget);
    console.log('constructor arguments:', element);//elementem bedzie div o klasie widget-amount
  }

  getElements() {
    const thisWidget = this;

    /*na div widget-amount wyszukaj inputa o atrybucie input[name="amount"]*/
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    /*na div widget-amount wyszukaj link o atrybucie a[href="#less"]*/
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    /*na div widget-amount wyszukaj link o atrybucie a[href="#more"]*/
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }
  isValid(value) {
    return !isNaN(value)
      && value >= settings.amountWidget.defaultMin
      && value <= settings.amountWidget.defaultMax;
  }
  renderValue() {
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;//nadpisanie starej wartości value z inputa nową wartością newValue, tutaj zostanie uruchomiony geter
  }
  initActions() {//metoda ustawia oczekiwanie na zdarzenie zawierająca 3 eventy
    const thisWidget = this;
    thisWidget.dom.input.addEventListener('change', function () {
      thisWidget.setValue(thisWidget.dom.input.value);
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }

}
export default AmountWidget;
