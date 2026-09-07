(function(){
  const DATA_URL='data/products.json';
  let siteData=null;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function row(p, second){
    const price=p.originalPrice ? `<span class="price-original">${esc(p.originalPrice)}</span> <span class="price-discounted">${esc(p.price)}</span>` : esc(p.price);
    const badge=p.badge ? `<span class="new-label"> ${esc(p.badge)} </span>`:'';
    const btn=p.stock==='out' ? `<button class="stock-out" disabled>Stock Out</button>` : `<button class="buy-button" data-product-id="${esc(p.id)}">Buy Now</button>`;
    return second
      ? `<tr><td>${esc(p.model)}</td><td>${esc(p.condition||'')}</td><td>${price}</td><td>${btn}</td></tr>`
      : `<tr><td>${esc(p.model)}${badge}</td><td>${price}</td><td>${btn}</td></tr>`;
  }
  function renderProducts(){
    const items=[...(siteData.products||[])].sort((a,b)=>(a.sort||0)-(b.sort||0));
    const n=document.getElementById('newPhoneRows'), s=document.getElementById('secondHandRows');
    if(n) n.innerHTML=items.filter(x=>x.category==='new').map(x=>row(x,false)).join('');
    if(s) s.innerHTML=items.filter(x=>x.category==='second-hand').map(x=>row(x,true)).join('');
  }
  function order(p){
    const type=p.category==='second-hand'?'Second Hand':'New';
    let msg='नमस्कार! Apple Store | National Mobile बाट iPhone किन्न चाहन्छु।\n\n';
    msg+=`📱 Model: ${p.model} (${type})\n`;
    if(p.condition) msg+=`🔍 Condition: ${p.condition}\n`;
    msg+=`💰 Price: ${p.price}\n\nकृपया उपलब्धता, रंग, वारेन्टी र डेलिभरीबारे जानकारी दिनुहोस्।\n\nधन्यवाद!`;
    window.open(`https://wa.me/${siteData.settings.whatsapp}?text=${encodeURIComponent(msg)}`,'_blank','noopener');
  }
  function renderSocial(){
    const x=siteData.settings?.socials||{};
    const set=(id,url)=>{const a=document.getElementById(id);if(a)a.href=url||'#'};
    set('nmFacebookLink',x.facebook);set('nmInstagramLink',x.instagram);set('nmTikTokLink',x.tiktok);set('nmXLink',x.x);
    const fb=document.getElementById('nmFacebookEmbed');
    if(fb&&x.facebook) fb.src='https://www.facebook.com/plugins/page.php?href='+encodeURIComponent(x.facebook)+'&tabs=timeline&width=500&height=420&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false';
    const tt=document.getElementById('nmTikTokEmbed');
    if(tt&&x.tiktok){ const user=(x.tiktok.match(/@([^/?]+)/)||[])[1]||'nationalmobile07'; tt.innerHTML=`<blockquote class="tiktok-embed" cite="${esc(x.tiktok)}" data-unique-id="${esc(user)}" data-embed-type="creator"><section><a target="_blank" href="${esc(x.tiktok)}">@${esc(user)}</a></section></blockquote>`; loadScript('https://www.tiktok.com/embed.js','nm-tiktok-script'); }
    const xe=document.getElementById('nmXEmbed');
    if(xe&&x.x){ xe.innerHTML=`<a class="twitter-timeline" data-height="420" data-theme="dark" data-chrome="nofooter noborders" href="${esc(x.x)}">Posts by National Mobile</a>`; loadScript('https://platform.twitter.com/widgets.js','nm-x-script'); }
  }
  function loadScript(src,id){ if(document.getElementById(id)) return; const s=document.createElement('script');s.id=id;s.async=true;s.src=src;document.body.appendChild(s); }
  document.addEventListener('click',e=>{ const b=e.target.closest('.buy-button[data-product-id]'); if(!b||!siteData)return; const p=siteData.products.find(x=>x.id===b.dataset.productId); if(p)order(p); });
  fetch(DATA_URL,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(d=>{siteData=d;renderProducts();renderSocial()}).catch(err=>console.error('Could not load product data:',err));
})();
