/**
 * main.js - 북스토어 메인 페이지 스크립트
 */

$(function() {
  setupLoginStatus();
  loadBooks();
  setupGenreFilter();
  setupEmailSubscription();
  setupScrollAnimation();
  setupCartButtons();
  loadNewBooks();
  loadBooksForRestock();
});

// 책 관련 함수들
function loadBooks() {
  window.allBooks = [];
  $.get('http://localhost:3001/BOOK')
    .done(function(books) {
      window.allBooks = books;
      renderBooks(books);
    })
    .fail(function(error) {
      console.error('Failed to load books:', error);
      $('#ajaxBookList').html('<p>책 목록을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.</p>');
    });
}

function renderBooks(books) {
  const $bookList = $('#ajaxBookList');
  $bookList.empty();

  if (books.length === 0) {
    $bookList.append('<p>해당 장르의 책이 없습니다.</p>');
    return;
  }
  
  books.forEach(book => {
    const finalPrice = Math.round(book.B_PRICE * (1 - book.SALE));
    const bookHtml = `
      <div class="book" data-genre="${book.B_CATE}" data-id="${book.BNO}">
        <img src="images/${book.BNAME}.png" alt="${book.BNAME}" style="width:100px; height:auto;">
        <p id="book-title"><strong>${book.BNAME}</strong></p>
        <p>저자: ${book.B_WR}</p>
        <p>가격: <del>₩${book.B_PRICE.toLocaleString()}</del> → <strong>₩${finalPrice.toLocaleString()}</strong></p>
        <button class="cart-button">장바구니 담기</button>
      </div>
    `;
    $bookList.append(bookHtml);
  });
}

// 신간 도서 관련 함수들
function loadNewBooks() {
  $.get('http://localhost:3001/BOOK', function(books) {
    window.allBooks = books;
    filterNewBooks(3); // 기본값: 최근 3개월
  });
}

function filterNewBooks(monthsAgo) {
  const today = new Date();
  const filtered = window.allBooks.filter(book => {
    const bookDate = new Date(book.B_DATE);
    const diffMonth = (today.getFullYear() - bookDate.getFullYear()) * 12 + today.getMonth() - bookDate.getMonth();
    return diffMonth < monthsAgo;
  });

  renderNewBooks(filtered);
}

function renderNewBooks(books) {
  const $list = $('#newBookList');
  $list.empty();

  if (books.length === 0) {
    $list.append('<p>선택한 기간 내 신간 도서가 없습니다.</p>');
    return;
  }

  books.forEach(book => {
    const finalPrice = Math.round(book.B_PRICE * (1 - book.SALE));
    const bookHtml = `
      <div class="book" data-id="${book.BNO}">
        <img src="images/${book.BNAME}.png" alt="${book.BNAME}" style="width:100px; height:auto;">
        <p id="book-title"><strong>${book.BNAME}</strong><br>₩${finalPrice.toLocaleString()}</p>
        <button class="cart-button">카트에 담기</button>
      </div>
    `;
    $list.append(bookHtml);
  });
}

// 재입고 예정 도서 관련 함수들
function loadBooksForRestock() {
  $.get('http://localhost:3001/BOOK', function(books) {
    const outOfStockBooks = books.filter(book => book.STOCK === 0);
    renderRestockBooks(outOfStockBooks);
  });
}

function renderRestockBooks(books) {
  const $list = $('#restockBookList');
  $list.empty();

  if (books.length === 0) {
    $list.append('<p>현재 재입고 예정 도서가 없습니다.</p>');
    return;
  }

  books.forEach(book => {
    const finalPrice = Math.round(book.B_PRICE * (1 - book.SALE));
    const bookHtml = `
      <div class="book" data-genre="${book.B_CATE}">
        <img src="images/${book.BNAME}.png" alt="${book.BNAME}" style="width:100px; height:auto;">
        <p id="book-title"><strong>${book.BNAME}</strong><br>₩${finalPrice.toLocaleString()}</p>
        <button class="cart-button" disabled>재입고 대기중</button>
      </div>
    `;
    $list.append(bookHtml);
  });
}

// 이벤트 관련 설정 함수들
function setupCartButtons() {
  $(document).on('click', '.cart-button', function() {
    const $book = $(this).closest('.book');
    const title = $book.find('#book-title strong').text().trim();
    const priceText = $book.find('p').last().text();
    const priceMatch = priceText.match(/₩([\d,]+)/);
    const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;
    const img = $book.find('img').attr('src');
    
    addToCart(title, price, img);
  });
}

function setupGenreFilter() {
  $('#genre').on('change', function() {
    const selectedGenre = $(this).val();
    if (selectedGenre === '전체') {
      renderBooks(window.allBooks);
    } else {
      const filteredBooks = window.allBooks.filter(book => book.B_CATE === selectedGenre);
      renderBooks(filteredBooks);
    }
  });
}

function setupScrollAnimation() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $(entry.target).addClass('show');
      }
    });
  }, { threshold: 0.1 });
  
  $('.section').each(function() {
    $(this).addClass('hidden');
    observer.observe(this);
  });
}

function setupEmailSubscription() {
  $('.subscribe button').on('click', function() {
    const email = $('.subscribe input').val();
    if (email) {
      alert(`출판사 이메일 ${email}이(가) 등록되었습니다.`);
      $('.subscribe input').val('');
    } else {
      alert('이메일을 입력해주세요.');
    }
  });
}

// 유틸리티 함수
function addToCart(title, price, img) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existing = cart.find(item => item.title === title);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ title, price, img, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${title}이(가) 장바구니에 담겼습니다.`);
}

// 월 필터 설정
$('#monthFilter').on('change', function() {
  const selected = parseInt($(this).val());
  filterNewBooks(selected);
});

function setupLoginStatus() {
  const loginMno = localStorage.getItem('loginMno');
  updateLoginUI(!!loginMno);
}

function updateLoginUI(isLoggedIn) {
  if (isLoggedIn) {
    $('.login-button').hide();
    $('nav a[href="cart.html"]').show();
    $('nav a:contains("마이페이지")').show();

    if (!$('.logout-button').length) {
      $('nav').append('<a href="#" class="logout-button">로그아웃</a>');
    }

    $('.logout-button').off('click').on('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('loginMno');
      alert('로그아웃 되었습니다.');
      updateLoginUI(false); // 상태 업데이트
    });

  } else {
    $('.login-button').show();
    $('nav a[href="cart.html"]').hide();
    $('nav a:contains("마이페이지")').hide();
    $('.logout-button').remove();

    $('.login-button').off('click').on('click', function (e) {
      e.preventDefault();
      window.location.href = '../member/login.html';
    });
  }
}
