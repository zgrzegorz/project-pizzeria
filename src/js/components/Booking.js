import { select, templates, settings, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

//deklaracja klasy Booking
class Booking {
  constructor(element) { //element to div booking-wrapper
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
  }
  //będzie pobierać dane z API używając adresów z parametrami filtrującymi wyniki
  getData() {
    const thisBooking = this;
    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);
    const params = {
      booking: [
        startDateParam,
        endDateParam
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam
      ],
    };
    console.log('getData params', params);
    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'), //zawiera adres endpointu API zwracającego listę rezerwacji
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'), //zwróci listę wydarzeń jednorazowych
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'), //zwróci listę wydarzeń cyklicznych
    };
    //console.log('getData urls', urls);
    //Zapytania do API
    Promise.all([
      fetch(urls.booking),// localhost:3131/booking?date_gte=2020-03-26&date_lte=2020-04-08
      fetch(urls.eventsCurrent), // localhost:3131/event?repeat=false&date_gte=2020-03-26&date_lte=2020-04-08
      fetch(urls.eventsRepeat), // localhost:3131/event?repeat_ne=false&date_gte=2020-03-26&date_lte=2020-04-08
    ])
      .then(function (allResponses) {
        const bookingsResponse = allResponses[0];
        //console.log(bookingsResponse);
        const eventsCurrentResponse = allResponses[1];
        console.log(eventsCurrentResponse);
        const eventsRepeatResponse = allResponses[2];
        return Promise.all(
          [
            bookingsResponse.json(),
            eventsCurrentResponse.json(),
            eventsRepeatResponse.json(),
          ]
        );
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) { //pierwszy element tablicy zostaje zapisany w zmiennej bookings
        // console.log(bookings);
        // console.log(eventsCurrent);
        // console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }
  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;
    thisBooking.booked = {}; //lista zajętych stolików
    for (let item of bookings) {
      // Pozycja rezerwacji (data, godzina, czas trwania, stolik)
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;
    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    console.log('thisBooking.booked', thisBooking.booked);
    //console.log(eventsRepeat);
    thisBooking.updateDOM();
  }
  makeBooked(date, hour, duration, table) {
    const thisBooking = this;
    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }
    const startHour = utils.hourToNumber(hour);
    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      console.log('loop', hourBlock);
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
  }
  updateDOM() {
    const thisBooking = this;
    thisBooking.date = thisBooking.datePicker.value;
    console.log(typeof (thisBooking.hourPicker.value));
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    let allAvailable = false;
    if (typeof thisBooking.booked[thisBooking.date] == 'undefined' || typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined') {
      allAvailable = true;
    }
    for (let table of thisBooking.dom.tables) {
      console.log(table);
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }
      if (!allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
      /*wybór jednego z dostępnych stolików*/
      table.addEventListener('click', function () {
        console.log('Wybór stolika', table);
        let choosenTable = table.classList.contains(classNames.booking.tableBooked);//sprawdza czy stolik ma klasę booked jeżeli tak zwróći true
        console.log(choosenTable);

        if (!choosenTable) {
          table.classList.add(classNames.booking.tableBooked);
          thisBooking.clickedTable = tableId;
        } else {
          console.log('Stół jest zarezerwowany!');
        }
      });
    }
  }
  sendBooking() {
    const thisBooking = this;
    const bookingUrl = settings.db.url + '/' + settings.db.booking;
    const bookingPayload = {
      date: thisBooking.date,
      hour: thisBooking.hour,
      table: thisBooking.clickedTable,
      duration: thisBooking.hoursAmount.value,
      ppl: thisBooking.peopleAmount.value,
      address: thisBooking.dom.address.value,
      phone: thisBooking.dom.phone.value,
      tables: [],
    };

    for (let table of thisBooking.dom.starters) {
      if (table.checked == true) {
        bookingPayload.tables.push(table.value);
      }
    }
    const bookingOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingPayload)
    };

    fetch(bookingUrl, bookingOptions)
      .then(function (response) {
        return response.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }
  render(element) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element; //div booking-wrapper
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    //console.log(thisBooking.dom.wrapper);
    //div people-amount
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    //console.log(thisBooking.dom.peopleAmount);
    //div hours-amount
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    //console.log(thisBooking.dom.hoursAmount);
    //div date-picker
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    console.log(thisBooking.dom.datePicker);
    //div hour-picker
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    console.log(thisBooking.dom.hourPicker);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
    console.log(thisBooking.dom.address);

    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    console.log(thisBooking.dom.phone);

    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starter);
    console.log(thisBooking.dom.starters);
  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    //utworzenie nowej instancji klasy DatePicker z arg.div date-picker
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
    });
    thisBooking.dom.wrapper.addEventListener('submit', function () {
      event.preventDefault();
      thisBooking.sendBooking();
    });
  }
}
export default Booking;
