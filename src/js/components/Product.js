import { select, classNames, templates } from './settings.js';
import utils from './utils.js';
import AmountWidget from './components/AmountWidget.js';

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
      thisProduct.addToCart(); //kliknięcie w przycisk add to cart wywołuje tę metodę addToCart()
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
              thisProduct.params[paramId] = { //utwórz na tym obiekcie params dla klucza obiekt o wartości label i options
                label: param.label, // dla danego obiektu pobierze wartość klucza np.Sauce
                options: {}, //i utworzy pusty obiekt
              };
            }
            thisProduct.params[paramId].options[optionId] = option.label;// na nowo utworzonym obiekcie params i kluczu paramId przypisaliśmy daną wartość i na tej wartości która jest obiektem wyszukujemy wartość dla obiektu options o kluczu optionId czyli Tomato

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
  addToCart() {//metoda przekazująca wybrane produkty do kontenera koszyka
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    //app.cart.add(thisProduct);//wywołanie metody dodania produktów do koszyka na instancji new Cart, thisProduct bedzie wskazywał na całą instancję Product na product/-ty które wybrał użytkownik
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
    console.log(thisProduct);
  }
}
export default Product;
