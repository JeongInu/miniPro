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
    $.ajax({
      url: 'http://localhost:3001/MEMBER',
      method : 'GET',
      success: function(data){
        const members = data;  // MEMBER 테이블에서 모든 회원 데이터 가져옴
        const member = members.find(member => member.MNO === parseInt(memberNo));  // MNO에 해당하는 회원 찾기
        console.log(member);
        // 해당 회원이 있으면 회원 정보를 폼에 채워넣음
          $('#name').val(member.M_NAME);       // 이름
          $('#id').val(member.M_ID);           // 아이디
          $('#addr').val(member.M_ADDR);       // 주소
          $('#email').val(member.M_EMAIL);     // 이메일
          $('#tele').val(member.M_TELE);       // 유선번호
          $('#hp').val(member.M_HP);        // 휴대폰번호
          $('#pay').val(member.M_PAY);         // 선호 결제수단
          $('#pnt').val(member.M_PNT);       // 보유 포인트
          console.log(data)
      },
      error: function(error){
        console.error(error);
      },
    });

    // data.json 파일에서 MEMBER 테이블 데이터를 불러옴
    $.getJSON('../data/data.json', function (data) {
      const members = data.MEMBER;  // MEMBER 테이블에서 모든 회원 데이터 가져옴
      const member = members.find(m => m.MNO === parseInt(memberNo));  // MNO에 해당하는 회원 찾기

      // 해당 회원이 있으면 회원 정보를 폼에 채워넣음
      if (member) {
        $('input[name="name"]').val(member.M_NAME);       // 이름
        $('input[name="id"]').val(member.M_ID);           // 아이디
        $('input[name="addr"]').val(member.M_ADDR);       // 주소
        $('input[name="email"]').val(member.M_EMAIL);     // 이메일
        $('input[name="tele"]').val(member.M_TELE);       // 유선번호
        $('input[name="phone"]').val(member.M_HP);        // 휴대폰번호
        $('input[name="pay"]').val(member.M_PAY);         // 선호 결제수단
        $('input[name="point"]').val(member.M_PNT);       // 보유 포인트
      } else {
        // 해당 MNO에 맞는 회원을 찾을 수 없을 경우
        alert('회원 정보를 찾을 수 없습니다.');
      }
    }).fail(function () {
      // JSON 파일을 불러오는 데 실패할 경우
      alert('회원 정보를 불러오지 못했습니다. 다시 시도해주세요.');
    });
  } else {
    // MNO 정보가 없으면 로그인되지 않은 상태임
    alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
  }
});
