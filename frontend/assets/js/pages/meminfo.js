$(function () {
  // 탭 클릭 이벤트 처리
  $('.nav-tabs .tab').on('click', function (e) {
    e.preventDefault();

    // 이미 활성화된 탭이면 아무것도 하지 않음
    if ($(this).hasClass('active')) return;

    // 모든 탭에서 'active' 클래스를 제거하고 클릭한 탭에만 'active' 클래스 추가
    $('.nav-tabs .tab').removeClass('active');
    $(this).addClass('active');

    // 현재 활성화된 탭을 슬라이드 업(숨김) 시키고,
    // 클릭된 탭에 해당하는 탭 내용을 슬라이드 다운(표시) 시킴
    $('.tab-pane.active').slideUp(300, function () {
      $(this).removeClass('active');

      // 클릭된 탭의 대상에 해당하는 탭 내용을 보여줌
      const target = $($(e.currentTarget).data('target'));
      target.slideDown(300).addClass('active');
    });
  });

  // 기본적으로 '주문 내역' 탭을 보여줌
  $('.tab-pane').hide();
  $('#order').show();

  // 회원 번호(MNO)를 로컬 스토리지에서 가져옴
  const memberNo = localStorage.getItem('loginMno');  // 로그인 시 저장된 MNO
  // console.log(memberNo);

  // MNO가 존재하는지 확인
  if (memberNo) {
    if(memberNo === 'naver'){
      alert('네이버 회원님 서비스는 준비 중 입니다.ლ(╹◡╹ლ)');
      window.location.href = '/index.html';
      return;
    }

    $.ajax({
      url: 'http://localhost:3001/MEMBER',
      method : 'GET',
      success: function(data){
        const members = data;  // MEMBER 테이블에서 모든 회원 데이터 가져옴
        const member = members.find(member => member.MNO === parseInt(memberNo));  // MNO에 해당하는 회원 찾기
        if (member) {
          $('#name').val(member.M_NAME);
          $('#id').val(member.M_ID);
          $('#addr').val(member.M_ADDR);
          $('#email').val(member.M_EMAIL);
          $('#tele').val(member.M_TELE);
          $('#hp').val(member.M_HP);
          $('#pay').val(member.M_PAY);
          $('#pnt').val(member.M_PNT);
        } else {
          alert('해당 회원 정보를 찾을 수 없습니다.');
        }
      },
      error: function (error) {
        alert('회원 정보를 불러오는 데 실패했습니다.');
        console.error(error);
      }
    });
  } else {
    alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
  }

    // 주문 내역 불러오기
  if (memberNo) {
    $.ajax({
      url: 'http://localhost:3001/PURCHASE',
      method: 'GET',
      success: function (orders) {
        const $orderList = $('#orderList');
        $orderList.empty(); // 기존 테이블 내용 초기화

        // 로그인한 회원의 주문만 필터링
        const myOrders = orders
        .filter(order => order.MNO === parseInt(memberNo))
        .sort((a, b) => new Date(b.OD_DATE) - new Date(a.OD_DATE)); // 날짜 내림차순 정렬

        if (myOrders.length > 0) {
          $.each(myOrders, function(index, order) {
            const date = new Date(order.OD_DATE);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            const odno = order.ODNO;
            const price = order.OD_PRICE;
            const usePnt = order.OD_USEPNT;
            const addPnt = order.OD_ADDPNT;

            // 포인트 문자열 만들기
            let pointText = '-';
            if (usePnt > 0 || addPnt > 0) {
              pointText = '';
              if (usePnt > 0) pointText += `-${usePnt}`;
              if (addPnt > 0) {
                if (pointText !== '') pointText += ' / ';
                pointText += `+${addPnt}`;
              }
            }

            const row = `
              <tr>
                <td>${index + 1}</td>
                <td>${formattedDate}</td>
                <td>${odno}</td>
                <td>${price.toLocaleString()} 원</td>
                <td>${pointText}</td>
              </tr>
            `;
            $orderList.append(row);
          });
        } else {
          $orderList.append('<tr><td colspan="4">주문 내역이 없습니다.</td></tr>');
        }
      },
      error: function (err) {
        alert('주문 내역을 불러오는 데 실패했습니다.');
        console.error(err);
      }
    });
  }
  
});