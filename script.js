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

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


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
const db = getFirestore(app);


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

  if ($("#cartCount")) {
    $("#cartCount").textContent = count;
  }

  localStorage.setItem(
    "creacionesYazminCart",
    JSON.stringify(cart)
  );
}


function loadCart() {

  try {

    const saved = JSON.parse(
      localStorage.getItem("creacionesYazminCart") || "[]"
    );

    if (Array.isArray(saved)) {
      cart = saved;
    }

  } catch {

    cart = [];

  }

  updateCart();
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

    <button
      id="placeOrder"
      style="
        width:100%;
        padding:14px;
        margin-top:15px;
        border:0;
        border-radius:14px;
        background:#e98bb8;
        color:white;
        font-size:17px;
        font-weight:bold;
      "
    >
      Realizar pedido
    </button>
  `;

  $("#modalOk").style.display = "block";
  $("#modalOk").textContent = "Cerrar";

  $("#modal").classList.add("show");

  $("#placeOrder").onclick = createOrder;
}


/* =========================
   PERFIL FIRESTORE
========================= */

async function saveProfile(data) {

  const user = auth.currentUser;

  if (!user) return;

  await setDoc(
    doc(db, "clientes", user.uid),
    {
      nombre: data.nombre || "",
      email: user.email || "",
      telefono: data.telefono || "",
      direccion: data.direccion || "",
      actualizado: serverTimestamp()
    },
    { merge: true }
  );
}


async function getProfile() {

  const user = auth.currentUser;

  if (!user) return null;

  const result = await getDoc(
    doc(db, "clientes", user.uid)
  );

  if (result.exists()) {
    return result.data();
  }

  return {
    nombre: user.displayName || "",
    email: user.email || "",
    telefono: "",
    direccion: ""
  };
}


/* =========================
   PEDIDO
========================= */

async function createOrder() {

  const user = auth.currentUser;

  if (!user) {

    showMessage(
      "Inicia sesión",
      "Primero debes iniciar sesión para realizar un pedido."
    );

    return;
  }

  if (cart.length === 0) {

    showMessage(
      "Carrito vacío",
      "Agrega productos antes de realizar el pedido."
    );

    return;
  }

  try {

    const total = cart.reduce(
      (sum, item) =>
        sum + (item.price * item.qty),
      0
    );


    await addDoc(
      collection(db, "pedidos"),
      {
        clienteId: user.uid,
        clienteEmail: user.email || "",
        clienteNombre: user.displayName || "",
        productos: cart,
        total: total,
        estado: "Pendiente",
        fecha: serverTimestamp()
      }
    );


    cart = [];

    updateCart();


    showMessage(
      "¡Pedido recibido!",
      "Tu pedido fue guardado correctamente."
    );

  } catch (error) {

    console.error(error);

    showMessage(
      "Error",
      "No se pudo guardar el pedido."
    );
  }
}


/* =========================
   MIS PEDIDOS
========================= */

async function showOrders() {

  const user = auth.currentUser;

  if (!user) {

    showMessage(
      "Mis pedidos",
      "Primero debes iniciar sesión."
    );

    return;
  }


  $("#modalTitle").textContent =
    "Mis pedidos";

  $("#modalText").innerHTML =
    "<p>Cargando pedidos...</p>";

  $("#modalOk").style.display = "block";
  $("#modalOk").textContent = "Cerrar";

  $("#modal").classList.add("show");


  try {

    const q = query(
      collection(db, "pedidos"),
      where("clienteId", "==", user.uid)
    );


    const result = await getDocs(q);


    if (result.empty) {

      $("#modalText").innerHTML =
        "<p>Aún no tienes pedidos.</p>";

      return;
    }


    let html = "";


    result.forEach(order => {

      const data = order.data();


      let productsHtml = "";

      (data.productos || []).forEach(product => {

        productsHtml += `
          ${product.qty} × ${product.name}<br>
        `;

      });


      let date = "";

      if (data.fecha && data.fecha.toDate) {

        date =
          data.fecha
            .toDate()
            .toLocaleString("es-MX");

      }


      html += `

        <div style="
          padding:12px 0;
          border-bottom:1px solid #eee;
        ">

          <strong>Pedido</strong>

          <br><br>

          ${productsHtml}

          <strong>
            Total: $${data.total || 0} MXN
          </strong>

          <br>

          Estado:
          ${data.estado || "Pendiente"}

          <br>

          <small>
            ${date}
          </small>

        </div>

      `;
    });


    $("#modalText").innerHTML = html;


  } catch (error) {

    console.error(error);

    $("#modalText").innerHTML =
      "<p>No se pudieron cargar los pedidos.</p>";
  }
}


/* =========================
   PRODUCTOS
========================= */

function render(list = products) {

  $("#products").innerHTML =
    list.map(product => {

      const index =
        products.indexOf(product);


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
            >
              🛒
            </button>

          </div>

        </article>

      `;

    }).join("");


  document
    .querySelectorAll("[data-buy]")
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
      >

      <input
        id="registerEmail"
        type="email"
        placeholder="Correo electrónico"
        required
      >

      <input
        id="registerPassword"
        type="password"
        placeholder="Contraseña"
        minlength="6"
        required
      >

      <input
        id="registerPassword2"
        type="password"
        placeholder="Repite la contraseña"
        minlength="6"
        required
      >

      <button type="submit">
        Registrarme
      </button>

      <p id="registerError"></p>

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


        await saveProfile({
          nombre: name,
          telefono: "",
          direccion: ""
        });


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


      } catch (errorFirebase) {

        error.textContent =
          firebaseError(
            errorFirebase.code
          );

      }

    }
  );
}


