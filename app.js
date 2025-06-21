$(function () {

  function productsPerPage() {
    return $(window).width() < 1240 ? 6 : 8;
  }

  let allProducts = [];
  let filteredProducts = [];
  let currentPage = 1;

  // Page rendering
  function makePage() {
    renderProducts();
    renderPagination();
  }

  // Getting product data from json file
  function loadProducts() {
    $.getJSON('https://raw.githubusercontent.com/murimolda/product-data/refs/heads/main/products.json', function (data) {
      allProducts = data.products;
      filteredProducts = [...allProducts];
      makePage()
    });
  }

  // Rendering product cards
  function renderProducts() {
    const perPage = productsPerPage();
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const visible = filteredProducts.slice(start, end);
    const $list = $('#product-list').empty();

    $.each(visible, function (i, product) {
      let priceHtml = '';
      if (product.new_price) {
        priceHtml = `<span class="old-price">$${product.price.toFixed(2)}</span><span class="new-price">$${product.new_price.toFixed(2)}</span>`;
      } else {
        priceHtml = `<span class="single-price">$${product.price.toFixed(2)}</span>`;
      }

      let badge = '';
      if (product && Array.isArray(product.flags)) {
        badge = `<div class="badges">`;
        product.flags.forEach(rawFlag => {
          if (typeof rawFlag === 'string') {
            const flags = rawFlag.includes(',') ? rawFlag.split(',') : [rawFlag];
            flags.forEach(flag => {
              flag = flag.trim();
              if (flag) {
                const flagText = flag.charAt(0).toUpperCase() + flag.slice(1);
                badge += `<div class="badge badge-${flag}">${flagText}</div>`;
              }
            });
          }
        });
        badge += `</div>`;
      }

      const card = `
        <div class="product-card">
          <a href="${product.link}" target="_blank" class="product-link">
            <img src="prod-img.jpg" alt="${product.name}">
          </a>
          <div class="product-brand">${product.brand}</div>
          <div class="product-name">${product.name}</div>
          <div class="product-price">${priceHtml}</div>
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

  //Pagination rendering
  function renderPagination() {
    const perPage = productsPerPage();
    const totalPages = Math.ceil(filteredProducts.length / perPage);
    const $pagination = $('#product-pagination').empty();

    const $prev = $('<button class="pagination-button">&laquo;</button>');
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
      const $btn = $('<button class="pagination-button">' + i + '</button>');
      if (i === currentPage) $btn.addClass('active');
      $btn.on('click', function () {
        currentPage = i;
        makePage()
      });
      $pagination.append($btn);
    }

    const $next = $('<button class="pagination-button">&raquo;</button>');
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

  //Switching grid and linear view for product cards container
  $('#grid-view').click(function() {
    $('#product-list').removeClass("list-view").addClass("grid-view");
    $('#line-view').toggleClass(active);
    $('#grid-view').toggleClass(active);
  });

  $('#line-view').click(function() {
    $('#product-list').removeClass("grid-view").addClass("list-view");
    $('#line-view').toggleClass(className);
    $('#grid-view').toggleClass(className);
  });



});