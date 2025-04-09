/// 장바구니 담기 기능

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
  document.querySelectorAll('.cart-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const bookEl = e.target.closest('.book');
      const title = bookEl.querySelector('p strong').innerText;
  
      // 가격 파싱
      const priceText = bookEl.querySelector('p').innerText.split('\n')[1].trim();
      const price = parseFloat(priceText.replace('$', ''));
  
      const img = bookEl.querySelector('img').getAttribute('src');
      addToCart(title, price, img);
    });
  });
  
  
  // 장르 필터링 기능
  
  const genreSelect = document.getElementById('genre');
  if (genreSelect) {
    genreSelect.addEventListener('change', () => {
      const selectedGenre = genreSelect.value;
      const books = document.querySelectorAll('.section:nth-of-type(2) .book');
  
      books.forEach(book => {
        const genre = book.getAttribute('data-genre');
        book.style.display = (selectedGenre === 'all' || genre === selectedGenre)
          ? 'block'
          : 'none';
      });
    });
  }
  
  
  // 스크롤 애니메이션 (Intersection Observer)

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, {
    threshold: 0.1
  });
  
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.add('hidden');
    observer.observe(section);
  });
  
  
  // 이메일 등록 (계약 문의)
  
  const emailButton = document.querySelector('.subscribe button');
  emailButton?.addEventListener('click', () => {
    const emailInput = document.querySelector('.subscribe input');
    const email = emailInput?.value;
  
    if (email) {
      alert(`출판사 이메일 ${email}이(가) 등록되었습니다.`);
      emailInput.value = '';
    } else {
      alert('이메일을 입력해주세요.');
    }
  });
  