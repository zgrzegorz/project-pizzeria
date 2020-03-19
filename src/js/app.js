import { settings, select, classNames, templates } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';

//deklaracja obiektu app
const app = {
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
        console.log('parsedResponse', parsedResponse);
        /*save parsedResponse as thisApp.data.products*/
        thisApp.data.products = parsedResponse;
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
    thisApp.initData();
    //thisApp.initMenu();
    thisApp.initCart();
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

