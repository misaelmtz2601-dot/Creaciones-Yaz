import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


/* =========================
   FIREBASE
========================= */

const firebaseConfig = {
  apiKey: "AIzaSyCgKmmHr7Dq04c0Fmn1zbjhKzBHSlDdKbc",
  authDomain: "creaciones-yazmin.firebaseapp.com",
  databaseURL: "https://creaciones-yazmin-default-rtdb.firebaseio.com",
  projectId: "creaciones-yazmin",
  storageBucket: "creaciones-yazmin.firebasestorage.app",
  messagingSenderId: "267026301564",
  appId: "1:267026301564:web:70be878b7c000be2087ff9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


/* =========================
   PRODUCTOS
========================= */

const products = [
  {
    name: "Moño Stitch",
    measure: "Medida 10 cm",
    price: 65,
    img: "assets/product-1.jpg",
    cat: "Moños"
  },
  {
    name: "Moño Princesa",
    measure: "Medida 9 cm",
    price: 60,
    img: "assets/product-2.jpg",
    cat: "Moños"
  },
  {
    name: "Moño Hello Kitty",
    measure: "Medida 9 cm",
    price: 60,
    img: "assets/product-3.jpg",
    cat: "Moños"
  },
  {
    name: "Moño Girasol",
    measure: "Medida 10 cm",
    price: 65,
    img: "assets/product-4.jpg",
    cat: "Moños"
  }
];


/* =========================
   CARRITO
========================= */

let cart = [];
let current = 0;
let timer;

const $ = selector => document.querySelector(selector);


function updateCart() {
  const count = cart.reduce((total, item) => total + item.qty, 0);

  const counter = $("#cartCount");

  if (counter) {
    counter.textContent = count;
  }
}


function addToCart(index) {
  const product = products[index];

  const existing = cart.find(item => item.name === product.name);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      ...product,
      qty: 1
    });
  }

  updateCart();

  showModal(
    "Agregado al carrito",
    `${product.name} fue agregado correctamente.`
  );
}


/* =========================
   PRODUCTOS
========================= */

function render(list = products) {

  $("#products").innerHTML = list.map(product => {

    const index = products.indexOf(product);

    return `
      <article class="product">

        <img src="${product.img}" alt="${product.name}">

        <div class="info">

          <div class="name">${product.name}</div>

          <div class="measure">${product.measure}</div>

          <div class="price">$${product.price} MXN</div>

          <button
            class="buy"
            data-buy="${index}"
            aria-label="Agregar ${product.name}">
            🛒
          </button>

        </div>

      </article>
    `;

  }).join("");


  document.querySelectorAll("[data-buy]").forEach(button => {

    button.onclick = () => {

      addToCart(Number(button.dataset.buy));

    };

  });
}


/* =========================
   MODAL
========================= */

function showModal(title, text) {

  $("#modalTitle").textContent = title;

  $("#modalText").textContent = text;

  $("#modalOk").style.display = "block";

  $("#modal").classList.add("show");
}


function closeModal() {

  $("#modal").classList.remove("show");

}


/* =========================
   REGISTRO
========================= */

