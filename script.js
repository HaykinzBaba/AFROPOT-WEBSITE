// ===================== AFROPOT GLOBAL SCRIPT =====================

// ===== DYNAMIC NAVBAR + FOOTER (AUTO YEAR) =====
window.addEventListener("DOMContentLoaded", () => {
  const currentYear = new Date().getFullYear();

  // ✅ Navbar HTML (uniform across all pages)
  const navbarHTML = `
  <header class="navbar">
    <h1 class="logo">Afropot</h1>
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="menu.html">Menu</a></li>
      <li><a href="catering.html">Catering</a></li>
      <li><a href="giftcard.html">Gift Card</a></li>
      <li><a href="faq.html">FAQ</a></li>
      <li><a href="delivery.html">Delivery</a></li>
      <li><a href="checkout.html">Checkout</a></li>
      <li><a href="myorders.html">My Orders</a></li>
    </ul>
  </header>
  `;

  // ✅ Footer HTML (auto-updating year)
  const footerHTML = `
  <footer>
    <p>© ${currentYear} Afropot | Nigerian Food Ordering & Delivery Platform | All Rights Reserved.</p>
  </footer>
  `;

  // Inject Navbar
  const navbarContainer = document.getElementById("navbar");
  if (navbarContainer) navbarContainer.innerHTML = navbarHTML;

  // Inject Footer
  const footerContainer = document.getElementById("footer");
  if (footerContainer) footerContainer.innerHTML = footerHTML;

  // Highlight active page link
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === currentPage ||
      (currentPage === "" && link.getAttribute("href") === "index.html")
    );
  });
});

// ===== MENU ITEMS DATA =====
const mainDishes = [
  { name: "Jollof Rice with Fried Chicken", price: 12.5, img: "images/jollof_rice_with_fried_chicken.png" },
  { name: "Egusi Soup with Fufu", price: 14, img: "images/egusi_soup_with_fufu.png" },
  { name: "Eba with Okro Soup", price: 13, img: "images/eba_with_okro_soup.png" },
  { name: "Fried Rice with Spicy Fried Fish", price: 13.5, img: "images/fried_rice_with_spicy_friedfish.png" },
  { name: "Omotuo Groundnut Soup", price: 14, img: "images/omotuo_groundnut_soup(goat_smoked_salmon_tuna).png" },
  { name: "Moi Moi", price: 8, img: "images/moi_moi.png" },
  { name: "Chicken Soup", price: 10, img: "images/chicken_soup.png" },
  { name: "Rice with Ayamase Stew", price: 12, img: "images/rice_with_ayamase_stew.png" },
  { name: "Plain Rice", price: 7.5, img: "images/plain_rice.png" },
  { name: "Spaghetti Bolognese", price: 11, img: "images/spaghetti_bolognese.png" },
  { name: "Suya Spicy Grilled Meat", price: 9.5, img: "images/suya_spicy_grilled_meat.png" }
];

const drinks = [
  { name: "Malta Guinness", price: 3, img: "images/malta_guinness.png" },
  { name: "Coca-Cola 0.5L", price: 2.5, img: "images/can_coke_0.5ltrs.png" },
  { name: "Coca-Cola 1.5L", price: 3, img: "images/coke_1.5Ltr.png" },
  { name: "Fanta", price: 2.5, img: "images/fanta.png" },
  { name: "Sprite 0.5L", price: 2.5, img: "images/sprite_0.5Ltrs.png" },
  { name: "Alvaro", price: 2.8, img: "images/alvaro.png" },
  { name: "Ceres Juice", price: 3, img: "images/ceres.png" },
  { name: "Vita Milk", price: 3, img: "images/vita_milk.png" },
  { name: "Don Simon", price: 3.5, img: "images/don_simon.png" }
];

// ===== RENDER MENU =====
function renderMenu(items, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-card";
    card.dataset.name = item.name;
    card.dataset.price = item.price;
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}" onerror="this.src='images/fallback.png'">
      <h3>${item.name}</h3>
      <p class="price">€${item.price.toFixed(2)}</p>
      <button class="add-btn">Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

if (window.location.pathname.includes("menu.html")) {
  renderMenu(mainDishes, "mainDishes");
  renderMenu(drinks, "drinks");
}

// ===== CART SYSTEM =====
const cartKey = "afropotCart";
const cartCount = document.getElementById("cartCount");

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function addToCart(name, price) {
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const existing = cart.find(i => i.name === name);
  if (existing) existing.qty++;
  else cart.push({ name, price, qty: 1 });
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
  alert(`✅ ${name} added to cart!`);
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("add-btn")) {
    const card = e.target.closest(".menu-card");
    addToCart(card.dataset.name, parseFloat(card.dataset.price));
  }
});
updateCartCount();

