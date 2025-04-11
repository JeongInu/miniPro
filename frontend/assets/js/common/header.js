document.getElementById('logo').addEventListener('click', function () {
  window.location.href = '/index.html';
});

const loginMno = localStorage.getItem('loginMno');
updateLoginUI(!!loginMno);
console.log(loginMno)

function updateLoginUI(isLoggedIn) {
  if (isLoggedIn) {
    $('.login-button').hide();
    $('nav a[href="/frontend/pages/cart.html"]').show();
    $('nav a:contains("마이페이지")').show();

    if (!$('.logout-button').length) {
      $('nav').append('<a href="#" class="logout-button">로그아웃</a>');
    }

    $('.logout-button').off('click').on('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('loginMno');
      localStorage.removeItem('naver_user');
      alert('로그아웃 되었습니다.');
      updateLoginUI(false); // 상태 업데이트
      window.location.href = '/index.html';
    });

  } else {
    $('.login-button').show();
    $('nav a[href="/frontend/pages/cart.html"]').hide();
    $('nav a:contains("마이페이지")').hide();
    $('.logout-button').remove();

    $('.login-button').off('click').on('click', function (e) {
      e.preventDefault();
      window.location.href = '/frontend/pages/login.html';
    });
  }
}