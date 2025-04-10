/**
 * cart.js - 북스토어 장바구니 페이지 스크립트
 */

$(function() {
  // 장바구니 페이지 초기화
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
  
  // 카트 아이템 렌더링
  $.each(cart, function(index, item) {
    const $div = $('<div>').addClass('cart-item');
    $div.html(`
      <img src="${item.img}" alt="${item.title}" />
      <div class="cart-details">
        <p><strong>${item.title}</strong></p>
        <p>가격: $${item.price}</p>
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
  // 수량 증가 버튼
  $(document).on('click', '.increase-qty', function() {
    const index = $(this).data('index');
    changeQuantity(index, 1);
  });
  
  // 수량 감소 버튼
  $(document).on('click', '.decrease-qty', function() {
    const index = $(this).data('index');
    changeQuantity(index, -1);
  });
  
  // 아이템 삭제 버튼
  $(document).on('click', '.remove-button', function() {
    const index = $(this).data('index');
    removeItem(index);
  });
  
  // 장바구니 비우기 버튼
  $('#clear-cart').on('click', function() {
    clearCart();
  });
  
  // 결제하기 버튼
  $('#checkout').on('click', function() {
    processCheckout();
  });
}

// 수량 변경 함수
function changeQuantity(index, delta) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (index >= 0 && index < cart.length) {
    cart[index].quantity += delta;
    
    // 최소 수량은 1로 유지
    if (cart[index].quantity < 1) {
      cart[index].quantity = 1;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
  }
}

// 아이템 삭제 함수
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (index >= 0 && index < cart.length) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    alert(`"${removedItem.title}"이(가) 장바구니에서 제거되었습니다.`);
    renderCartItems();
  }
}

// 장바구니 비우기 함수
function clearCart() {
  if (confirm('장바구니를 비우시겠습니까?')) {
    localStorage.removeItem('cart');
    renderCartItems();
    alert('장바구니가 비워졌습니다.');
  }
}

// 결제 처리 함수
function processCheckout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart.length === 0) {
    alert('장바구니가 비어 있습니다.');
    return;
  }
  
  alert('결제가 완료되었습니다. 감사합니다!');
  localStorage.removeItem('cart');
  renderCartItems();
}

// 총 금액 계산 함수
function calculateTotal(cart) {
  return cart.reduce(function(total, item) {
    return total + (item.price * item.quantity);
  }, 0);
}

// 총 금액 표시 업데이트
function updateTotal() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = calculateTotal(cart);
  $('#total').text(`총 합계: $${total.toFixed(2)}`);
}