/* =========================
   LOGIN
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
      >

      <input
        id="loginPassword"
        type="password"
        placeholder="Contraseña"
        required
      >

      <button type="submit">
        Entrar
      </button>

      <p id="loginError"></p>

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


      } catch (firebaseErrorValue) {

        error.textContent =
          firebaseError(
            firebaseErrorValue.code
          );

      }

    }
  );
}


/* =========================
   PERFIL
========================= */

async function showProfile() {

  const user = auth.currentUser;

  if (!user) {

    showLogin();

    return;
  }


  $("#modalTitle").textContent =
    "Mi perfil";

  $("#modalText").innerHTML =
    "<p>Cargando perfil...</p>";

  $("#modalOk").style.display = "block";

  $("#modalOk").textContent = "Cerrar";

  $("#modal").classList.add("show");


  try {

    const profile =
      await getProfile();


    $("#modalText").innerHTML = `

      <form id="profileForm">

        <input
          id="profileName"
          type="text"
          placeholder="Nombre"
          value="${profile.nombre || ""}"
          required
        >

        <input
          type="email"
          value="${user.email || ""}"
          disabled
        >

        <input
          id="profilePhone"
          type="tel"
          placeholder="Teléfono"
          value="${profile.telefono || ""}"
        >

        <textarea
          id="profileAddress"
          placeholder="Dirección de entrega"
          rows="3"
        >${profile.direccion || ""}</textarea>


        <p>
          ${
            user.emailVerified
              ? "Correo verificado ✅"
              : "Correo pendiente de verificar ⚠️"
          }
        </p>


        <button type="submit">
          Guardar datos
        </button>


        ${
          !user.emailVerified
            ? `
              <button
                type="button"
                id="verifyEmail"
              >
                Enviar correo de verificación
              </button>
            `
            : ""
        }


        <p id="profileMessage"></p>

      </form>

    `;


    $("#profileForm").addEventListener(
      "submit",
      async event => {

        event.preventDefault();


        const nombre =
          $("#profileName").value.trim();

        const telefono =
          $("#profilePhone").value.trim();

        const direccion =
          $("#profileAddress").value.trim();


        try {

          await updateProfile(
            user,
            {
              displayName: nombre
            }
          );


          await saveProfile({
            nombre,
            telefono,
            direccion
          });


          $("#profileMessage").textContent =
            "Datos guardados correctamente ✅";


        } catch (error) {

          console.error(error);

          $("#profileMessage").textContent =
            "No se pudieron guardar los datos.";

        }

      }
    );


    const verify =
      $("#verifyEmail");


    if (verify) {

      verify.onclick = async () => {

        await sendEmailVerification(user);

        showMessage(
          "Correo enviado",
          "Revisa tu correo y la carpeta de spam."
        );

      };

    }


  } catch (error) {

    console.error(error);

    showMessage(
      "Aviso",
      "No se pudo cargar el perfil."
    );

  }
}


