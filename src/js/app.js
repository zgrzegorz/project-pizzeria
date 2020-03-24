import { settings, select, classNames, templates } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

//deklaracja obiektu app
const app = {
  //metoda obsługująca rezerwacje
  initBooking: function () {
    const thisApp = this;
    //bookingElement to div booking-wrapper
    const bookingElement = document.querySelector(select.containerOf.booking);
    thisApp.newBooking = new Booking(bookingElement);

  },
  //metoda obsługująca podstrony
  initPages: function () {
    const thisApp = this;
    //pobranie dwóch sekcji w postaci NodeList
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    //pobieramy wszystkie linki main-nav a
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    const idFromHash = window.location.hash.replace('#/', '');
    console.log('idFromHash', idFromHash);
    let pageMatchingHash = thisApp.pages[0].id;
    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }
    //spośród podstron pobieramy pierwszą o wskazanym id
    //thisApp.activatePage(thisApp.pages[0].id);
    //console.log(pageMatchingHash);
    thisApp.activatePage(pageMatchingHash);
    //kliknięcie w link nawigacyjny
    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();
        /*get page id from href attribute*/
        const id = clickedElement.getAttribute('href').replace('#', '');
        /*run thisApp.activatePage with that id*/
        thisApp.activatePage(id);
        /*change URL hash*/
        window.location.hash = '#/' + id;
      });
    }
  },
  activatePage: function (pageId) {
    const thisApp = this;
    //console.log(pageId);
    /*add class "active" to matching pages, remove from non-matching*/
    for (let page of thisApp.pages) {
      /* if (page.id == pageId) {
         page.classList.add(classNames.pages.active);
       } else {
         page.classList.remove(classNames.pages.active);
       }*/
      page.classList.toggle(classNames.pages.active, page.id == pageId); //jeżeli warunek będzie spałniony klasa active zostanie dodana jeżeli nie zostanie odebrana
    }
    /*add class "active" to matching links, remove from non-matching*/
    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },
  initMenu: function () {//deklaracja metody initMenu odpowiedz. za inicjowanie instancji Product
    const thisApp = this;
    console.log('thisApp.data', thisApp.data);
    for (let productData in thisApp.data.products) {//dla każdego klucza obiektu products
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      console.log('productData:', productData);
      console.log(thisApp.data.products[productData]);
    }
    //const testProduct = new Product();
    //console.log('testProduct:', testProduct);
  },
  //inicjalizacja danych
  initData: function () {
    const thisApp = this; //this wskazuje na obiekt app
    //thisApp.data = dataSource; po wprowadzeniu API
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)//wysłanie zapytania pod adres endpointu
      .then(function (rawResponse) {//otrzymana odp.konwertowana z JSON na tablicę
        return rawResponse.json();
      })
      .then(function (parsedResponse) {//skonwertowana odp.
        //console.log('parsedResponse', parsedResponse);
        /*save parsedResponse as thisApp.data.products*/
        thisApp.data.products = parsedResponse;
        //console.log(thisApp.data.products);
        /*execute initMenu method*/
        thisApp.initMenu();
      });
    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },
  init: function () {
    const thisApp = this; //this wskazuje na obiekt app
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initData();
    //thisApp.initMenu();
    thisApp.initCart();
    thisApp.initBooking();
  },
  initCart: function () {//deklaracja metody initCart odpowiedz. za inicjowanie instancji Cart
    const thisApp = this;
    /*cała zawartość kontenera koszyka div id="cart" class="cart"*/
    const cartElem = document.querySelector(select.containerOf.cart);
    //console.log(cartElem);
    thisApp.cart = new Cart(cartElem); //ozn. to, że poza obiektem app możemy wywołać ją za pomocą app.cart, wywołując app.cart wywołamy utworzenie nowej instancji new Cart do której przekazujemy cały kontener koszyka
    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  }
};
//wywołanie metod
app.init();

