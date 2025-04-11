const footer = document.querySelector('footer');
const toggleBtn = document.getElementById('toggle-footer');

toggleBtn.addEventListener('click', () => {
  const isCollapsed = footer.classList.toggle('collapsed');

  toggleBtn.textContent = isCollapsed ? '⬆️' : '⬇️';
  
  body.style.marginBottom = isCollapsed ? '40px' : '200px';

  if (!isCollapsed) {
    window.scrollBy({
      top: 180,
      left: 0,
      behavior: 'smooth'
    });
  }
});

$('.subscribe button').on('click', function() {
  const email = $('.subscribe input').val();
  if (email) {
    alert(`출판사 이메일 ${email}이(가) 등록되었습니다.`);
    $('.subscribe input').val('');
  } else {
    alert('이메일을 입력해주세요.');
  }
});