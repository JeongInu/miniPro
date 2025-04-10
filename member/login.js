$(function() {

    // 로그인 버튼 클릭 이벤트
    $('#loginBtn').click(function(e) {
      e.preventDefault(); // 폼 기본 제출 동작 막기
  
      // 입력된 아이디와 비밀번호 값 가져오기
      const id = $('#loginId').val().trim();
      const passWord = $('#loginPassword').val().trim();
  
      // 아이디 또는 비밀번호가 비어있을 경우
      if (!id || !passWord) {
        alert('아이디와 비밀번호를 모두 입력해주세요.');
        return;
      }
  
      // data.json 파일에서 MEMBER 배열 불러오기
      $.getJSON('../data/data.json', function(data) {
        const members = data.MEMBER; // MEMBER 배열 가져오기
        let found = false; // 로그인 성공 여부 플래그
  
        // members 배열에서 입력값과 일치하는 회원 찾기
        for (let i = 0; i < members.length; i++) {
          const member = members[i];
  
          // 아이디와 비밀번호가 일치하는 경우
          if (member.M_ID === id && member.M_PW === passWord) {
            // 로그인 성공 처리
            localStorage.setItem('loginMno', member.MNO); // 회원번호 저장
  
            // 홈페이지로 이동 (상대 경로 주의!)
            window.location.href = '../homepage/homepage.html';
            found = true;
            break;
          }
        }
  
        // 일치하는 회원이 없을 경우
        if (!found) {
          alert('아이디 또는 비밀번호가 일치하지 않습니다.');
          // 입력값 초기화
          $('#loginId').val('');
          $('#loginPassword').val('');
          $('#loginId').focus(); // 아이디 입력창에 포커스
        }
      });
    });
  
    // 엔터키로 로그인 시도 가능하도록 설정
    $('#loginForm input').keypress(function(e) {
      if (e.which === 13) { // 13번 키는 Enter
        $('#loginBtn').click(); // 로그인 버튼 클릭 이벤트 실행
      }
    });
  
  });
  

