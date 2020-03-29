import { select, settings } from '../settings.js';
import utils from '../utils.js';
import BaseWidget from './BaseWidget.js';

class DatePicker extends BaseWidget {
  constructor(wrapper) { //wrapperem będzie div date-picker od instancji DatePicker
    super(wrapper, utils.dateToStr(new Date())); //super jest konstruktorem klasy nadrzędnej BaseWidget, a wrapper będzie wrapperem konstruktora DatePicker
    const thisWidget = this;
    thisWidget.dom.wrapper = wrapper;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();
  }
  initPlugin() {
    const thisWidget = this;
    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    //zainicjować-uruchomić plugin flatpickr-składnia uruchomienia flatpickr
    //-ignorowanie pluginu flatpickr
    // eslint-disable-next-line no-undef
    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      disable: [
        function (date) {
          // return true to disable
          return (date.getDay() === 1);
        }
      ],
      locale: {
        firstDayOfWeek: 1 // start week on Monday
      },
      onChange: function (dateStr) {
        thisWidget.value = dateStr;
      }
    });
  }
  //nadpisanie metody parseValue
  parseValue(value) {
    return value;
  }
  //nadpisanie metody isValid
  isValid() {
    return true;
  }
  //nadpisanie metody renderValue
  renderValue() {
    //console.log();
  }
}
export default DatePicker;
