const products=[
 {name:"Moño clásico",cat:"Moños",price:89,emoji:"🎀"},
 {name:"Moño escolar",cat:"Escolares",price:75,emoji:"🎀"},
 {name:"Diadema floral",cat:"Diademas",price:129,emoji:"👑"},
 {name:"Moño de temporada",cat:"Temporada",price:99,emoji:"✨"},
 {name:"Moño personalizado",cat:"Moños",price:119,emoji:"🎀"},
 {name:"Diadema Catrina",cat:"Diademas",price:149,emoji:"👑"},
 {name:"Moño escolar premium",cat:"Escolares",price:99,emoji:"🎒"},
 {name:"Especial de temporada",cat:"Temporada",price:139,emoji:"✨"}
];
let cart=0;
const grid=document.getElementById("productGrid");
function render(filter="Todos"){
 grid.innerHTML="";
 products.filter(p=>filter==="Todos"||p.cat===filter).forEach(p=>{
  const el=document.createElement("article");
  el.className="card";
  el.innerHTML=`<div class="pic">${p.emoji}</div><div class="card-body"><h3>${p.name}</h3><p class="price">$${p.price} MXN</p><button>Agregar al carrito</button></div>`;
  el.querySelector("button").onclick=()=>{cart++;document.getElementById("cartCount").textContent=cart};
  grid.appendChild(el);
 });
}
document.querySelectorAll("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{
 const f=btn.dataset.filter; render(f);
 document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===f));
 document.getElementById("productos").scrollIntoView({behavior:"smooth"});
}));
document.getElementById("startCustom").onclick=()=>alert("El configurador de moños se integrará en la siguiente etapa.");
render();
