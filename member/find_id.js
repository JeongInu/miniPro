$(function () {
    // 휴대폰 번호 입력 필드에 자동 마스크 적용 (하이픈 포함 형식: 010-1234-5678)
    $('#phone').inputmask('999-9999-9999');  // 999는 숫자만 허용, 하이픈 자동 입력됨
  
    // '아이디 찾기' 버튼 클릭 시 실행되는 이벤트
    $('#findId').click(function (e) {
      e.preventDefault();  // 폼 전송을 막고, 버튼 클릭 후 페이지 리로드를 방지
  
      // 입력된 값들 가져오기 (입력 필드 값은 trim()으로 앞뒤 공백 제거)
      const name = $('#name').val().trim();
      const email = $('#email').val().trim();
      const phone = $('#phone').val().trim();
  
      // 필수 입력 체크 (이름과 이메일 또는 전화번호 중 하나는 필수)
      if (!name || (!email && !phone)) {
        alert('이름과 이메일 또는 휴대폰 번호 중 하나를 입력해야 합니다.');
        return;  // 입력이 잘못되었으면 함수 종료
      }
  
      // JSON 파일에서 회원 정보 가져오기
      $.getJSON('../data/data.json', function (data) {
        const members = data.MEMBER;  // MEMBER 테이블의 모든 데이터 가져오기
        let foundUser = null;  // 일치하는 회원이 있을 경우 저장할 변수
  
        // 회원 목록을 순회하면서 이름 + 이메일 또는 이름 + 휴대폰 번호가 일치하는 회원 찾기
        for (let member of members) {
          // 이름이 일치하고, 이메일 또는 전화번호가 일치하는 경우
          if (
            member.M_NAME === name &&  // 이름이 일치하는 경우
            ((email && member.M_EMAIL === email) || (phone && member.M_HP === phone))  // 이메일 또는 휴대폰 번호가 일치하는 경우
          ) {
            foundUser = member;  // 일치하는 회원을 찾았으면 foundUser 변수에 저장
            break;  // 일치하는 회원을 찾으면 더 이상 반복문을 돌 필요 없으므로 종료
          }
        }
  
        // 일치하는 회원이 있으면 아이디를 알려줌
        if (foundUser) {
          alert(`회원님의 아이디는 "${foundUser.M_ID}" 입니다.`);  // 아이디 표시
        } else {
          alert('일치하는 정보가 없습니다.');  // 일치하는 회원이 없으면 안내 메시지
        }
      }).fail(function () {
        // JSON 파일 로드 실패 시 에러 메시지
        alert('회원 정보를 불러오지 못했습니다. 다시 시도해주세요.');
      });
    });
  });
  