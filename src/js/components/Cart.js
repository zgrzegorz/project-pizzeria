import { settings, select, classNames, templates } from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

//deklaracja klasy Cart koszyka
class Cart {
  constructor(element) {
    const thisCart = this; //this wskazuje na new Cart
    thisCart.products = []; //tablica przechowująca produkty dodane do koszyka
    thisCart.getElements(element); //element będzie divem kontenerem koszyka
    thisCart.initActions();
    console.log('new Cart', thisCart);
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
  }
  getElements(element) {
    const thisCart = this;
    thisCart.dom = {}; //obiekt przechowujący wszystkie elementy DOM wyszukane w komponencie koszyka dla ułatwienia nazewnictwa
    thisCart.dom.wrapper = element;//element będzie divem kontenerem koszyka
    /*do obiektu dom dodajemy właściwość toggleTigger przechowującej div class="cart__summary"*/
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    /*do obiektu dom dodajemy właściwość productList przechowującą div class="cart__order-summary" lista ul*/
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    //Aktualne sumy
    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
    for (let key of thisCart.renderTotalsKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);//1. span-cart__total-number 2.cart__total-price strong, cart__order-total .cart__order-price-sum strong 3. cart__order-subtotal .cart__order-price-sum strong 4.cart__order-delivery .cart__order-price-sum strong
      console.log(thisCart.dom[key]);
    }
    console.log(thisCart.dom);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
  }
  initActions() {//metoda będzie pokazywać i ukrywać koszyk produktów
    const thisCart = this;
    /*nasłuchiwanie na kliknięcie w nagłówek koszyka*/
    thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    /*nasłuchiwanie na zmianę na liscie produktów umieszczonych w koszyku*/
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    /*nasłuchiwanie na usuniecie produktów z listy umieszczonych w koszyku*/
    thisCart.dom.productList.addEventListener('remove', function () {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }
  add(menuProduct) {//dodanie instancji produktu thisProduct do kosza
    const thisCart = this;
    console.log('dodany produkt', menuProduct); //jest produktem wybranym przez użytkownika
    /*generate HTML based on template-wygenerować kod HTML pojedynczego produktu wybranego przez użytkownika*/
    const generatedHTML = templates.cartProduct(menuProduct);
    console.log('generatedHTML:', generatedHTML);
    /*create element using utils.createElementFromHTML-stworzyć element DOM na podstawie tego kodu produktu*/
    const generatedDOM = utils.createDOMFromHTML(generatedHTML); //div.firstChild
    console.log(generatedDOM);
    /*add generatedDOM-przypisać do obiektu dom do właść. productList nowy element div przechowujący wybrany produkt w koszu*/
    thisCart.dom.productList.appendChild(generatedDOM);
    //thisCart.products.push(menuProduct);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    console.log('thisCart.products:', thisCart.products);
    thisCart.update();
  }
  update() { //metoda sumująca produkty w koszu
    const thisCart = this;
    thisCart.totalNumber = 0; //cena produktu +koszt dostawy
    thisCart.subtotalPrice = 0;//suma wszystkich cen produkt będących w koszyku
    for (let product of thisCart.products) {
      thisCart.subtotalPrice += product.price;
      thisCart.totalNumber += product.amount;
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    console.log('Suma cen produktów:', thisCart.subtotalPrice + '$', 'Suma liczby sztuk produktów:', thisCart.totalNumber + '$', 'Cena całkowita zamówienia + koszt dowozu:', thisCart.totalPrice + '$');
    for (let key of thisCart.renderTotalsKeys) {
      for (let elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }
  }
  remove(cartProduct) {
    const thisCart = this;
    const index = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(index, 1);
    cartProduct.dom.wrapper.remove(); //element DOM
    thisCart.update();
  }
  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order; //  //localhost:3131/order
    const payload = {
      phone: thisCart.dom.phone.value,
      address: thisCart.dom.address.value,
      //address: 'test',
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      totalPrice: thisCart.totalPrice,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };
    for (let product of thisCart.products) {
      payload.products.push(product.getData()); //wynik metody zwracany to tablicy products
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    fetch(url, options)
      .then(function (response) {
        return response.json();
      }).then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }
}
export default Cart;
