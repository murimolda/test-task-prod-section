$(function () {

  function productsPerPage() {
    return $(window).width() < 768 ? 6 : 8;
  }

  let allProducts = [];
  let filteredProducts = [];
  let currentPage = 1;

  function makePage() {
    renderProducts();
    renderPagination();
  }

  function loadProducts() {
    $.getJSON('https://raw.githubusercontent.com/murimolda/product-data/refs/heads/main/products.json', function (data) {
      allProducts = data.products;
      filteredProducts = [...allProducts];
      makePage()
    });
  }
  function renderProducts() {
    const perPage = productsPerPage();
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const visible = filteredProducts.slice(start, end);
    const $list = $('#prod-list').empty();

    $.each(visible, function (i, product) {
      const oldPrice = product.price ? `<span class="old-price">$${product.price.toFixed(2)}</span>` : '';
      const newPrice = product.new_price ? `<span class="new-price">$${product.new_price.toFixed(2)}</span>` : '';
      let badge = '';
      if (Array.isArray(product.flags)) {
        badge = `<div class="badges">`;
        product.flags.forEach(flag => {
          badge += `<div class="badge badge-${flag}">${flag}</div>`;
        });
        badge += `</div>`;
      }
      const card = `
        <div class="product-card">
          <a href="${product.link}" target="_blank">
            <img src="prod-img.jpg" alt="${product.name}">
          </a>
          <div class="product-brand">${product.brand}</div>
          <div class="product-name">${product.name}</div>
          <div class="product-price">${oldPrice}${newPrice}</div>
          <div class="action-buttons">
            <button class="button cart-button">Add to Cart</button>
            <button class="button quick-button">Quick View</button>
          </div>
          ${badge}
        </div>
      `;
      $list.append(card);
    });
  }

  function renderPagination() {
    const perPage = productsPerPage();
    const totalPages = Math.ceil(filteredProducts.length / perPage);
    const $pagination = $('#prod-pagination').empty();

    const $prev = $('<button>&laquo;</button>');
    if (currentPage === 1) {
      $prev.prop('disabled', true).addClass('disabled');
    } else {
      $prev.on('click', function () {
        currentPage--;
        makePage()
      });
    }
    $pagination.append($prev);

    for (let i = 1; i <= totalPages; i++) {
      const $btn = $('<button>' + i + '</button>');
      if (i === currentPage) $btn.addClass('page-active');
      $btn.on('click', function () {
        currentPage = i;
        makePage()
      });
      $pagination.append($btn);
    }

    const $next = $('<button>&raquo;</button>');
    if (currentPage === totalPages) {
      $next.prop('disabled', true).addClass('disabled');
    } else {
      $next.on('click', function () {
        currentPage++;
        makePage()
      });
    }
    $pagination.append($next);
  }

  $(window).on('resize', function () {
    makePage()
  });


  loadProducts();
});