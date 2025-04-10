/**
 * cart.js - 북스토어 장바구니 페이지 스크립트
 */

$(function () {
  renderCartItems();
  setupCartButtons();
});

// 장바구니 아이템 렌더링
function renderCartItems() {
  const $cartList = $('#cart-list');
  if (!$cartList.length) return;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    $cartList.html('<p>장바구니가 비어 있습니다.</p>');
    updateTotal();
    return;
  }

  $cartList.empty();

  $.each(cart, function(index, item) {
    const $div = $('<div>').addClass('cart-item');
    $div.html(`
      <img src="images/${item.title}.png" alt="${item.title}" style="width:100px; height:auto;">

      <div class="cart-details">
        <p><strong>${item.title}</strong></p>
        <p>가격: ₩${item.price.toLocaleString()}</p>
        <p>수량: ${item.quantity}</p>
        <div class="quantity-controls">
          <button class="increase-qty" data-index="${index}">+</button>
          <button class="decrease-qty" data-index="${index}">-</button>
          <button class="remove-button" data-index="${index}">삭제</button>
        </div>
      </div>
    `);
    $cartList.append($div);
  });

  updateTotal();
}

// 장바구니 버튼 이벤트 설정
function setupCartButtons() {
  $(document).on('click', '.increase-qty', function () {
    changeQuantity($(this).data('index'), 1);
  });

  $(document).on('click', '.decrease-qty', function () {
    changeQuantity($(this).data('index'), -1);
  });

  $(document).on('click', '.remove-button', function () {
    removeItem($(this).data('index'));
  });

  $('#clear-cart').on('click', clearCart);
  $('#checkout').on('click', processCheckout);
}

// 수량 변경
function changeQuantity(index, delta) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart[index]) {
    cart[index].quantity = Math.max(1, cart[index].quantity + delta);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
  }
}

// 아이템 삭제
function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart[index]) {
    const removed = cart.splice(index, 1)[0];
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`"${removed.title}"이(가) 장바구니에서 제거되었습니다.`);
    renderCartItems();
  }
}

// 장바구니 비우기
function clearCart() {
  if (confirm('장바구니를 비우시겠습니까?')) {
    localStorage.removeItem('cart');
    alert('장바구니가 비워졌습니다.');
    renderCartItems();
  }
}

// 결제 처리
function processCheckout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (!cart.length) {
    alert('장바구니가 비어 있습니다.');
    return;
  }

  alert('결제가 완료되었습니다. 감사합니다!');
  localStorage.removeItem('cart');
  renderCartItems();
}

// 총 금액 계산 및 표시
function calculateTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateTotal() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = calculateTotal(cart);
  $('#total').text(`총 합계: ₩${total.toLocaleString()}`);
}