function showRegister() {

  $("#modalTitle").textContent = "Crear cuenta";

  $("#modalText").innerHTML = `

    <form id="registerForm">

      <input
        id="registerEmail"
        type="email"
        placeholder="Correo electrónico"
        required
        style="
          width:100%;
          box-sizing:border-box;
          padding:14px;
          margin:8px 0;
          border-radius:12px;
          border:1px solid #ddd;
          font-size:16px;
        "
      >

      <input
        id="registerPassword"
        type="password"
        placeholder="Contraseña"
        minlength="6"
        required
        style="
          width:100%;
          box-sizing:border-box;
          padding:14px;
          margin:8px 0;
          border-radius:12px;
          border:1px solid #ddd;
          font-size:16px;
        "
      >

      <input
        id="registerPassword2"
        type="password"
        placeholder="Repite la contraseña"
        minlength="6"
        required
        style="
          width:100%;
          box-sizing:border-box;
          padding:14px;
          margin:8px 0;
          border-radius:12px;
          border:1px solid #ddd;
          font-size:16px;
        "
      >

      <button
        type="submit"
        style="
          width:100%;
          padding:14px;
          margin-top:10px;
          border:0;
          border-radius:14px;
          background:#e98bb8;
          color:white;
          font-size:17px;
          font-weight:bold;
        ">
        Registrarme
      </button>

      <p id="registerError"
         style="color:#d44;margin-top:10px;">
      </p>

    </form>

  `;

  $("#modalOk").style.display = "none";

  $("#modal").classList.add("show");


  $("#registerForm").addEventListener("submit", async event => {

    event.preventDefault();

    const email = $("#registerEmail").value.trim();

    const password = $("#registerPassword").value;

    const password2 = $("#registerPassword2").value;

    const error = $("#registerError");


    if (password !== password2) {

      error.textContent = "Las contraseñas no coinciden.";

      return;

    }


    try {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      closeModal();

      showModal(
        "¡Cuenta creada!",
        "Tu cuenta de Creaciones Yazmin fue creada correctamente."
      );

    } catch (err) {

      error.textContent = firebaseError(err.code);

    }

  });
}


/* =========================
   INICIAR SESIÓN
========================= */

function showLogin() {

  $("#modalTitle").textContent = "Iniciar sesión";

  $("#modalText").innerHTML = `

    <form id="loginForm">

      <input
        id="loginEmail"
        type="email"
        placeholder="Correo electrónico"
        required
        style="
          width:100%;
          box-sizing:border-box;
          padding:14px;
          margin:8px 0;
          border-radius:12px;
          border:1px solid #ddd;
          font-size:16px;
        "
      >

      <input
        id="loginPassword"
        type="password"
        placeholder="Contraseña"
        required
        style="
          width:100%;
          box-sizing:border-box;
          padding:14px;
          margin:8px 0;
          border-radius:12px;
          border:1px solid #ddd;
          font-size:16px;
        "
      >

      <button
        type="submit"
        style="
          width:100%;
          padding:14px;
          margin-top:10px;
          border:0;
          border-radius:14px;
          background:#e98bb8;
          color:white;
          font-size:17px;
          font-weight:bold;
        ">
        Entrar
      </button>

      <p id="loginError"
         style="color:#d44;margin-top:10px;">
      </p>

    </form>

  `;

  $("#modalOk").style.display = "none";

  $("#modal").classList.add("show");


  $("#loginForm").addEventListener("submit", async event => {

    event.preventDefault();

    const email = $("#loginEmail").value.trim();

    const password = $("#loginPassword").value;

    const error = $("#loginError");


    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      closeModal();

      showModal(
        "¡Bienvenido!",
        "Has iniciado sesión correctamente en Creaciones Yazmin."
      );

    } catch (err) {

      error.textContent = firebaseError(err.code);

    }

  });
}


/* =========================
   ERRORES FIREBASE
========================= */

function firebaseError(code) {

  switch (code) {

    case "auth/invalid-email":
      return "El correo electrónico no es válido.";

    case "auth/email-already-in-use":
      return "Ese correo ya tiene una cuenta.";

    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";

    case "auth/invalid-credential":
      return "Correo o contraseña incorrectos.";

    case "auth/user-not-found":
      return "No existe una cuenta con ese correo.";

    case "auth/wrong-password":
      return "La contraseña es incorrecta.";

    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta nuevamente más tarde.";

    default:
      return "Ocurrió un error. Intenta nuevamente.";
  }
}


/* =========================
   CARRITO
========================= */

function showCart() {

  if (cart.length === 0) {

    showModal(
      "Tu carrito",
      "Tu carrito está vacío."
    );

    return;
  }


  let total = 0;

  const html = cart.map(item => {

    const subtotal = item.price * item.qty;

    total += subtotal;

    return `
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin:10px 0;
        padding:10px;
        border-bottom:1px solid #eee;
      ">

        <div>
          <strong>${item.name}</strong><br>
          ${item.qty} × $${item.price}
        </div>

        <strong>$${subtotal} MXN</strong>

      </div>
    `;

  }).join("");


  $("#modalTitle").textContent = "Tu carrito";

  $("#modalText").innerHTML = `

    ${html}

    <div style="
      text-align:right;
      margin-top:15px;
      font-size:20px;
      font-weight:bold;
    ">
      Total: $${total} MXN
    </div>

  `;

  $("#modalOk").style.display = "block";

  $("#modalOk").textContent = "Cerrar";

  $("#modal").classList.add("show");
}


