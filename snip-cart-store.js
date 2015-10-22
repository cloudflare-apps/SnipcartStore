(function(){
  var options = INSTALL_OPTIONS;

  var createEl = function(name) {
    return document.createElement('snip-cart-' + name);
  };

  var setupSnipCart = function() {
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

  var setupStore = function() {
    var containerEl = Eager.createElement(options.container);
    var storeEl = createEl('store');
    containerEl.appendChild(storeEl);

    for (var i = 0; i < options.products.length; i++) {
      var product = options.products[i];
      var productEl = createEl('product');
      storeEl.appendChild(productEl);

      var img = document.createElement('img');
      img.src = product.src;
      productEl.appendChild(img);

      var titleEl = createEl('product-title');
      titleEl.innerHTML = product.title;
      productEl.appendChild(titleEl);

      var priceEl = createEl('product-price');
      priceEl.appendChild(document.createTextNode(product.price));
      productEl.appendChild(priceEl);

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

  var init = function() {
    setupSnipCart();
    setupStore();
  };

  ready(init);
})();
