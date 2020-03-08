/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
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
      });
      console.log('Metoda initOrderForm:');
    }
    processOrder() { //oblicza cenę produktu dla wartości domyślnych i wybranych
      const thisProduct = this;
      console.log('Metoda processOrder:');
      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      /*odczytuje/przechowuje które opcje formularza zostały wybrane/zaznaczone z div.firstChild <article-form>*/
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);
      /* set variable price to equal thisProduct.data.price */
      /*odczyt ceny produktu jako wartości domyślnej*/
      let price = thisProduct.data.price;
      console.log('price', thisProduct.id, price);
      /* START LOOP: for each paramId in thisProduct.data.params */
      /*dla każdego pojedyńczego klucza obiektu params-pętla iterująca po parametrach*/
      for (let paramId in thisProduct.data.params) { //pobierze klucze souce-topping-crust
        console.log('paramId', paramId);
        /* save the element in thisProduct.data.params with key paramId as const param */
        const param = thisProduct.data.params[paramId]; //pobierze ich wartości pojedynczych kluczy {}
        console.log('param', param);
        /* START LOOP: for each optionId in param.options-pętla iterująca po opcjach parametru */
        for (let optionId in param.options) { //klucze tomato -cream/olive red peper
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
            /*blok if-else jeżeli opcja zaznaczona dodaj klasę active w przeciwnym razie odbierz*/
            if (optionSelected) {
              img.classList.add(classNames.menuProduct.imageVisible);
            } else {
              img.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        }
        /* END LOOP: for each paramId in thisProduct.data.params */
      }
      /* set the contents of thisProduct.priceElem to be the value of variable price */
      thisProduct.priceElem.innerHTML = price;

    }
  }
  //deklaracja obiektu app
  const app = {
    initMenu: function () {//deklaracja metody initMenu
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
    },
  };
  //wywołanie metod
  app.init();
}
