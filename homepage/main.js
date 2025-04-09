// jQuery 문서 준비 이벤트
$(document).ready(function () {
    // 책을 장바구니에 추가하는 함수
    function addToCart(title, price, img) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
      const existing = cart.find(item => item.title === title);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ title, price, img, quantity: 1 });
      }
  
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${title}이(가) 장바구니에 담겼습니다.`);
    }
  
    // '장바구니 담기' 버튼 이벤트 등록
    $('.cart-button').on('click', function () {
      const $bookEl = $(this).closest('.book');
      const title = $bookEl.find('p strong').text();
  
      // 가격 파싱
      const priceText = $bookEl.find('p').text().split('\n')[1].trim();
      const price = parseFloat(priceText.replace('$', ''));
  
      const img = $bookEl.find('img').attr('src');
      addToCart(title, price, img);
    });
  
    // 장르 필터링 기능
    $('#genre').on('change', function () {
      const selectedGenre = $(this).val();
      $('.section:nth-of-type(2) .book').each(function () {
        const genre = $(this).attr('data-genre');
        if (selectedGenre === 'all' || genre === selectedGenre) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });
  
    // 스크롤 애니메이션 (Intersection Observer는 jQuery로 완전히 대체 불가, class 추가만 jQuery로)
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $(entry.target).addClass('show');
        }
      });
    }, {
      threshold: 0.1
    });
  
    $('.section').each(function () {
      $(this).addClass('hidden');
      observer.observe(this);
    });
  
    // 이메일 등록 (계약 문의)
    $('.subscribe button').on('click', function () {
      const email = $('.subscribe input').val();
      if (email) {
        alert(`출판사 이메일 ${email}이(가) 등록되었습니다.`);
        $('.subscribe input').val('');
      } else {
        alert('이메일을 입력해주세요.');
      }
    });
  });
  