/* =========================
   CARRUSEL
========================= */

function go(n) {

  const slides = document.querySelectorAll(".slide");

  const dots = document.querySelectorAll(".dots button");

  current = (n + slides.length) % slides.length;

  slides.forEach((slide, index) => {

    slide.classList.toggle(
      "active",
      index === current
    );

  });

  dots.forEach((dot, index) => {

    dot.classList.toggle(
      "on",
      index === current
    );

  });
}


function startCarousel() {

  clearInterval(timer);

  timer = setInterval(() => {

    go(current + 1);

  }, 5000);
}


$("#prev").onclick = () => {

  go(current - 1);

  startCarousel();

};


$("#next").onclick = () => {

  go(current + 1);

  startCarousel();

};


document.querySelectorAll(".dots button").forEach((dot, index) => {

  dot.onclick = () => {

    go(index);

    startCarousel();

  };

});


/* =========================
   BÚSQUEDA
========================= */

function searchProducts() {

  const q = $("#search").value
    .trim()
    .toLowerCase();


  if (!q) {

    render(products);

    return;

  }


  const results = products.filter(product => {

    return (
      product.name +
      product.cat +
      product.measure
    )
      .toLowerCase()
      .includes(q);

  });


  render(results);
}


$("#searchBtn").onclick = searchProducts;


$("#search").addEventListener(
  "input",
  searchProducts
);


$("#search").addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {

      searchProducts();

    }

  }
);


/* =========================
   CATEGORÍAS
========================= */

document.querySelectorAll("[data-category]").forEach(button => {

  button.onclick = () => {

    const category = button.dataset.category;

    render(
      products.filter(
        product => product.cat === category
      )
    );

    window.scrollTo({
      top: document.querySelector(".recent").offsetTop - 10,
      behavior: "smooth"
    });

  };

});


/* =========================
   BOTONES PRINCIPALES
========================= */

document.querySelectorAll("[data-action]").forEach(button => {

  button.onclick = () => {

    const action = button.dataset.action;


    if (action === "login") {

      showLogin();

    }


    if (action === "register") {

      showRegister();

    }


    if (action === "cart") {

      showCart();

    }


    if (action === "contact") {

      showModal(
        "Contacto",
        "Aquí conectaremos WhatsApp y los datos de contacto de Creaciones Yazmin."
      );

    }


    if (action === "orders") {

      if (auth.currentUser) {

        showModal(
          "Mis pedidos",
          `Sesión iniciada con ${auth.currentUser.email}. Aquí aparecerán tus pedidos.`
        );

      } else {

        showModal(
          "Mis pedidos",
          "Primero debes iniciar sesión para consultar tus pedidos."
        );

      }

    }

  };

});


/* =========================
   VER TODOS
========================= */

$("#allBtn").onclick = () => {

  $("#search").value = "";

  render(products);

};


/* =========================
   CREA TU MOÑO
========================= */

$("#createBtn").onclick = () => {

  showModal(
    "Crea tu moño",
    "Aquí irá el personalizador para elegir nombre, colores, estilo y detalles de tu moño."
  );

};


/* =========================
   CERRAR MODAL
========================= */

$("#close").onclick = closeModal;


$("#modalOk").onclick = closeModal;


$("#modal").addEventListener("click", event => {

  if (event.target.id === "modal") {

    closeModal();

  }

});


/* =========================
   ESTADO DE SESIÓN
========================= */

onAuthStateChanged(auth, user => {

  if (user) {

    console.log(
      "Usuario conectado:",
      user.email
    );

  } else {

    console.log(
      "No hay usuario conectado"
    );

  }

});


/* =========================
   INICIAR
========================= */

updateCart();

render();

startCarousel();
