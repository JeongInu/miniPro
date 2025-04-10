$(function() {
  const buyBtn = $('#buyBtn');
  const cancelBtn = $('#cancelBtn');

  const pbBnoList = [1, 3, 5];
  const memberNo = 1;
  let member = '';
  let totalPrice = 0;

  function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  }

  Promise.all([
    $.ajax({
      url: 'http://localhost:3001/BOOK',
      method: 'GET'
    }),
    $.ajax({
      url: 'http://localhost:3001/MEMBER',
      method: 'GET'
    })
  ])
  .then(function([books, members]) {
    const filteredBooks = books.filter(book => pbBnoList.includes(book.PB_BNO));

    $.each(filteredBooks, function(index, book) {
      totalPrice += book.B_PRICE;
      $('.cart-items').append(`
        <div class="cart-item">
          <div>
            <h3>${book.BNAME}</h3>
            <p>카테고리: ${book.B_CATE}</p>
            <p>작가: ${book.B_WR}</p>
          </div>
          <div>
            <p>${formatCurrency(book.B_PRICE)}</p>
            <p>개수: 1</p>
          </div>
        </div>
      `);
    });

    $('.total-price').text('총액: ' + formatCurrency(totalPrice));

    member = members.find(m => m.MNO === memberNo);
    if (member) {
      $('#member-name').text(member.M_ID);
      $('#member-address').text(member.M_ADDR);
      $('#member-phone').text(member.M_HP);
      $('#payment-method').text(member.M_PAY);
    }
  })
  .catch(function(error) {
    console.error(`에러지롱 ${error}`);
  });

  $(buyBtn).on('click', function(){
    let balancePoints = member.M_PNT;

    $('.action-buttons').before('<div id="point-area"></div>');

    $('#point-area').append(`
      <p id="balance-points">보유 포인트: <span>${balancePoints}</span></p>
      <p id="use-points">사용하실 포인트:
        <input type="number" id="input-points" placeholder="사용하실 포인트" />
      </p>
      <span id="error-message" style="color: red; display: none;">사용할 포인트는 보유 포인트 초과 불가</span>
      <p id="earn-points">적립예정 포인트: <span></span></p>
      <h3 id="final-price">최종 결제 금액 : </h3>
    `);

    $(buyBtn).replaceWith('<button class="btn buy-btn" id="confirmBtn">결제하기</button>');

    $('#input-points').on('input', function() {
      let usedPoints = parseInt($(this).val()) || 0;

      if (usedPoints > balancePoints) {
        $(this).val(balancePoints);
        usedPoints = balancePoints;
        $('#error-message').show();
      } else {
        $('#error-message').hide();
      }
      
      let earnedPoints = Math.floor((totalPrice-usedPoints)*0.01);

      $('#use-points span').text(`${usedPoints}`);
      $('#earn-points span').text(earnedPoints);
      $('#final-price').text(`${formatCurrency(totalPrice-usedPoints)}`);
    });
  });

  $(cancelBtn).on('click', function(){
    alert('안사지롱');
  });

});