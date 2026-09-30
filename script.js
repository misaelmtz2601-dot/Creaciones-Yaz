const slides=[...document.querySelectorAll(".slide")],dots=document.getElementById("dots");let n=0,cart=0,timer;
dots.innerHTML=slides.map((_,i)=>`<button class="dot ${i===0?"active":""}"></button>`).join("");
function show(i){n=(i+slides.length)%slides.length;slides.forEach((s,k)=>s.classList.toggle("active",k===n));document.querySelectorAll(".dot").forEach((d,k)=>d.classList.toggle("active",k===n))}
function restart(){clearInterval(timer);timer=setInterval(()=>show(n+1),5000)}
document.getElementById("prev").onclick=()=>{show(n-1);restart()};document.getElementById("next").onclick=()=>{show(n+1);restart()};
document.querySelectorAll(".dot").forEach((d,i)=>d.onclick=()=>{show(i);restart()});restart();
function add(){cart++;document.getElementById("cartTop").textContent=cart;document.getElementById("cartBottom").textContent=cart}
document.querySelectorAll(".add").forEach(b=>b.onclick=add);
document.getElementById("cartBtn").onclick=()=>alert("Carrito: "+cart+" producto(s)");
document.getElementById("cartMobile").onclick=()=>alert("Carrito: "+cart+" producto(s)");
document.getElementById("searchForm").onsubmit=e=>{e.preventDefault();alert("Buscando: "+document.getElementById("search").value)};