// ===== CHECKOUT PAGE: PAY ON DELIVERY (Fallback for Non-Stripe) =====
if (window.location.pathname.includes("checkout.html")) {
  const orderTable = document.getElementById("orderItems");
  const totalDisplay = document.getElementById("orderTotal");
  const confirmBtn = document.getElementById("confirmOrder");
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  if (orderTable && totalDisplay) {
    let total = 0;
    orderTable.innerHTML = "";
    cart.forEach(item => {
      total += item.price * item.qty;
      orderTable.innerHTML += `
        <tr>
          <td>${item.name}</td>
          <td>${item.qty}</td>
          <td>€${(item.price * item.qty).toFixed(2)}</td>
        </tr>
      `;
    });
    totalDisplay.textContent = `Total: €${total.toFixed(2)}`;
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (!cart.length) return alert("⚠️ Your cart is empty!");
      alert("✅ Order confirmed! You will pay on delivery.");

      const order = {
        orderId: "#AFR" + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toLocaleString(),
        total: cart.reduce((sum, i) => sum + i.price * i.qty, 0),
        payment: "Pay on Delivery",
        status: "Preparing",
        items: cart
      };
      const allOrders = JSON.parse(localStorage.getItem("afropotAllOrders")) || [];
      allOrders.push(order);
      localStorage.setItem("afropotAllOrders", JSON.stringify(allOrders));
      localStorage.removeItem(cartKey);
      window.location.href = "delivery.html";
    });
  }
}

// ===== STRIPE PAYMENT (for Secure Card Checkout) =====
if (window.location.pathname.includes("checkout.html")) {
  const stripeBtn = document.getElementById("payButton");
  if (stripeBtn) {
    const stripe = Stripe("pk_test_51SSozmAi0kLeGO9eT7PNfKYq8WD5pFQa7RvxWpyGBNWtljSRb7PPXCCv1mdaOfosDyDC4dcLQKR7qDn6mcPpSpfT00tRZOtPJQ");

    stripeBtn.addEventListener("click", async () => {
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      const amount = cart.reduce((sum, i) => sum + i.price * i.qty, 0) * 100;

      if (!cart.length) return alert("⚠️ Please add items to your cart first.");

      try {
        const response = await fetch("http://localhost:4242/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount })
        });
        const session = await response.json();
        await stripe.redirectToCheckout({ sessionId: session.id });
      } catch (error) {
        alert("⚠️ Payment error. Please try again later.");
        console.error(error);
      }
    });
  }
}

// ===== FLOATING BUTTONS (WHATSAPP + CHATBOT) =====
function initFloatingButtons() {
  if (document.querySelector(".whatsapp-float") || document.querySelector(".chatbot-float")) return;

  const whatsapp = document.createElement("a");
  whatsapp.href = "https://wa.me/233556908606";
  whatsapp.target = "_blank";
  whatsapp.className = "floating-btn whatsapp-float";
  whatsapp.innerHTML = '<i class="fab fa-whatsapp"></i>';
  document.body.appendChild(whatsapp);

  const bot = document.createElement("div");
  bot.className = "floating-btn chatbot-float";
  bot.innerHTML = '<i class="fas fa-robot"></i>';
  document.body.appendChild(bot);

  const popup = document.createElement("div");
  popup.className = "chatbot-popup";
  popup.innerHTML = `
    <div class="chatbot-header">
      Afropot Assistant 🤖
      <span id="closeChat" style="cursor:pointer;">✖</span>
    </div>
    <div class="chatbot-body" id="chatMessages">
      <p><strong>Afropot Bot:</strong> 👋 Hi! Welcome to Afropot 🍲</p>
      <p>Would you like to view our <a href="menu.html">menu</a> or <a href="myorders.html">order history</a>?</p>
    </div>
    <div class="chatbot-input">
      <input type="text" id="userMessage" placeholder="Type a message..." />
      <button id="sendMsg">Send</button>
    </div>
  `;
  document.body.appendChild(popup);

  bot.addEventListener("click", () => (popup.style.display = "flex"));
  popup.querySelector("#closeChat").addEventListener("click", () => (popup.style.display = "none"));

  const input = popup.querySelector("#userMessage");
  const messages = popup.querySelector("#chatMessages");
  const sendBtn = popup.querySelector("#sendMsg");

  function botReply(text) {
    messages.innerHTML += `<p><strong>Afropot Bot:</strong> ${text}</p>`;
    messages.scrollTop = messages.scrollHeight;
  }

  function sendMessage() {
    const msg = input.value.trim();
    if (!msg) return;
    messages.innerHTML += `<p><strong>You:</strong> ${msg}</p>`;
    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    const lower = msg.toLowerCase();
    const reply = lower.includes("menu")
      ? "🍛 Check out our delicious menu <a href='menu.html'>here</a>!"
      : lower.includes("order")
      ? "📦 Track your orders <a href='myorders.html'>here</a>!"
      : lower.includes("hello")
      ? "👋 Hello there! How can I assist you today?"
      : lower.includes("thank")
      ? "💚 You're welcome! Enjoy your meal!"
      : "You can say 'menu', 'orders', or 'help' for options.";

    setTimeout(() => botReply(reply), 1000);
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", e => e.key === "Enter" && sendMessage());
}
window.addEventListener("load", initFloatingButtons);

// ===== MAP OPTIMISATION =====
window.addEventListener("load", () => {
  document.querySelectorAll("iframe[src*='google.com/maps']").forEach(iframe => {
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
  });
});
