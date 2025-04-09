// main.js

// 카트 기능 구현
const cart = [];

function updateCartDisplay() {
  const cartPage = document.getElementById('cart-page');
  if (!cartPage) return;

  cartPage.innerHTML = '<h2>내 카트</h2>';
  if (cart.length === 0) {
    cartPage.innerHTML += '<p>카트에 담긴 책이 없습니다.</p>';
    return;
  }

  const ul = document.createElement('ul');
  cart.forEach(book => {
    const li = document.createElement('li');
    li.textContent = `${book.title} - $${book.price}`;
    ul.appendChild(li);
  });
  cartPage.appendChild(ul);
}

// 카트 버튼 이벤트 연결
const cartButtons = document.querySelectorAll('.cart-button');
cartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const parent = button.parentElement;
    const title = parent.querySelector('p strong').textContent;
    const priceText = parent.querySelector('p').innerText.split('$')[1];
    const price = parseFloat(priceText);
    addToCart(title, price);
  });
});

document.querySelectorAll('.cart-button').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const bookEl = e.target.closest('.book');
      const title = bookEl.querySelector('p strong').innerText;
      const priceText = bookEl.querySelector('p').innerText.split('\n')[1].trim();
      const price = parseFloat(priceText.replace('$', ''));
      const img = bookEl.querySelector('img').getAttribute('src');
  
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
      // 이미 담은 책이면 수량 증가
      const existing = cart.find(item => item.title === title);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ title, price, img, quantity: 1 });
      }
  
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${title}이(가) 장바구니에 담겼습니다.`);
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
      if (selectedGenre === 'all' || genre === selectedGenre) {
        book.style.display = 'block';
      } else {
        book.style.display = 'none';
      }
    });
  });
}

// 애니메이션 효과 (스크롤 등장)
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

// 이메일 계약 문의
const emailButton = document.querySelector('.subscribe button');
emailButton?.addEventListener('click', () => {
  const emailInput = document.querySelector('.subscribe input');
  if (emailInput.value) {
    alert(`출판사 이메일 ${emailInput.value}이(가) 등록되었습니다.`);
    emailInput.value = '';
  } else {
    alert('이메일을 입력해주세요.');
  }
});

