/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      console.log('new Product:', thisProduct); //Product
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
    }
    renderInMenu() {//deklaracja metody
      const thisProduct = this;
      console.log('nazwa produktu', thisProduct.id);
      /*generate HTML based on template-wygenerować kod HTML pojedynczego produktu*/
      const generatedHTML = templates.menuProduct(thisProduct.data);
      console.log('generatedHTML:', generatedHTML);
      /*create element using utils.createElementFromHTML-stworzyć element DOM na podstawie tego kodu produktu, dodajemy do instancji nową właść.element*/
      thisProduct.element = utils.createDOMFromHTML(generatedHTML); //div.firstChild
      console.log(thisProduct.element);
      /*find menu container-znaleźć na stronie kontener menu*/
      const menuContainer = document.querySelector(select.containerOf.menu);
      /*add element to menu-wstawić stworzony element DOM do znalezionego kontenera menu*/
      menuContainer.appendChild(thisProduct.element);
    }
    getElements() {//metoda służy odnalezieniu elementów w kontenerze produktu <article> utworzonych za pomocą Handlebars
      const thisProduct = this;
      /*nagłówek header '.product__header'*/
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      console.log(thisProduct.accordionTrigger);
      /*cały formularz form '.product__order'*/
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      console.log(thisProduct.form);
      console.log(typeof (thisProduct.form));
      console.log(thisProduct.form.nodeName);//szukamy we wł obiektu Product form _proto_ nodeName
      /*z formularza pobieramy wszystkie'input i select'*/
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      console.log(thisProduct.formInputs);
      /*link 1szt o atrybucie'[href="#add-to-cart"]'*/
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      console.log(thisProduct.cartButton);
      /*span 1szt.wyświetlenie ceny'.product__total-price .price'*/
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      console.log(thisProduct.priceElem);
      /*div przechowujący wszystkie img, div.'product__images'*/
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      console.log('thisProduct.imageWrapper', thisProduct.id, thisProduct.imageWrapper);
      /*zawartość div o class=widget-amount czyli elementy + i - ilości zamówień*/
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
      console.log('thisProduct.amountWidgetElem', thisProduct.id, thisProduct.amountWidgetElem);
    }
    initAccordion() { //wybór produktu do zakupu
      const thisProduct = this;
      /* find the clickable trigger (the element that should react to clicking) */
      //const tiggerHeader = thisProduct.element.querySelector(select.menuProduct.clickable);
      //console.log('tiggerHeader:', tiggerHeader);
      /* START: click event listener to trigger lub thisProduct.accordionTrigger*/
      thisProduct.accordionTrigger.addEventListener('click', function (event) {
        console.log('Funkcja działa!');
        /* prevent default action for event */
        event.preventDefault();
        /* toggle active class on element of thisProduct-dla bieżącego produktu <article class=active>*/
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
        /* find all active products-przeszukaj cały document a wnim elementy mające klasę product-list >product czyli article*/
        const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
        console.log(activeProducts);
        /* START LOOP: for each active product */
        for (let activeProduct of activeProducts) {
          /* START: if the active product isn't the element of thisProduct różnią się całym zasobem produktów a nie tylko klassą active*/
          if (activeProduct != thisProduct.element) { //thisProduct.element wskazuje element z klasą który został kliknięty i dostał active
            console.log('jestem tu');
            /* remove class active for the active product */
            activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
            /* END: if the active product isn't the element of thisProduct */
          }
          /* END LOOP: for each active product */
        }
      });
      /* END: click event listener to trigger */
    }
    initOrderForm() { //wybieramy dodatki do produktów
      const thisProduct = this;
      thisProduct.form.addEventListener('submit', function (event) { //na formularzu ustaw event na submit type=text
        event.preventDefault(); //jeżeli nastąpiło zdarzenie w formularzu wywołaj processOrder()
        thisProduct.processOrder();
        console.log('submit');
      });

      for (let input of thisProduct.formInputs) { //dla wszystkich input i select jeżeli nastąpi zdarzenie zmiana wyboru wywołaj processOrder
        input.addEventListener('change', function () {
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
      console.log('Metoda initOrderForm:');
    }
    /*funkcja tworząca instancję klasy AmountWidget w oparciu o construktor klasy*/
    initAmountWidget() {
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      /*ustawienie nadsłuchiwania na zmiany w div widget-amount wbudowane zdarzenie event-updated*/
      thisProduct.amountWidgetElem.addEventListener('updated', function () {
        thisProduct.processOrder();
      });
    }
    processOrder() { //oblicza cenę produktu dla wartości domyślnych i wybranych
      const thisProduct = this;
      console.log('Metoda processOrder:');
      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      /*odczytuje/przechowuje które opcje formularza zostały wybrane/zaznaczone z div.firstChild <article-form>*/
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);
      /*nowa właśc. o wartości obiektu thisProduct.params przechowująca wybrane opcje*/
      thisProduct.params = {};
      /* set variable price to equal thisProduct.data.price */
      /*odczyt ceny produktu jako wartości domyślnej*/
      let price = thisProduct.data.price;
      console.log('price', thisProduct.id, price);
      /* START LOOP: for each paramId in thisProduct.data.params */
      /*dla każdego pojedyńczego klucza obiektu params-pętla iterująca po parametrach*/
      for (let paramId in thisProduct.data.params) { //pobierze klucze souce-topping-crust, iteruje po parametrach
        console.log('paramId', paramId);
        /* save the element in thisProduct.data.params with key paramId as const param */
        const param = thisProduct.data.params[paramId]; //pobierze ich wartości pojedynczych kluczy {} label,type,options
        console.log('param', param);
        /* START LOOP: for each optionId in param.options-pętla iterująca po opcjach parametru */
        for (let optionId in param.options) { //klucze tomato -cream/olive red peper, iteruje po opcjach
          /* save the element in param.options with key optionId as const option */
          const option = param.options[optionId]; //pobierz odczytaj wartość obiektu options.tomato {}
          console.log('option', option);
          /* START IF: if option is selected and option is not default */
          /*sprawdzenie które opcje są zaznaczone czy obiekt formData zawiera klucz o nazawie paramId oraz czy w obiekcie w tablicy pod indeksem jest klucz*/
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          console.log('optionId', optionId);
          console.log('optionSelected', optionSelected);
          if (optionSelected && !option.default) {
            /* add price of option to variable price */
            price = price + option.price;
            console.log('price', price);
            /* END IF: if option is selected and option is not default */
          }
          else if (!optionSelected && option.default) {
            /* START ELSE IF: if option is not selected and option is default */
            /* deduct price of option from price */
            price = price - option.price;
            console.log('price', price);
            /* END ELSE IF: if option is not selected and option is default */
          }
          /* END LOOP: for each optionId in param.options */
          /*pobierz wszystkie elementy z div.product__images o klasie składającej się z paramId-optionId np.souce-tomato*/
          const images = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
          for (let img of images) {
            img.classList.add(classNames.menuProduct.imageVisible);
            /*blok if-else jeżeli opcja zaznaczona dodaj klasę active w przeciwnym razie odbierz*/
            if (optionSelected) {
              if (!thisProduct.params[paramId]) { //czy dla danego klucza jest wartość
                thisProduct.params[paramId] = {
                  label: param.label, //Sauce
                  options: {},
                };
              }
              thisProduct.params[paramId].options[optionId] = option.label;//Tomato

            } else {
              img.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        }
        /* END LOOP: for each paramId in thisProduct.data.params */
      }
      console.log('Obiekt params z opcjami thisProduct.params', thisProduct.params);
      /*multiply price by amount ozn.pomnożenie ceny przez ilość sztuk wybraną w widgecie*/
      //price *= thisProduct.amountWidget.value;
      thisProduct.priceSingle = price; //właść.cena za jedną sztukę
      thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;//właść.cena za klika sztuk jednego produktu
      /* set the contents of thisProduct.priceElem to be the value of variable price */
      //thisProduct.priceElem.innerHTML = price;
      thisProduct.priceElem.innerHTML = thisProduct.price;
    }
    addToCart() {//metoda przekazująca wybrane produkty do metody koszyka
      const thisProduct = this;
      thisProduct.name = thisProduct.data.name;
      thisProduct.amount = thisProduct.amountWidget.value;
      app.cart.add(thisProduct);//wywołanie metody dodania produktów do koszyka, thisProduct bedzie wskazywał na całą instancję Product na product/-ty które wybrał użytkownik

    }
  }
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
    announce() {//tworzy instancję w oparciu o klasę Event wbudowaną w przeglądarkę
      const thisWidget = this;
      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }
  //deklaracja klasy Cart
  class Cart {
    constructor(element) {
      const thisCart = this; //this wskazuje na new Cart
      thisCart.products = []; //tablica przechowująca produkty dodane do koszyka
      thisCart.getElements(element); //element będzie divem kontenerem koszyka
      thisCart.initActions();
      console.log('new Cart', thisCart);
    }
    getElements(element) {
      const thisCart = this;
      thisCart.dom = {}; //obiekt przechowujący wszystkie elementy DOM wyszukane w komponencie koszyka dla ułatwienia nazewnictwa
      thisCart.dom.wrapper = element;//element będzie divem kontenerem koszyka
      /*do obiektu dom dodajemy właściwość toggleTigger przechowującej div class="cart__summary"*/
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      /*do obiektu dom dodajemy właściwość productList przechowującą div class="cart__order-summary"*/
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    }
    initActions() {//metoda będzie pokazywać i ukrywać koszyk produktów
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
        event.preventDefault();
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
    }
    add(menuProduct) {//dodanie instancji produktu thisProduct do kosza
      const thisCart = this;
      console.log('dodany produkt', menuProduct);
      /*generate HTML based on template-wygenerować kod HTML pojedynczego produktu wybranego przez użytkownika*/
      const generatedHTML = templates.cartProduct(menuProduct);
      console.log('generatedHTML:', generatedHTML);
      /*create element using utils.createElementFromHTML-stworzyć element DOM na podstawie tego kodu produktu, dodajemy do instancji nową właść.element*/
      const generatedDOM = utils.createDOMFromHTML(generatedHTML); //div.firstChild
      console.log(generatedDOM);
      /*add generatedDOM-przypisać do obiektu dom do właść. productList*/
      thisCart.dom.productList.appendChild(generatedDOM);
    }
  }
  //deklaracja obiektu app
  const app = {
    initMenu: function () {//deklaracja metody initMenu odpowiedz. za inicjowanie instancji Product
      const thisApp = this;
      console.log('thisApp.data', thisApp.data);
      for (let productData in thisApp.data.products) {//dla każdego klucza obiektu products
        new Product(productData, thisApp.data.products[productData]);
        console.log('productData:', productData);
        console.log(thisApp.data.products[productData]);
      }
      //const testProduct = new Product();
      //console.log('testProduct:', testProduct);
    },
    //inicjalizacja danych
    initData: function () {
      const thisApp = this; //this wskazuje na obiekt app
      thisApp.data = dataSource;
    },
    init: function () {
      const thisApp = this; //this wskazuje na obiekt app
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
    initCart: function () {//deklaracja metody initCart odpowiedz. za inicjowanie instancji Cart
      const thisApp = this;
      /*cała zawartość kontenera koszyka div id="cart" class="cart"*/
      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem); //ozn. to, że poza obiektem app możemy wywołać ją za pomocą app.cart
    }
  };
  //wywołanie metod
  app.init();
}
