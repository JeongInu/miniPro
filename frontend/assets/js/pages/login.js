$(function () {
    // 로그인 버튼 클릭 이벤트
    $('#loginBtn').click(function (e) {
      e.preventDefault(); // 기본 폼 제출 방지
  
      const id = $('#loginId').val().trim();
      const passWord = $('#loginPassword').val().trim();
  
      if (!id || !passWord) {
        alert('아이디와 비밀번호를 모두 입력해주세요.');
        return;
      }
  
      // 회원 데이터 불러오기
      $.ajax({
        url: 'http://localhost:3001/MEMBER', // JSON 서버 실행 주소
        method: 'GET',
        success: function (data) {
          const members = data;
          let found = false;
  
          for (let i = 0; i < members.length; i++) {
            const member = members[i];
  
            if (member.M_ID === id && member.M_PW === passWord) {
              localStorage.setItem('loginMno', member.MNO); // 로그인한 회원번호 저장
              window.location.href = '/index.html';
              found = true;
              break;
            }
          }
  
          // 로그인 실패 처리
          if (!found) {
            alert('아이디 또는 비밀번호가 일치하지 않습니다.');
            $('#loginId').val('');
            $('#loginPassword').val('');
            $('#loginId').focus();
          }
        },
        error: function (error) {
          alert('데이터를 불러오는 중 오류가 발생했습니다.');
          console.error(error);
        }
      });
    });
  
    // 엔터키로 로그인 가능하도록
    $('#loginForm input').keypress(function (e) {
      if (e.which === 13) {
        $('#loginBtn').click();
      }
    });
  });

  window.addEventListener('DOMContentLoaded', () => {
    const naverLogin = new naver.LoginWithNaverId({
      clientId: 'HweKSxPk9GkzzKdrNaKN', // 네이버에서 발급받은 Client ID
      callbackUrl: 'http://127.0.0.1:5500/frontend/pages/naver_callback.html',
      isPopup: false,
      loginButton: { color: 'green', type: 3, height: 45 } // 자동 생성 버튼 스타일
    });
  
    naverLogin.init();
  });