class BaseWidget {
  constructor(wrapperElement, initialValue) { // wrapperElement jest div hours-amount i div people-amount z AmountWidget i div date-picker z klasy DatePicker
    const thisWidget = this;
    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;
    console.log(wrapperElement);
    thisWidget.correctValue = initialValue;
  }
  //metoda wykonywana przy każdej próbie odczytania wartości właściwości value
  get value() {
    const thisWidget = this;
    return thisWidget.correctValue;
  }
  //metoda wykonywana przy każdej próbie ustawienia nowej wartości właściwości value
  set value(value) {
    const thisWidget = this;
    const newValue = parseInt(value);//konwersja stringa na liczbę ponieważ input jest type="text"
    /*TODO: Add validation*/
    if (newValue != thisWidget.correctValue && thisWidget.isValid(newValue)) {
      thisWidget.correctValue = newValue;//dodanie do obiektu AmountWidget właśc.value o wartości przekazanej z f.setValue
      thisWidget.announce();//wywołanie eventu wbudowanego w przeglądarkę
    }
    thisWidget.renderValue();
  }
  setValue(value) {
    const thisWidget = this;
    thisWidget.value = value;
  }
  parseValue(value) {
    return parseInt(value);
  }
  isValid(value) {
    return !isNaN(value);
  }
  renderValue() {
    const thisWidget = this;
    thisWidget.dom.wrapper.innerHTML = thisWidget.value;//nadpisanie starej wartości value z inputa nową wartością newValue
  }
  announce() {//tworzy instancję zdarzenia w oparciu o klasę Event wbudowaną w przeglądarkę
    const thisWidget = this;
    //const event = new Event('updated');
    const event = new CustomEvent('updated', { bubbles: true }); //dla customowego eventu bąbelkowanie trzeba włączyć samemu
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}
export default BaseWidget;
