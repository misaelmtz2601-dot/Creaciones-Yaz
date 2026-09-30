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

function updateCart() {
  const count = cart.reduce((total, product) => total + product.qty, 0);
  $("#cartCount").textContent = count;
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
}

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

function showModal(title, text) {
  $("#modalTitle").textContent = title;
  $("#modalText").textContent = text;
  $("#modal").classList.add("show");
}

function showCart() {
  if (cart.length === 0) {
    showModal("Tu carrito", "Tu carrito está vacío.");
    return;
  }

  let total = 0;

  const details = cart.map(product => {
    const subtotal = product.price * product.qty;
    total += subtotal;

    return `${product.qty} × ${product.name} — $${subtotal} MXN`;
  }).join("\n");

  showModal(
    "Tu carrito",
    `${details}\n\nTotal: $${total} MXN`
  );
}

/* CARRUSEL */

function go(number) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dots button");

  current = (number + slides.length) % slides.length;

  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === current);
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("on", index === current);
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

/* BUSCADOR */

function searchProducts() {
  const query = $("#search").value.trim().toLowerCase();

  if (!query) {
    render(products);
    return;
  }

  const results = products.filter(product => {
    return (
      product.name.toLowerCase().includes(query) ||
      product.cat.toLowerCase().includes(query) ||
      product.measure.toLowerCase().includes(query)
    );
  });

  render(results);
}

$("#searchBtn").onclick = searchProducts;

$("#search").addEventListener("input", searchProducts);

$("#search").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    searchProducts();
  }
});

/* CATEGORÍAS */

document.querySelectorAll("[data-category]").forEach(button => {
  button.onclick = () => {
    const category = button.dataset.category;

    render(
      products.filter(product => product.cat === category)
    );

    window.scrollTo({
      top: document.querySelector(".recent").offsetTop - 10,
      behavior: "smooth"
    });
  };
});

/* BOTONES */

document.querySelectorAll("[data-action]").forEach(button => {
  button.onclick = () => {
    const action = button.dataset.action;

    if (action === "cart") {
      showCart();
    }

    if (action === "login") {
      showModal(
        "Iniciar sesión",
        "Aquí conectaremos el acceso de clientes con Firebase."
      );
    }

    if (action === "register") {
      showModal(
        "Registrarse",
        "Aquí conectaremos el registro de clientes con Firebase."
      );
    }

    if (action === "contact") {
      showModal(
        "Contacto",
        "Aquí conectaremos WhatsApp y los datos de contacto de Creaciones Yazmin."
      );
    }

    if (action === "orders") {
      showModal(
        "Pedidos",
        "Aquí aparecerán los pedidos del cliente."
      );
    }
  };
});

/* VER TODOS */

$("#allBtn").onclick = () => {
  $("#search").value = "";
  render(products);
};

/* CREA TU MOÑO */

$("#createBtn").onclick = () => {
  showModal(
    "Crea tu moño",
    "Aquí irá el personalizador para elegir nombre, colores, estilo y detalles de tu moño."
  );
};

/* MODAL */

$("#close").onclick = () => {
  $("#modal").classList.remove("show");
};

$("#modalOk").onclick = () => {
  $("#modal").classList.remove("show");
};

$("#modal").addEventListener("click", event => {
  if (event.target.id === "modal") {
    event.currentTarget.classList.remove("show");
  }
});

/* INICIO */

updateCart();
render();
startCarousel();
