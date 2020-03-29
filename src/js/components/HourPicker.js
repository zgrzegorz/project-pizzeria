import BaseWidget from './BaseWidget.js';
import { settings, select } from '../settings.js';
import utils from '../utils.js';

class HourPicker extends BaseWidget {
  constructor(wrapper) { //wrapper to div hour-picker
    super(wrapper, settings.hours.open); //arg2. godz.12
    const thisWidget = this;
    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapper;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);//pobierzemy inputa
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);//pobierzemy div output
    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;
  }
  initPlugin() {
    const thisWidget = this;
    //-ignorowanie pluginu rangeSlider
    // eslint-disable-next-line no-undef
    rangeSlider.create(thisWidget.dom.input);
    thisWidget.dom.input.addEventListener('input', function () {
      thisWidget.value = thisWidget.dom.input.value;
    });
  }
  //nadpisanie metody parseValue
  parseValue(value) {
    console.log(value);
    return utils.numberToHour(value);//zamiana liczb na zapis godzinowy
  }
  //nadpisanie metody isValid z klasy nadrzędnej BaseWidget przyjmuje true
  isValid() {
    return true;
  }
  renderValue() {
    const thisWidget = this;
    thisWidget.dom.output.innerHTML = thisWidget.value;//przypisanie wartości widgetu do div output wartości wybranej z suwaka
  }
}
export default HourPicker;
