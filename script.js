import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile
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
   VARIABLES
========================= */

let cart = [];
let current = 0;
let timer;

const $ = selector => document.querySelector(selector);


/* =========================
   CARRITO
========================= */

function updateCart() {

  const count = cart.reduce(
    (total, item) => total + item.qty,
    0
  );

  const counter = $("#cartCount");

  if (counter) {
    counter.textContent = count;
  }
}


function addToCart(index) {

  const product = products[index];

  const existing = cart.find(
    item => item.name === product.name
  );

  if (existing) {

    existing.qty++;

  } else {

    cart.push({
      ...product,
      qty: 1
    });

  }

  updateCart();

  showMessage(
    "Agregado al carrito",
    `${product.name} fue agregado correctamente.`
  );
}


function showCart() {

  if (cart.length === 0) {

    showMessage(
      "Tu carrito",
      "Tu carrito está vacío."
    );

    return;
  }

  let total = 0;

  const items = cart.map(item => {

    const subtotal = item.price * item.qty;

    total += subtotal;

    return `
      <div style="
        padding:10px 0;
        border-bottom:1px solid #eee;
        display:flex;
        justify-content:space-between;
      ">
        <span>
          <strong>${item.name}</strong><br>
          ${item.qty} × $${item.price}
        </span>

        <strong>
          $${subtotal} MXN
        </strong>
      </div>
    `;

  }).join("");

  $("#modalTitle").textContent = "Tu carrito";

  $("#modalText").innerHTML = `
    ${items}

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
   PRODUCTOS
========================= */

function render(list = products) {

  $("#products").innerHTML = list.map(product => {

    const index = products.indexOf(product);

    return `
      <article class="product">

        <img
          src="${product.img}"
          alt="${product.name}"
        >

        <div class="info">

          <div class="name">
            ${product.name}
          </div>

          <div class="measure">
            ${product.measure}
          </div>

          <div class="price">
            $${product.price} MXN
          </div>

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


  document.querySelectorAll("[data-buy]")
    .forEach(button => {

      button.onclick = () => {

        addToCart(
          Number(button.dataset.buy)
        );

      };

    });
}


/* =========================
   MODAL
========================= */

function closeModal() {

  $("#modal").classList.remove("show");

}


function showMessage(title, text) {

  $("#modalTitle").textContent = title;

  $("#modalText").textContent = text;

  $("#modalOk").style.display = "block";
  $("#modalOk").textContent = "Aceptar";

  $("#modal").classList.add("show");
}


/* =========================
   REGISTRO
========================= */

function showRegister() {

  $("#modalTitle").textContent =
    "Crear cuenta";

  $("#modalText").innerHTML = `

    <form id="registerForm">

      <input
        id="registerName"
        type="text"
        placeholder="Tu nombre"
        required
        style="
          width:100%;
          box-sizing:border-box;
          padding:14px;
          margin:7px 0;
          border-radius:12px;
          border:1px solid #ddd;
          font-size:16px;
        "
      >

      <input
        id="registerEmail"
        type="email"
        placeholder="Correo electrónico"
        required
        style="
          width:100%;
          box-sizing:border-box;
          padding:14px;
          margin:7px 0;
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
          margin:7px 0;
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
          margin:7px 0;
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
        "
      >
        Registrarme
      </button>

      <p
        id="registerError"
        style="
          color:#d44;
          margin-top:10px;
        "
      ></p>

    </form>
  `;

  $("#modalOk").style.display = "none";

  $("#modal").classList.add("show");


  $("#registerForm").addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      const name =
        $("#registerName").value.trim();

      const email =
        $("#registerEmail").value.trim();

      const password =
        $("#registerPassword").value;

      const password2 =
        $("#registerPassword2").value;

      const error =
        $("#registerError");


      if (password !== password2) {

        error.textContent =
          "Las contraseñas no coinciden.";

        return;
      }


      try {

        const credential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );


        await updateProfile(
          credential.user,
          {
            displayName: name
          }
        );


        await sendEmailVerification(
          credential.user
        );


        closeModal();


        setTimeout(() => {

          showMessage(
            "¡Cuenta creada!",
            "Tu cuenta fue creada correctamente. Revisa tu correo para verificarla."
          );

        }, 300);

      } catch (err) {

        error.textContent =
          firebaseError(err.code);

      }

    }
  );
}


/* =========================
   INICIAR SESIÓN
========================= */

