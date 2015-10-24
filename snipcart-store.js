(function(){
  var getProductId = function(product) {
    return '|title:' + product.title + '|price:' + product.price + '|';
  };

  var setupSnipCartStyleLink = function(options) {
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.id = 'snipcart-theme';
    link.href = '//cdn.snipcart.com/themes/base/snipcart.min.css';
    document.head.appendChild(link);
  }

  var setupSnipCartScripts = function(options) {
    var loadScript = function() {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = 'snipcart';
      script.src = 'https://cdn.snipcart.com/scripts/snipcart.js';
      script.setAttribute('data-api-key', options.apiKey);
      script.setAttribute('data-autopop', false); // http://docs.snipcart.com/getting-started/the-cart
      document.head.appendChild(script);
    };

    var versionParts;
    if (window.jQuery && window.jQuery.fn && window.jQuery.jquery) {
      var versionParts = window.jQuery.fn.jquery.split('.');
    }

    if (!window.jQuery || !versionParts || !parseInt(versionParts[0], 10) < 1 || parseInt(versionParts[1], 10) < 9 || parseInt(versionParts[2], 10) < 1) {
      var jqueryScript = document.createElement('script');
      jqueryScript.type = 'text/javascript';
      jqueryScript.src = '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
      jqueryScript.onload = loadScript;
      document.head.appendChild(jqueryScript);
    } else {
      loadScript();
    }
  };

  var style = document.createElement('style');
  document.head.appendChild(style);
  var setupStyle = function(options) {
    style.innerHTML = (
      'snipcart-store snipcart-product.snipcart-product-not-placeholder a.snipcart-product-link:hover {' +
        'box-shadow: 0 0 0 1px ' + options.accentColor + ' !important;' +
        'color: ' + options.accentColor + ' !important' +
      '}' +
      'snipcart-store a.snipcart-checkout:hover {' +
        'border-color: ' + options.accentColor + ' !important' +
      '}'
    );
  };

  var productQuantities = {};
  var updateProductElQuantity = function(id, quantity, type) {
    var quantityAttr = 'data-snipcart-cart-quantity';
    var newQuantity;
    var productEl = document.querySelector('snipcart-product[data-snipcart-product-id="' + id + '"]');
    if (productEl) {
      if (type === 'update') {
        newQuantity = quantity;
      } else {
        var currentQuantity = productEl.getAttribute(quantityAttr);
        currentQuantity = !currentQuantity ? 0 : parseInt(currentQuantity, 10);
        if (type === 'add') newQuantity = quantity;
        if (type === 'remove') newQuantity = currentQuantity - quantity;
      }
    }
    productQuantities[id] = newQuantity;
    productEl.setAttribute(quantityAttr, newQuantity);
  };

  var setAllProductElQuantities = function() {
    for (var id in productQuantities) {
      updateProductElQuantity(id, productQuantities[id], 'update');
    }
  };

  var setupEvents = function(options, count) {
    count = count || 0;
    if (!window.Snipcart) {
      if (count > 100) return;
      setTimeout(function(){
        setupEvents(options, count + 1);
      }, 500);
      return;
    }

    Snipcart.execute('bind', 'cart.ready', function(data) {
      if (!data || !data.order || !data.order.items || !data.order.items.length) return;
      for (var i = 0; i < data.order.items.length; i++) {
        var item = data.order.items[i];
        updateProductElQuantity(item.id, item.quantity, 'update');
      }
    });

    Snipcart.execute('bind', 'item.added', function(item){
      updateProductElQuantity(item.id, item.quantity, 'add');
    });

    Snipcart.execute('bind', 'item.removed', function(item){
      updateProductElQuantity(item.id, item.quantity, 'remove');
    });
  }

  var storeEl;
  var storeElMaxFontSizeStyle = document.createElement('style');
  document.head.appendChild(storeElMaxFontSizeStyle);
  var setupStore = function(options) {
    var containerEl = Eager.createElement(options.container);
    var headerEl;
    var productsEl;

    if (storeEl) {
      var oldContainerEl = storeEl.parentNode;
      containerEl.appendChild(storeEl);
      if (oldContainerEl.parentNode) {
        oldContainerEl.parentNode.removeChild(oldContainerEl);
      }
      headerEl = storeEl.querySelector('snipcart-header');
      productsEl = storeEl.querySelector('snipcart-products');
    } else {
      storeEl = document.createElement('snipcart-store');
      containerEl.appendChild(storeEl);

      headerEl = document.createElement('snipcart-header');
      headerEl.innerHTML = (
        '<snipcart-store-title-wrapper>'+
          '<snipcart-store-title></snipcart-store-title>'+
        '</snipcart-store-title-wrapper>'+
        '<a class="snipcart-checkout">'+
          '<snipcart-summary class="snipcart-summary">' +
            '<svg class="snipcart-cart-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><path d="M77.605,64.28H31.809l-8.172-40.045H11.077v-3.269h15.228l2.779,13.621h59.235L77.605,64.28z    M34.478,61.011h40.831l8.356-23.155H29.752L34.478,61.011z"/><path d="M41.043,82.531c-4.356,0-7.9-3.544-7.9-7.9c0-4.356,3.544-7.9,7.9-7.9c4.356,0,7.9,3.544,7.9,7.9   C48.943,78.987,45.399,82.531,41.043,82.531z M41.043,70c-2.554,0-4.631,2.077-4.631,4.631c0,2.553,2.077,4.631,4.631,4.631   c2.553,0,4.631-2.077,4.631-4.631C45.674,72.078,43.597,70,41.043,70z"/><path d="M71.281,82.531c-4.356,0-7.9-3.544-7.9-7.9c0-4.356,3.544-7.9,7.9-7.9c4.356,0,7.9,3.544,7.9,7.9   C79.181,78.987,75.637,82.531,71.281,82.531z M71.281,70c-2.554,0-4.631,2.077-4.631,4.631c0,2.553,2.077,4.631,4.631,4.631   c2.553,0,4.631-2.077,4.631-4.631C75.912,72.078,73.835,70,71.281,70z"/></svg>' +
            '<snipcart-total-items class="snipcart-total-items"></snipcart-total-items>' +
            '<snipcart-total-price class="snipcart-total-price"></snipcart-total-price>' +
          '</snipcart-summary>' +
        '</a>'
      );
      storeEl.appendChild(headerEl);

      productsEl = document.createElement('snipcart-products');
      storeEl.appendChild(productsEl);
    }

    var numColumns = Math.max(1, Math.min(10, options.numColumns)) || 3;
    storeEl.setAttribute('data-snipcart-store-columns', numColumns);

    var storeTitleEl = headerEl.querySelector('snipcart-store-title');
    storeTitleEl.innerHTML = options.title;

    storeElMaxFontSizeStyle.innerHTML = '';
    var computedStyle = getComputedStyle(storeEl);
    if (parseInt(computedStyle.fontSize, 10) > 16) {
      storeElMaxFontSizeStyle.innerHTML = 'snipcart-store { font-size: 16px !important }';
    }

    productsEl.innerHTML = '';
    var numberOfProductCells = Math.ceil(options.products.length / numColumns) * numColumns;
    for (var i = 0; i < numberOfProductCells; i++) {
      var productEl = document.createElement('snipcart-product');

      var productLink = document.createElement('a');
      productEl.appendChild(productLink);

      var imageEl = document.createElement('snipcart-product-image');
      productLink.className = 'snipcart-product-link';
      productLink.appendChild(imageEl);

      if (i < options.products.length) {
        var product = options.products[i];
      } else {
        var product = {};
      }

      if (product.title && product.price !== null && !isNaN(product.price)) {
        if (!isNaN(product.price)) {
          product.price = Math.max(0, product.price);
        }

        // http://docs.snipcart.com/configuration/product-definition
        productEl.className = 'snipcart-product-not-placeholder';
        productEl.setAttribute('data-snipcart-product-id', getProductId(product));
        productLink.classList.add('snipcart-add-item');
        productLink.setAttribute('data-item-id', getProductId(product));
        productLink.setAttribute('data-item-name', product.title);
        productLink.setAttribute('data-item-price', parseFloat(product.price, 10).toFixed(2));
        productLink.setAttribute('data-item-url', window.location.href);
        productLink.setAttribute('data-item-description', product.title);
      }

      if (product.src) {
        productLink.setAttribute('data-item-image', product.src);
        var img = document.createElement('img');
        img.className = 'snipcart-product-img';
        img.src = product.src;
        img.onerror = function() {
          img.style.opacity = '0 !important';
        };
        imageEl.appendChild(img);
      }

      var titleEl = document.createElement('snipcart-product-title');
      titleEl.innerHTML = product.title || '';
      productLink.appendChild(titleEl);

      var priceEl = document.createElement('snipcart-product-price');
      if (product.price) {
        var priceHTML = product.price;
        if (priceHTML === 0) {
          priceHTML = 'Free';
        } else if (!isNaN(priceHTML)) {
          priceHTML = '$' + priceHTML;
        }
        priceEl.innerHTML = priceHTML;
      }
      productLink.appendChild(priceEl);

      productsEl.appendChild(productEl);
    }
  };

  var ready = function(fn) {
    if (document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  };

  window.SnipCartStore = {
    init: function(options) {
      ready(function(){
        setupSnipCartStyleLink(options);
        setupStyle(options);
        setupStore(options);
        setupSnipCartScripts(options);
        setupEvents(options);
      });
    },
    setOptions: function(options) {
      ready(function(){
        setupStyle(options);
        setupStore(options);
        setAllProductElQuantities();
      });
    }
  };
})();
