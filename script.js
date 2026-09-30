const products=[
 {name:"Moño Stitch",meta:"Medida 10 cm",price:65,emoji:"🎀"},
 {name:"Moño Princesa",meta:"Medida 9 cm",price:60,emoji:"🎀"},
 {name:"Moño Hello Kitty",meta:"Medida 9 cm",price:60,emoji:"🎀"},
 {name:"Moño Girasol",meta:"Medida 10 cm",price:65,emoji:"🎀"}
];
let cart=0, current=0, timer;
const grid=document.getElementById("productGrid"), toast=document.getElementById("toast");
function showToast(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove("show"),1800)}
function updateCart(){document.getElementById("cartCountTop").textContent=cart;document.getElementById("cartCountBottom").textContent=cart}
function render(list=products){
 grid.innerHTML=list.map((p,i)=>`<article class="product"><div class="product-img">${p.emoji}</div><div class="product-info"><h3>${p.name}</h3><p>${p.meta}</p><p class="price">$${p.price} MXN</p><button class="buy" data-i="${i}" aria-label="Agregar ${p.name}">🛒</button></div></article>`).join("");
 grid.querySelectorAll(".buy").forEach(btn=>btn.onclick=()=>{cart++;updateCart();showToast("Producto agregado al carrito ♥")});
}
function setupCarousel(){
 const slides=[...document.querySelectorAll(".slide")], dots=document.getElementById("dots");
 dots.innerHTML=slides.map((_,i)=>`<button class="dot ${i===0?"active":""}" aria-label="Imagen ${i+1}"></button>`).join("");
 const set=i=>{current=(i+slides.length)%slides.length;slides.forEach((s,n)=>s.classList.toggle("active",n===current));dots.querySelectorAll(".dot").forEach((d,n)=>d.classList.toggle("active",n===current))};
 dots.querySelectorAll(".dot").forEach((d,i)=>d.onclick=()=>{set(i);restart()});
 document.getElementById("prev").onclick=()=>{set(current-1);restart()};
 document.getElementById("next").onclick=()=>{set(current+1);restart()};
 const restart=()=>{clearInterval(timer);timer=setInterval(()=>set(current+1),5000)};
 restart();
}
document.getElementById("searchForm").onsubmit=e=>{e.preventDefault();const q=document.getElementById("searchInput").value.trim().toLowerCase();render(q?products.filter(p=>p.name.toLowerCase().includes(q)||p.meta.toLowerCase().includes(q)):products)};
document.getElementById("customBtn").onclick=()=>showToast("Aquí construiremos el configurador real de tu moño.");
document.getElementById("cartTop").onclick=()=>showToast(`Tu carrito tiene ${cart} producto${cart===1?"":"s"}.`);
document.getElementById("cartBottom").onclick=()=>showToast(`Tu carrito tiene ${cart} producto${cart===1?"":"s"}.`);
document.getElementById("menuMobile").onclick=()=>window.scrollTo({top:0,behavior:"smooth"});
render();setupCarousel();
