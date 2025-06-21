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
    // $.getJSON('https://raw.githubusercontent.com/murimolda/product-data/refs/heads/main/products.json', function (data) {
    $.getJSON('https://raw.githubusercontent.com/murimolda/product-data/refs/heads/main/products-big.json', function (data) {
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

  if (filteredProducts.length === 0) {
    const query = $('#product-search').val().trim();
    $('#no-results')
      .text(`No results for "${query}"`)
      .fadeIn();
      $('#product-pagination').hide();
    return;
  } else {
    $('#no-results').hide();
  }

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
          <a href="https://${product.link}" target="_blank" class="product-link">
            <img src="prod-img.jpg" alt="${product.name}">
          </a>
          <div class="product-info">
            <div class="product-brand">${product.brand}</div>
            <div class="product-name">
              <a href="https://${product.link}" target="_blank">
                ${product.name}
              </a>
            </div>
            <div class="product-price">${priceHtml}</div>
            <div class="action-buttons">
              <button class="button cart-button">Add to Cart</button>
              <button class="button quick-button">Quick View</button>
            </div>
          </div>
          ${badge}
        </div>
      `;
      $list.append(card);
    });
  }

  //Pagination rendering
  // function renderPagination() {
  //   const perPage = productsPerPage();
  //   const totalPages = Math.ceil(filteredProducts.length / perPage);
  //   const $pagination = $('#product-pagination').empty();

  //   const $prev = $('<button class="pagination-button">&laquo;</button>');
  //   if (currentPage === 1) {
  //     $prev.prop('disabled', true).addClass('disabled');
  //   } else {
  //     $prev.on('click', function () {
  //       currentPage--;
  //       makePage()
  //     });
  //   }
  //   $pagination.append($prev);

  //   for (let i = 1; i <= totalPages; i++) {
  //     const $btn = $('<button class="pagination-button">' + i + '</button>');
  //     if (i === currentPage) $btn.addClass('active');
  //     $btn.on('click', function () {
  //       currentPage = i;
  //       makePage()
  //     });
  //     $pagination.append($btn);
  //   }

  //   const $next = $('<button class="pagination-button">&raquo;</button>');
  //   if (currentPage === totalPages) {
  //     $next.prop('disabled', true).addClass('disabled');
  //   } else {
  //     $next.on('click', function () {
  //       currentPage++;
  //       makePage()
  //     });
  //   }
  //   $pagination.append($next);
  // }

  //Pagination rendering with a large number of pages
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
      makePage();
    });
  }
  $pagination.append($prev);

  function createPageButton(page) {
    const $btn = $('<button class="pagination-button"></button>').text(page);
    if (page === currentPage) $btn.addClass('active');
    $btn.on('click', function () {
      currentPage = page;
      makePage();
    });
    return $btn;
  }

  function createDots() {
    return $('<button class="pagination-button pagination-dots" disabled>...</button>');
  }

  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) {
      $pagination.append(createPageButton(i));
    }
  } else {

    if (currentPage <= 3) {
      // 1 2 3 ... last
      for (let i = 1; i <= 3; i++) {
        $pagination.append(createPageButton(i));
      }
      $pagination.append(createDots());
      $pagination.append(createPageButton(totalPages));
    } else if (currentPage >= totalPages - 2) {
      // 1 ... totalPages-2 totalPages-1 totalPages
      $pagination.append(createPageButton(1));
      $pagination.append(createDots());
      for (let i = totalPages - 2; i <= totalPages; i++) {
        $pagination.append(createPageButton(i));
      }
    } else {

      $pagination.append(createPageButton(1));
      $pagination.append(createDots());
      $pagination.append(createPageButton(currentPage));
      $pagination.append(createDots());
      $pagination.append(createPageButton(totalPages));
    }
  }

  const $next = $('<button class="pagination-button">&raquo;</button>');
  if (currentPage === totalPages) {
    $next.prop('disabled', true).addClass('disabled');
  } else {
    $next.on('click', function () {
      currentPage++;
      makePage();
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
    $('#product-list').removeClass("line-view").addClass("grid-view");
    $('#line-view').toggleClass("active");
    $('#grid-view').toggleClass("active");
  });

  $('#line-view').click(function() {
    $('#product-list').removeClass("grid-view").addClass("line-view");
    $('#line-view').toggleClass("active");
    $('#grid-view').toggleClass("active");
  });

  // Search function
  function searchProducts() {
    const query = $('#product-search').val().trim().toLowerCase();
    if (query === '') {
      return;
    }
    filteredProducts = allProducts.filter(product => {
      const name = product.name?.toLowerCase() || '';
      const brand = product.brand?.toLowerCase() || '';
      return name.includes(query) || brand.includes(query);
    });
    currentPage = 1;
    makePage();
    $('#clear-search').show();
  }

  $('#search-button').on('click', function () {
    searchProducts();
  });

  $('#product-search').on('keypress', function (e) {
    if (e.which === 13) {
      const query = $(this).val().trim();
      if (query !== '') {
        searchProducts();
      }
    }
  });

  // Clear search function
  $('#clear-search').on('click', function () {
    $('#product-search').val('');
    filteredProducts = [...allProducts];
    currentPage = 1;
    makePage();
    $(this).hide();
    $('#product-pagination').show();
  });


});