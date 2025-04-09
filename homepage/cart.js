// main.js

// 장바구니 상태 저장용
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 카트에 책 추가하는 함수
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

// 책 요소에 이벤트 바인딩
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

// 카트 페이지 렌더링 함수
function renderCart() {
  const container = document.querySelector('#cart-container');
  const totalDisplay = document.querySelector('#total-price');
  if (!container) return;
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

  // 총 가격 업데이트
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  totalDisplay.textContent = total.toLocaleString() + ' 원';

  


  // 버튼 이벤트 연결
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
      if (cart[index].quantity > 1) cart[index].quantity--;
      saveAndRender();
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

function saveAndRender() {
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// 전체 삭제 버튼 처리
const clearBtn = document.querySelector('#clear-cart');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (confirm('장바구니를 비우시겠습니까?')) {
      cart = [];
      saveAndRender();
    }
  });
}

// 결제 버튼 처리
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

// 카트 페이지인 경우 렌더링 실행
if (window.location.pathname.includes('cart.html')) {
  renderCart();
}

// cart.js
window.addEventListener('DOMContentLoaded', () => {
    const cartList = document.getElementById('cart-list');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    if (cart.length === 0) {
      cartList.innerHTML = '<p>장바구니가 비어 있습니다.</p>';
      return;
    }
  
    cart.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.img}" alt="${item.title}" width="80">
        <div>
          <p><strong>${item.title}</strong></p>
          <p>$${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
          <button onclick="changeQty(${index}, 1)">+</button>
          <button onclick="changeQty(${index}, -1)">-</button>
          <button onclick="removeItem(${index})">삭제</button>
        </div>
      `;
      cartList.appendChild(div);
    });
  
    updateTotal();
  });
  
  function changeQty(index, delta) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
  }
  
  function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
  }
  
  function updateTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    document.getElementById('total').innerText = `총 합계: $${total.toFixed(2)}`;
  }
  
  function clearCart() {
    localStorage.removeItem('cart');
    location.reload();
  }
  