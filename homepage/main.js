/**
 * main.js - 북스토어 메인 페이지 스크립트
 */

$(function() {
  // 메인 페이지 기능 실행
  loadBooks();
  setupGenreFilter();
  setupEmailSubscription();
  setupScrollAnimation();
  setupCartButtons();
});

// 책 목록 불러오기 및 DOM에 렌더링
function loadBooks() {
  let allBooks = [];
  // 실제 API에서 데이터 가져오기
  $.get('http://localhost:3001/BOOK', function(books) {
    allBooks = books;
      renderBooks(books); // 전체 렌더링
    }).fail(function(error) {
      console.error('Failed to load books:', error);
      $('#ajaxBookList').html('<p>책 목록을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.</p>');
    });
  }

  // 책 목록 렌더링 함수
  function renderBooks(books) {
    const $bookList = $('#ajaxBookList');
    $bookList.empty();

    if (books.length === 0) {
      $bookList.append('<p>해당 장르의 책이 없습니다.</p>');
      return;
    }
    
    // 책 데이터로 DOM 생성
    $.each(books, function(index, book) {
      const bookHtml = `
        <div class="book" data-genre="${book.genre}">
          <img src="${book.img}" alt="${book.title}" style="width:100px; height:auto;">
          <p><strong>${book.title}</strong><br>$${book.price}</p>
          <button class="cart-button">장바구니 담기</button>
        </div>
      `;
      $bookList.append(bookHtml);
    });
  }

// 장바구니 버튼 이벤트 설정
function setupCartButtons() {
  // 이벤트 위임을 통해 동적으로 생성된 요소에도 이벤트 연결
  $(document).on('click', '.cart-button', function() {
    const $book = $(this).closest('.book');
    const title = $book.find('strong').text();
    const priceText = $book.find('p').text();
    const price = parseFloat(priceText.match(/\$([0-9.]+)/)[1]);
    const img = $book.find('img').attr('src');
    
    addToCart(title, price, img);
  });
}

// 장바구니에 책 추가
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

// 장르 필터링
function setupGenreFilter() {
  $('#genre').on('change', function() {
    const selectedGenre = $(this).val();
    if (selectedGenre === 'all') {
      renderBooks(allBooks);
    } else {
      const filteredBooks = allBooks.filter(book => book.genre === selectedGenre);
      renderBooks(filteredBooks);
    }
  });
}

// 스크롤 애니메이션
function setupScrollAnimation() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $(entry.target).addClass('show');
      }
    });
  }, {
    threshold: 0.1
  });
  
  $('.section').each(function() {
    $(this).addClass('hidden');
    observer.observe(this);
  });
}

// 이메일 구독
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