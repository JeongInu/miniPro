// URL에서 id 파라미터 가져오기
const params = new URLSearchParams(window.location.search);
const bookId = params.get('id');

// 날짜 형식을 "YYYY년 MM월 DD일"로 변환하는 함수
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

// 책 정보를 불러오는 함수
function loadBookDetail() {
  // API 호출
  $.get('http://localhost:3001/BOOK')
    .done(function (books) {
      // bookId에 해당하는 책 찾기
      const book = books.find(b => b.BNO == bookId);

      if (book) {
        // 책 정보를 렌더링
        document.getElementById('bookDetail').innerHTML = `
          <img src="/frontend/assets/images/${book.BNAME}.png" alt="${book.BNAME}">
          <h1>${book.BNAME}</h1>
          <p><strong>저자:</strong> ${book.B_WR}</p>
          <p><strong>출판일:</strong> ${formatDate(book.B_DATE)}</p>
          <p class="price">
            <span class="original-price">정가: ${book.B_PRICE.toLocaleString()}</span>
            ➡️ <strong>할인가: ${Math.round(book.B_PRICE * (1 - book.SALE)).toLocaleString()}원</strong>
          </p>
          <div class="B_CATE">
            <p><strong>장르: </strong>${book.B_CATE}</p>
          </div>
          <div class="SALE">
            <p><strong>할인률: </strong>${Math.round(book.SALE*100).toLocaleString()}%</p>
          </div>
          <div class="btn-container">
            <button onclick="addToCart('${book.BNAME}', ${Math.round(book.B_PRICE * (1 - book.SALE))}, '/frontend/assets/images/${book.BNAME}.png')">장바구니에 담기</button>
          </div>
        `;
      } else {
        // 책 정보를 찾을 수 없는 경우
        document.getElementById('bookDetail').innerHTML = '<p>책 정보를 찾을 수 없습니다.</p>';
      }
    })
    .fail(function () {
      // API 호출 실패 시
      document.getElementById('bookDetail').innerHTML = '<p>책 정보를 불러오는 데 실패했습니다.</p>';
    });
}

// 장바구니에 추가하는 함수
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

// 페이지 로드 시 책 정보 불러오기
$(document).ready(function () {
  if (bookId) {
    loadBookDetail();
  } else {
    document.getElementById('bookDetail').innerHTML = '<p>잘못된 요청입니다. 책 ID가 없습니다.</p>';
  }
});