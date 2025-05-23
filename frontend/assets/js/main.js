/**
 * main.js - 북스토어 메인 페이지 스크립트
 */
const API_ADDR = "http://localhost:3001/";

const body = document.body;
const carousel = document.getElementById('recomanded');
const leftBtn = document.querySelector('.carousel-btn.left');
const rightBtn = document.querySelector('.carousel-btn.right');

async function handleRecomanded(){
  try{
    const response = await fetch(API_ADDR+"NAVER_BOOK");
    const data = await response.json();

    console.log(data);

    displayRecommanded(data);
  }catch(error){
    console.error(`API 통신 실패 ${error}`);
  }
}

let currentIndex = 0;
let bookList = [];

function displayRecommanded(bookList) {
  const $recomanded = document.getElementById('recomanded');
  $recomanded.innerHTML = '';

  bookList.forEach(book => {
    const bookHtml = `
      <div class="book">
        <img src="${book.NB_IMAGE}" alt="${book.NB_TITLE}">
        <p><strong>${book.NB_TITLE}</strong></p>
        <p style="font-size: 0.9rem;">${book.NB_AUTHOR}</p>
        <p style="color: #693111;">₩${book.NB_PRICE.toLocaleString()}</p>
      </div>
    `;
    $recomanded.insertAdjacentHTML('beforeend', bookHtml);
  });
}

rightBtn.addEventListener('click', () => {
  if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth) {
    carousel.scrollTo({ left: 0, behavior: 'smooth' });
  } else {
    carousel.scrollBy({ left: 300, behavior: 'smooth' });
  }
});

leftBtn.addEventListener('click', () => {
  if (carousel.scrollLeft === 0) {
    carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' });
  } else {
    carousel.scrollBy({ left: -300, behavior: 'smooth' });
  }
});

handleRecomanded();

$(function() {
  loadBooks();
  setupGenreFilter();
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
    const bookHtml = `
      <div class="book" data-id="${book.BNO}">
        <a href="/frontend/pages/book-detail.html?id=${book.BNO}">
          <img src="/frontend/assets/images/${book.BNAME}.png" alt="${book.BNAME}" style="width:100px; height:auto;">
          <p id="book-title"><strong>${book.BNAME}</strong></p>
        </a>
        <p>저자: ${book.B_WR}</p>
        <p>가격: <del>₩${book.B_PRICE.toLocaleString()}</del> → <strong>₩${Math.round(book.B_PRICE * (1 - book.SALE)).toLocaleString()}</strong></p>
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
        <img src="/frontend/assets/images/${book.BNAME}.png" alt="${book.BNAME}" style="width:100px; height:auto;">
        <p id="book-title"><strong>${book.BNAME}</strong><br>₩${finalPrice.toLocaleString()}</p>
        <button class="cart-button">장바구니 담기</button>
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
        <img src="/frontend/assets/images/${book.BNAME}.png" alt="${book.BNAME}" style="width:100px; height:auto;">
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
