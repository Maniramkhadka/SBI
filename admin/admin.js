const $=id=>document.getElementById(id);let data=null,filter='all';
const demoKey='nm-admin-demo-data'; const configKey='nm-admin-api-url';
let session={username:'',password:'',apiUrl:''};
$('apiUrl').value=localStorage.getItem(configKey)||'';

function status(msg,bad=false){$('status').textContent=msg;$('status').style.background=bad?'#fee2e2':'#f4f4f5'}
function loginStatus(msg,bad=false){$('loginStatus').textContent=msg;$('loginStatus').style.background=bad?'#fee2e2':'#f4f4f5'}

async function login(e){
  e.preventDefault();
  const api=$('loginApiUrl').value.trim().replace(/\/$/,'');
  const username=$('loginUsername').value.trim();
  const password=$('loginPassword').value;
  if(!api||!username||!password) return loginStatus('Admin ID, password र Worker URL सबै चाहिन्छ।',true);
  loginStatus('Checking login…');
  try{
    const r=await fetch(api+'/products',{headers:{'X-Admin-Username':username,'X-Admin-Password':password},cache:'no-store'});
    if(!r.ok){
      if(r.status===401) throw Error('Admin ID वा password गलत छ।');
      throw Error('Worker connection failed ('+r.status+').');
    }
    const loaded=await r.json();
    session={username,password,apiUrl:api};
    $('apiUrl').value=api; $('username').value=username; $('password').value=password;
    localStorage.setItem(configKey,api);
    $('loginScreen').classList.add('hidden'); $('adminApp').classList.remove('hidden');
    data=loaded; render(); fillSettings(); status(`Logged in · Loaded ${data.products.length} products`);
  }catch(err){loginStatus(err.message,true)}
}
$('loginForm').addEventListener('submit',login);

function status(msg,bad=false){$('status').textContent=msg;$('status').style.background=bad?'#fee2e2':'#f4f4f5'}
async function loadData(){try{if($('mode').value==='demo'){const saved=localStorage.getItem(demoKey);data=saved?JSON.parse(saved):await fetch('../data/products.json',{cache:'no-store'}).then(r=>r.json())}else{const u=$('apiUrl').value.replace(/\/$/,'');if(!u)throw Error('Worker API URL चाहिन्छ');const r=await fetch(u+'/products',{headers:{'X-Admin-Username':$('username').value,'X-Admin-Password':$('password').value}});if(!r.ok)throw Error(await r.text());data=await r.json()}render();fillSettings();status(`Loaded ${data.products.length} products`)}catch(e){status(e.message,true)}}
function render(){if(!data)return;const a=[...data.products].filter(p=>filter==='all'||p.category===filter).sort((a,b)=>(a.sort||0)-(b.sort||0));$('rows').innerHTML=a.map(p=>`<tr><td>${esc(p.model)}</td><td>${esc(p.category)}</td><td>${esc(p.price)}</td><td><span class="${p.stock==='in'?'ok':'warn'}" style="padding:5px 8px;border-radius:7px">${p.stock==='in'?'In Stock':'Stock Out'}</span></td><td class="actions"><button class="soft" onclick="editP('${p.id}')">Edit</button><button class="${p.stock==='in'?'warn':'ok'}" onclick="toggleP('${p.id}')">${p.stock==='in'?'Stock Out':'In Stock'}</button><button class="danger" onclick="deleteP('${p.id}')">Delete</button></td></tr>`).join('')}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function fillSettings(){const s=data.settings||{},x=s.socials||{};$('facebook').value=x.facebook||'';$('instagram').value=x.instagram||'';$('tiktok').value=x.tiktok||'';$('whatsapp').value=s.whatsapp||''}
function collectSettings(){data.settings=data.settings||{};data.settings.whatsapp=$('whatsapp').value.trim();data.settings.socials={facebook:$('facebook').value.trim(),instagram:$('instagram').value.trim(),tiktok:$('tiktok').value.trim()}}
$('productForm').onsubmit=e=>{e.preventDefault();if(!data)return status('पहिले data load गर्नुहोस्',true);const id=$('productId').value||('item-'+Date.now());const p={id,category:$('category').value,model:$('model').value.trim(),price:$('price').value.trim(),originalPrice:$('originalPrice').value.trim(),condition:$('condition').value.trim(),badge:$('badge').value.trim(),stock:$('stock').value,sort:Number($('sort').value)||data.products.length+1};const i=data.products.findIndex(x=>x.id===id);if(i>=0)data.products[i]=p;else data.products.push(p);resetForm();render();saveDemo();status('Changes prepared. GitHub mode मा Save all to GitHub थिच्नुहोस्।')}
window.editP=id=>{const p=data.products.find(x=>x.id===id);if(!p)return;$('productId').value=p.id;$('category').value=p.category;$('model').value=p.model;$('price').value=p.price;$('originalPrice').value=p.originalPrice||'';$('condition').value=p.condition||'';$('badge').value=p.badge||'';$('stock').value=p.stock;$('sort').value=p.sort||0;$('formTitle').textContent='Edit Product';$('cancelEdit').classList.remove('hidden');scrollTo({top:0,behavior:'smooth'})}
window.deleteP=id=>{if(!confirm('यो item हटाउने?'))return;data.products=data.products.filter(x=>x.id!==id);render();saveDemo()}
window.toggleP=id=>{const p=data.products.find(x=>x.id===id);if(p){p.stock=p.stock==='in'?'out':'in';render();saveDemo()}}
function resetForm(){$('productForm').reset();$('productId').value='';$('sort').value=0;$('formTitle').textContent='Add Product';$('cancelEdit').classList.add('hidden')}
$('cancelEdit').onclick=resetForm;$('connectBtn').onclick=loadData;$('saveConfigBtn').onclick=()=>{localStorage.setItem(configKey,$('apiUrl').value.trim());status('Worker URL saved in this browser.')};document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;render()});
function saveDemo(){if(data&&$('mode').value==='demo'){collectSettings();localStorage.setItem(demoKey,JSON.stringify(data));}}
$('saveGithub').onclick=async()=>{if(!data)return status('पहिले data load गर्नुहोस्',true);collectSettings();data.updatedAt=new Date().toISOString();if($('mode').value==='demo'){localStorage.setItem(demoKey,JSON.stringify(data));return status('Demo data browser मा saved भयो। GitHub मा होइन।')}try{const u=$('apiUrl').value.replace(/\/$/,'');const r=await fetch(u+'/products',{method:'PUT',headers:{'Content-Type':'application/json','X-Admin-Username':$('username').value,'X-Admin-Password':$('password').value},body:JSON.stringify(data)});const t=await r.text();if(!r.ok)throw Error(t);status('GitHub मा products.json commit भयो। GitHub Pages update भएपछि website मा देखिन्छ।')}catch(e){status(e.message,true)}};
loadData();
$('logoutBtn').onclick=()=>{session={username:'',password:'',apiUrl:''};data=null;$('loginPassword').value='';$('adminApp').classList.add('hidden');$('loginScreen').classList.remove('hidden');loginStatus('Logged out.');};
