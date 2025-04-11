/**
 * cart.js - 북스토어 장바구니 페이지 스크립트
 */

$(function () {
  const buyBtn = $('#buyBtn');
  const cancelBtn = $('#cancelBtn');
  const memberNo = parseInt(localStorage.getItem('loginMno')) || 0;
  let member = null;

  renderCartItems();
  setupCartButtons();
  if(localStorage.getItem('loginMno') !== 'naver'){
    loadMemberInfo();
  }else{
    const naverUser = JSON.parse(localStorage.getItem('naver_user'));
    console.log("i",naverUser);
    $('#member-name').text(naverUser.name);
    $('#member-address').replaceWith('<input type="text" id="addr" placeholder="주소를 입력하세요."/> ');
    $('#member-phone')
      .prop('id','member-email')
      .text(naverUser.email)
    $('#payment-method').text('네이버페이');
  }

  function loadMemberInfo() {
    $.ajax({
      url: 'http://localhost:3001/MEMBER',
      method: 'GET'
    }).then(function (members) {
      member = members.find(m => m.MNO === memberNo);
      if (member) {
        $('#member-name').text(member.M_NAME);
        $('#member-address').text(member.M_ADDR);
        $('#member-phone').text(member.M_HP);
        $('#payment-method').text(member.M_PAY);
      }
    }).catch(function (error) {
      console.error('회원 정보 불러오기 실패:', error);
    });
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  }

  function renderCartItems() {
    const $cartList = $('#cart-list');
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
        <img src="/frontend/assets/images/${item.title}.png" alt="${item.title}" style="width:100px; height:auto;">
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

    cancelBtn.on('click', function () {
      alert('구매를 취소합니다');
      localStorage.removeItem('cart');
      $('#point-area').remove(); 
      renderCartItems();
    });

    buyBtn.on('click', showPointArea);
  }

  function changeQuantity(index, delta) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart[index]) {
      cart[index].quantity = Math.max(1, cart[index].quantity + delta);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCartItems();
    }
  }

  function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart[index]) {
      const removed = cart.splice(index, 1)[0];
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`"${removed.title}"이(가) 장바구니에서 제거되었습니다.`);
      renderCartItems();
    }
  }

  function calculateTotal(cart) {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function updateTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = calculateTotal(cart);
    $('#final-total').text(`₩${total.toLocaleString()}`);
  }

  function showPointArea() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = calculateTotal(cart);

    if(cart.length===0){
      alert("구매할 도서가 없어요.");
      return;
    }


    if (!member) {
      alert("회원 정보를 불러오지 못했습니다. 다시 시도해주세요.");
      return;
    }

    // 기존 point 영역 렌더링 동일
    $('#point-area').remove(); // 기존 영역 제거 후 다시 추가
    $('.order').append('<div id="point-area"></div>');

    const balancePoints = member.M_PNT;

    $('#point-area').html(`
      <p id="balance-points">보유 포인트: <span>${balancePoints}</span></p>
      <p id="use-points">사용하실 포인트:
        <input type="number" id="input-points" placeholder="사용하실 포인트" value="0" />
      </p>
      <span id="error-message" style="color: red; display: none;">사용할 포인트는 보유 포인트 초과 불가</span>
      <p id="earn-points">적립예정 포인트: <span>${Math.floor(totalPrice * 0.01)}</span></p>
      <h3 id="final-price">최종 결제 금액 : ${formatCurrency(totalPrice)}</h3>
    `);

    $('#buyBtn').replaceWith('<button class="btn buy-btn" id="confirmBtn">결제하기</button>');

    $('#input-points').on('input', function () {
      let usedPoints = parseInt($(this).val()) || 0;

      if (usedPoints > balancePoints) {
        $(this).val(balancePoints);
        usedPoints = balancePoints;
        $('#error-message').show();
      } else {
        $('#error-message').hide();
      }

      let earnedPoints = Math.floor((totalPrice - usedPoints) * 0.01);
      $('#earn-points span').text(earnedPoints);
      $('#final-price').text(`최종 결제 금액 : ${formatCurrency(totalPrice - usedPoints)}`);
    });

    $('#confirmBtn').on('click', function () {
      alert('결제가 완료되었습니다. 감사합니다!');
      localStorage.removeItem('cart');
      $('#point-area').remove(); 
      renderCartItems();
    });
  }
});
