$(document).ready(function () {
    // 로컬스토리지에서 장바구니 불러오기
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // 장바구니에 책 추가
    function addToCart(title, price, image) {
      const existingItem = cart.find(item => item.title === title);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ title, price, image, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${title}이(가) 장바구니에 담겼습니다.`);
    }
  
    // 홈 페이지에서 책에 이벤트 바인딩
    $('.book').each(function () {
      const $book = $(this);
      const $button = $book.find('.cart-button');
  
      if ($button.length) {
        $button.on('click', function () {
          const title = $book.find('strong').text();
          const price = parseFloat($book.find('p').text().split('$')[1]);
          const image = $book.find('img').attr('src');
          addToCart(title, price, image);
        });
      }
    });
  
    // 장바구니 렌더링
    function renderCart() {
      const $container = $('#cart-container');
      const $totalDisplay = $('#total-price');
      if (!$container.length || !$totalDisplay.length) return;
  
      $container.empty();
  
      if (cart.length === 0) {
        $container.html('<p>장바구니가 비어 있습니다.</p>');
        $totalDisplay.text('0 원');
        return;
      }
  
      cart.forEach((item, index) => {
        const $div = $(`
          <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" width="80">
            <div class="item-info">
              <h4>${item.title}</h4>
              <p>가격: $${item.price}</p>
              <div>
                수량:
                <button class="decrease" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="increase" data-index="${index}">+</button>
                <button class="remove" data-index="${index}">삭제</button>
              </div>
            </div>
          </div>
        `);
        $container.append($div);
      });
  
      const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      $totalDisplay.text(total.toLocaleString() + ' 원');
  
      // 버튼 기능 연결
      $('.increase').on('click', function () {
        const index = $(this).data('index');
        cart[index].quantity++;
        saveAndRender();
      });
  
      $('.decrease').on('click', function () {
        const index = $(this).data('index');
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
          saveAndRender();
        }
      });
  
      $('.remove').on('click', function () {
        const index = $(this).data('index');
        cart.splice(index, 1);
        saveAndRender();
      });
    }
  
    // 저장 후 렌더링
    function saveAndRender() {
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    }
  
    // 전체 삭제 버튼
    $('#clear-cart').on('click', function () {
      if (confirm('장바구니를 비우시겠습니까?')) {
        cart = [];
        saveAndRender();
      }
    });
  
    // 결제 버튼
    $('#checkout').on('click', function () {
      if (cart.length === 0) {
        alert('장바구니가 비어 있습니다.');
      } else {
        alert('결제가 완료되었습니다. 감사합니다!');
        cart = [];
        saveAndRender();
      }
    });
  
    // 장바구니 페이지일 때 렌더링 실행
    if (window.location.pathname.includes('cart.html')) {
      renderCart();
    }
  });
  