function showLogin() {

  $("#modalTitle").textContent =
    "Iniciar sesión";

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
          margin:7px 0;
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
          margin:7px 0;
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
        "
      >
        Entrar
      </button>

      <p
        id="loginError"
        style="
          color:#d44;
          margin-top:10px;
        "
      ></p>

    </form>
  `;

  $("#modalOk").style.display = "none";

  $("#modal").classList.add("show");


  $("#loginForm").addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      const email =
        $("#loginEmail").value.trim();

      const password =
        $("#loginPassword").value;

      const error =
        $("#loginError");


      try {

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );


        closeModal();


        setTimeout(() => {

          showMessage(
            "¡Bienvenido!",
            "Has iniciado sesión correctamente."
          );

        }, 300);

      } catch (err) {

        error.textContent =
          firebaseError(err.code);

      }

    }
  );
}


/* =========================
   PERFIL
========================= */

function showProfile() {

  const user = auth.currentUser;

  if (!user) {

    showLogin();

    return;
  }


  const name =
    user.displayName || "Cliente";

  const verified =
    user.emailVerified;


  $("#modalTitle").textContent =
    "Mi perfil";

  $("#modalText").innerHTML = `

    <div style="
      text-align:center;
      padding:10px;
    ">

      <div style="
        width:70px;
        height:70px;
        margin:auto;
        border-radius:50%;
        background:#f5a4ca;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:35px;
      ">
        👤
      </div>

      <h3>
        ${name}
      </h3>

      <p>
        ${user.email}
      </p>

      <p>
        ${
          verified
            ? "Correo verificado ✅"
            : "Correo pendiente de verificar ⚠️"
        }
      </p>

      ${
        !verified
          ? `
            <button
              id="verifyEmail"
              style="
                width:100%;
                padding:13px;
                border:0;
                border-radius:14px;
                background:#e98bb8;
                color:white;
                font-weight:bold;
              "
            >
              Enviar correo de verificación
            </button>
          `
          : ""
      }

    </div>
  `;

  $("#modalOk").style.display = "block";
  $("#modalOk").textContent = "Cerrar";

  $("#modal").classList.add("show");


  const verify =
    $("#verifyEmail");


  if (verify) {

    verify.onclick = async () => {

      try {

        await sendEmailVerification(user);

        showMessage(
          "Correo enviado",
          "Revisa tu correo electrónico y la carpeta de spam."
        );

      } catch (error) {

        showMessage(
          "Aviso",
          "No se pudo enviar el correo en este momento."
        );

      }

    };

  }
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
   CARRUSEL
========================= */

function go(n) {

  const slides =
    document.querySelectorAll(".slide");

  const dots =
    document.querySelectorAll(".dots button");


  current =
    (n + slides.length) % slides.length;


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


document
  .querySelectorAll(".dots button")
  .forEach((dot, index) => {

    dot.onclick = () => {

      go(index);

      startCarousel();

    };

  });


/* =========================
   BÚSQUEDA
========================= */

function searchProducts() {

  const q =
    $("#search").value
      .trim()
      .toLowerCase();


  if (!q) {

    render(products);

    return;
  }


  const results =
    products.filter(product => {

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


$("#searchBtn").onclick =
  searchProducts;


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

document
  .querySelectorAll("[data-category]")
  .forEach(button => {

    button.onclick = () => {

      const category =
        button.dataset.category;


      render(
        products.filter(
          product =>
            product.cat === category
        )
      );


      window.scrollTo({
        top:
          document.querySelector(".recent")
            .offsetTop - 10,
        behavior: "smooth"
      });

    };

  });


/* =========================
   BOTONES
========================= */

document
  .querySelectorAll("[data-action]")
  .forEach(button => {

    button.onclick = () => {

      const action =
        button.dataset.action;


      if (action === "login") {

        showLogin();

      }


      if (action === "register") {

        showRegister();

      }


      if (action === "profile") {

        showProfile();

      }


      if (action === "logout") {

        signOut(auth);

      }


      if (action === "cart") {

        showCart();

      }


      if (action === "contact") {

        showMessage(
          "Contacto",
          "Aquí conectaremos WhatsApp y los datos de contacto de Creaciones Yazmin."
        );

      }


      if (action === "orders") {

        if (auth.currentUser) {

          showMessage(
            "Mis pedidos",
            `Sesión iniciada con ${auth.currentUser.email}. Aquí aparecerán tus pedidos.`
          );

        } else {

          showMessage(
            "Mis pedidos",
            "Primero debes iniciar sesión."
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

  showMessage(
    "Crea tu moño",
    "Aquí irá el personalizador para elegir nombre, colores, estilo y detalles de tu moño."
  );

};


/* =========================
   CERRAR MODAL
========================= */

$("#close").onclick =
  closeModal;


$("#modalOk").onclick =
  closeModal;


$("#modal").addEventListener(
  "click",
  event => {

    if (event.target.id === "modal") {

      closeModal();

    }

  }
);


/* =========================
   ESTADO DE USUARIO
========================= */

onAuthStateChanged(
  auth,
  user => {

    const loginButton =
      document.querySelector(
        '[data-action="login"]'
      );

    const registerButton =
      document.querySelector(
        '[data-action="register"]'
      );


    if (!loginButton ||
        !registerButton) {

      return;
    }


    if (user) {

      loginButton.innerHTML = `
        <span class="ico">👤</span>
        <span>Mi<br>perfil</span>
      `;

      loginButton.dataset.action =
        "profile";


      registerButton.innerHTML = `
        <span class="ico">🚪</span>
        <span>Cerrar<br>sesión</span>
      `;

      registerButton.dataset.action =
        "logout";


      loginButton.onclick =
        showProfile;


      registerButton.onclick =
        async () => {

          await signOut(auth);

          showMessage(
            "Sesión cerrada",
            "Has cerrado sesión correctamente."
          );

        };


    } else {

      loginButton.innerHTML = `
        <span class="ico">♟</span>
        <span>Iniciar<br>sesión</span>
      `;

      loginButton.dataset.action =
        "login";


      registerButton.innerHTML = `
        <span class="ico">♟+</span>
        <span>Registrarse</span>
      `;

      registerButton.dataset.action =
        "register";


      loginButton.onclick =
        showLogin;


      registerButton.onclick =
        showRegister;

    }

  }
);


/* =========================
   INICIAR PÁGINA
========================= */

updateCart();

render();

startCarousel();
