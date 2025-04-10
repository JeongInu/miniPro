// 로컬스토리지에서 장바구니 불러오기
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 장바구니에 책 추가
function addToCart(title, price, image) {
  const existingItem = cart.find(item => item.title === title);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ title, price, image, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${title}이(가) 장바구니에 담겼습니다.`);
}

// 홈 페이지에서 책에 이벤트 바인딩
document.querySelectorAll('.book').forEach(book => {
  const button = book.querySelector('.cart-button');
  if (button) {
    button.addEventListener('click', () => {
      const title = book.querySelector('strong').innerText;
      const price = book.querySelector('p').innerText.split('$')[1];
      const image = book.querySelector('img').src;
      addToCart(title, parseFloat(price), image);
    });
  }
});

// 장바구니 렌더링
function renderCart() {
  const container = document.querySelector('#cart-container');
  const totalDisplay = document.querySelector('#total-price');
  if (!container || !totalDisplay) return;

  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>장바구니가 비어 있습니다.</p>';
    totalDisplay.textContent = '0 원';
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}" width="80">
      <div class="item-info">
        <h4>${item.title}</h4>
        <p>가격: $${item.price}</p>
        <div>
          수량:
          <button class="decrease" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="increase" data-index="${index}">+</button>
          <button class="remove" data-index="${index}">삭제</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });

  // 총합계
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  totalDisplay.textContent = total.toLocaleString() + ' 원';

  // 버튼 기능 연결
  document.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', e => {
      const index = e.target.dataset.index;
      cart[index].quantity++;
      saveAndRender();
    });
  });

  document.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', e => {
      const index = e.target.dataset.index;
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
        saveAndRender();
      }
    });
  });

  document.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', e => {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      saveAndRender();
    });
  });
}

// 저장 후 렌더링
function saveAndRender() {
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// 전체 삭제 버튼
const clearBtn = document.querySelector('#clear-cart');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (confirm('장바구니를 비우시겠습니까?')) {
      cart = [];
      saveAndRender();
    }
  });
}

// 결제 버튼
const checkoutBtn = document.querySelector('#checkout');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('장바구니가 비어 있습니다.');
    } else {
      alert('결제가 완료되었습니다. 감사합니다!');
      cart = [];
      saveAndRender();
    }
  });
}

// 장바구니 페이지일 때 렌더링 실행
if (window.location.pathname.includes('cart.html')) {
  renderCart();
}