/* =========================
   ERRORES
========================= */

function firebaseError(code) {

  switch (code) {

    case "auth/invalid-email":
      return "El correo no es válido.";

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
    (n + slides.length) %
    slides.length;


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

  timer = setInterval(
    () => go(current + 1),
    5000
  );

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


  render(
    products.filter(product =>
      (
        product.name +
        product.cat +
        product.measure
      )
        .toLowerCase()
        .includes(q)
    )
  );

}


$("#searchBtn").onclick =
  searchProducts;


$("#search").addEventListener(
  "input",
  searchProducts
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


      if (action === "login")
        showLogin();

      if (action === "register")
        showRegister();

      if (action === "profile")
        showProfile();

      if (action === "logout")
        signOut(auth);

      if (action === "cart")
        showCart();

      if (action === "orders")
        showOrders();

      if (action === "contact") {

        showMessage(
          "Contacto",
          "Aquí conectaremos WhatsApp y los datos de contacto de Creaciones Yazmin."
        );

      }

    };

  });


/* =========================
   OTROS BOTONES
========================= */

$("#allBtn").onclick = () => {

  $("#search").value = "";

  render(products);

};


$("#createBtn").onclick = () => {

  showMessage(
    "Crea tu moño",
    "Aquí irá el personalizador para elegir nombre, colores, estilo y detalles de tu moño."
  );

};


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
   SESIÓN
========================= */

onAuthStateChanged(
  auth,
  user => {

    const loginButton =
      document.querySelector(
        '[data-action="login"], [data-action="profile"]'
      );

    const registerButton =
      document.querySelector(
        '[data-action="register"], [data-action="logout"]'
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
   INICIAR
========================= */

loadCart();

render();

startCarousel();

/* =========================
   PROTECCIÓN DE IMÁGENES
========================= */

// Evitar menú contextual sobre imágenes
document.addEventListener("contextmenu", event => {
  if (event.target.tagName === "IMG") {
    event.preventDefault();
  }
});

// Evitar arrastrar imágenes
document.addEventListener("dragstart", event => {
  if (event.target.tagName === "IMG") {
    event.preventDefault();
  }
});

// Evitar selección de imágenes
document.addEventListener("selectstart", event => {
  if (event.target.tagName === "IMG") {
    event.preventDefault();
  }
});

// Evitar guardar imágenes mediante algunas acciones del navegador
document.querySelectorAll("img").forEach(img => {
  img.setAttribute("draggable", "false");
  img.setAttribute("oncontextmenu", "return false");
});

// Protección adicional con teclado
document.addEventListener("keydown", event => {

  // Ctrl + S
  if (event.ctrlKey && event.key.toLowerCase() === "s") {
    event.preventDefault();
  }

  // Ctrl + U
  if (event.ctrlKey && event.key.toLowerCase() === "u") {
    event.preventDefault();
  }

  // Ctrl + Shift + I
  if (
    event.ctrlKey &&
    event.shiftKey &&
    event.key.toLowerCase() === "i"
  ) {
    event.preventDefault();
  }

});
