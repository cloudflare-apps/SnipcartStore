(function(){
  var prefix = 'snip-cart';

  var createEl = function(name) {
    return document.createElement(prefix + '-' + name);
  };

  var setupSnipCart = function(options) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.id = 'snipcart-theme';
    style.href = 'https://cdn.snipcart.com/themes/base/snipcart.min.css';
    document.head.appendChild(style);

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'snipcart';
    script.src = 'https://cdn.snipcart.com/scripts/snipcart.js';
    script.setAttribute('data-api-key', options.apiKey);
    document.head.appendChild(script);
  };

  var setupStyle = function(options) {
    var style = document.createElement('style');
    style.innerHTML = (
      'snip-cart-store snip-cart-product.snip-cart-product-not-placeholder a.snip-cart-product-link:hover {' +
        'box-shadow: 0 0 0 1px ' + options.accentColor + ' !important;' +
        'color: ' + options.accentColor + ' !important' +
      '}'
    );
    document.head.appendChild(style);
  };

  var setupStore = function(options) {
    var containerEl = Eager.createElement(options.container);
    var storeEl = createEl('store');
    var numColumns = Math.max(1, Math.min(options.numColumns, 10)) || 3;
    storeEl.setAttribute('data-snip-cart-store-columns', numColumns);
    containerEl.appendChild(storeEl);

    var numberOfProductCells = Math.ceil(options.products.length / numColumns) * numColumns;

    for (var i = 0; i < numberOfProductCells; i++) {
      var productEl = createEl('product');
      storeEl.appendChild(productEl);

      var productLink = document.createElement('a');
      productLink.className = prefix + '-product-link';
      productEl.appendChild(productLink);

      var imageEl = createEl('product-image');
      productLink.appendChild(imageEl);

      if (i < options.products.length) {
        productEl.className = 'snip-cart-product-not-placeholder';
        var product = options.products[i];
      } else {
        var product = { title: '&nbsp;', price: '&nbsp;' };
      }

      if (product.src) {
        var img = document.createElement('img');
        img.className = prefix + '-product-img';
        img.src = product.src;
        img.onerror = function() {
          img.style.opacity = '0 !important';
        };
        imageEl.appendChild(img);
      }

      var titleEl = createEl('product-title');
      titleEl.innerHTML = product.title;
      productLink.appendChild(titleEl);

      var priceEl = createEl('product-price');
      var priceHTML = product.price;
      if (priceHTML === 0) {
        priceHTML = 'Free';
      } else if (!isNaN(priceHTML)) {
        priceHTML = '$' + priceHTML;
      }
      priceEl.innerHTML = priceHTML;
      productLink.appendChild(priceEl);

      storeEl.appendChild(productEl);
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
        setupSnipCart(options);
        setupStyle(options);
        setupStore(options);
      });
    }
  };
})();
