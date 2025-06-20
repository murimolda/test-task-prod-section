$(function () {

  function productsPerPage() {
    return $(window).width() < 768 ? 6 : 8;
  }

  let allProducts = [];
  let filteredProducts = [];
  let currentPage = 1;

  function loadProducts() {
    $.getJSON('https://raw.githubusercontent.com/murimolda/product-data/refs/heads/main/products.json', function (data) {
      allProducts = data.products;
      filteredProducts = [...allProducts];
      renderProducts();
      renderPagination();
    });
  }
  function renderProducts() {
    const perPage = productsPerPage();
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const visible = filteredProducts.slice(start, end);
    const $list = $('#prod-list').empty();

    $.each(visible, function (i, product) {
      const isNew = Array.isArray(product.flags) && product.flags.includes("new");
      const oldPrice = product.price ? `<span class="old-price">$${product.price.toFixed(2)}</span>` : '';
      const newPrice = product.new_price ? `<span class="new-price">$${product.new_price.toFixed(2)}</span>` : '';
      const badge = isNew ? `<div class="badge-new">New</div>` : '';
      const card = `
        <div class="product-card">
          <a href="${product.link}" target="_blank">
            <img src="prod-img.jpg" alt="${product.name}">
          </a>
          <div class="product-brand">${product.brand}</div>
          <div class="product-name">${product.name}</div>
          <div class="product-price">${oldPrice}${newPrice}</div>
          <div class="action-buttons">
            <button>Add to Cart</button>
            <button>Quick View</button>
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

    for (let i = 1; i <= totalPages; i++) {
      const $btn = $('<button>' + i + '</button>');
      if (i === currentPage) $btn.addClass('active');
      $btn.on('click', function () {
        currentPage = i;
        renderProducts();
        renderPagination();
      });
      $pagination.append($btn);
    }
  }

  $(window).on('resize', function () {
    renderProducts();
    renderPagination();
  });


  loadProducts();
});