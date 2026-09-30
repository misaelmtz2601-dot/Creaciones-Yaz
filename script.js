const products=[
 {name:'Moño Stitch',measure:'Medida 10 cm',price:65,img:'assets/product-1.jpg',cat:'Moños'},
 {name:'Moño Princesa',measure:'Medida 9 cm',price:60,img:'assets/product-2.jpg',cat:'Moños'},
 {name:'Moño Hello Kitty',measure:'Medida 9 cm',price:60,img:'assets/product-3.jpg',cat:'Moños'},
 {name:'Moño Girasol',measure:'Medida 10 cm',price:65,img:'assets/product-4.jpg',cat:'Moños'}
];
let cart=0, current=0, timer;
const $=s=>document.querySelector(s);
function render(list=products){
 $('#products').innerHTML=list.map((p,i)=>`<article class="product"><img src="${p.img}" alt="${p.name}"><div class="info"><div class="name">${p.name}</div><div class="measure">${p.measure}</div><div class="price">$${p.price} MXN</div><button class="buy" data-buy="${i}" aria-label="Agregar ${p.name}">🛒</button></div></article>`).join('');
 document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{cart++;$('#cartCount').textContent=cart});
}
function showModal(title,text){$('#modalTitle').textContent=title;$('#modalText').textContent=text;$('#modal').classList.add('show')}
function go(n){const slides=document.querySelectorAll('.slide'),dots=document.querySelectorAll('.dots button');current=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle('active',i===current));dots.forEach((d,i)=>d.classList.toggle('on',i===current))}
function start(){clearInterval(timer);timer=setInterval(()=>go(current+1),5000)}
$('#prev').onclick=()=>{go(current-1);start()};$('#next').onclick=()=>{go(current+1);start()};document.querySelectorAll('.dots button').forEach((d,i)=>d.onclick=()=>{go(i);start()});
$('#searchBtn').onclick=()=>{const q=$('#search').value.trim().toLowerCase();render(q?products.filter(p=>(p.name+p.cat+p.measure).toLowerCase().includes(q)):products)};
$('#search').addEventListener('keydown',e=>{if(e.key==='Enter')$('#searchBtn').click()});
document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{render(products.filter(p=>p.cat===b.dataset.category));window.scrollTo({top:document.querySelector('.recent').offsetTop-10,behavior:'smooth'})});
document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{const a=b.dataset.action;if(a==='cart')showModal('Tu carrito',cart?`Tienes ${cart} producto(s) agregado(s).`:'Tu carrito está vacío.');if(a==='login')showModal('Iniciar sesión','Aquí quedará el acceso de clientes cuando conectemos Firebase.');if(a==='register')showModal('Registrarse','Aquí quedará el registro de clientes cuando conectemos Firebase.');if(a==='contact')showModal('Contacto','En esta sección conectaremos WhatsApp y los datos de contacto de Creaciones Yazmin.');if(a==='orders')showModal('Pedidos','Aquí aparecerán los pedidos del cliente.');});
$('#allBtn').onclick=()=>render(products);
$('#createBtn').onclick=()=>showModal('Crea tu moño','Aquí irá el personalizador para elegir nombre, colores, estilo y detalles de tu moño.');
$('#close').onclick=()=>$('#modal').classList.remove('show');$('#modalOk').onclick=()=>$('#modal').classList.remove('show');$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')e.currentTarget.classList.remove('show')});
render();start();
