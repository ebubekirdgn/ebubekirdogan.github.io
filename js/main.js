async function fetchJSON(url){const res=await fetch(url);if(!res.ok)throw new Error(res.statusText);return res.json()}

function el(q){return document.querySelector(q)}

// Theme toggle: stores preference in localStorage and applies data-theme="light" for light mode
const THEME_KEY = 'theme_pref';
function applyTheme(theme){
  if(theme === 'light'){
    document.documentElement.setAttribute('data-theme','light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}
function initThemeToggle(){
  const saved = localStorage.getItem(THEME_KEY);
  // Determine initial theme: saved > prefers-color-scheme > time-based
  if(saved){ applyTheme(saved); }
  else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){ applyTheme('light'); }
  else {
    const h = new Date().getHours();
    const isDay = h >= 7 && h < 19;
    applyTheme(isDay ? 'light' : 'dark');
  }

  const sunSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10-9h2V1h-2v3zm7.45 1.46l1.79-1.8-1.41-1.41-1.8 1.79 1.42 1.42zM17.24 19.16l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM20 11v2h3v-2h-3zM12 6a6 6 0 100 12 6 6 0 000-12zM6.76 19.16l-1.42-1.42-1.79 1.8 1.41 1.41 1.8-1.79zM11 23h2v-3h-2v3z" fill="currentColor"/></svg>';
  const moonSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg>';

  const btns = document.querySelectorAll('.theme-toggle');
  btns.forEach(btn=>{
    // Ensure button has role and initial icon
    btn.setAttribute('role','switch');
    const updateBtn = ()=>{
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      btn.innerHTML = isLight ? sunSvg : moonSvg;
      btn.setAttribute('aria-checked', String(isLight));
    };

    // animate icon on click
    btn.addEventListener('click', ()=>{
      btn.classList.add('anim');
      setTimeout(()=>btn.classList.remove('anim'), 380);

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      applyTheme(next === 'light' ? 'light' : 'dark');
      localStorage.setItem(THEME_KEY, next === 'light' ? 'light' : 'dark');
      updateBtn();
    });

    updateBtn();
  });
}

async function loadGitHub(){try{const user=await fetchJSON('https://api.github.com/users/ebubekirdgn');el('#gh-name').textContent=user.name||user.login;el('#gh-bio').textContent=user.bio||'';el('#gh-follow').href=user.html_url;const img=document.createElement('img');img.src=user.avatar_url;img.alt=user.login;const wrap=el('#gh-profile');const ph=wrap.querySelector('.avatar-placeholder');if(ph)ph.replaceWith(img);
  // repos
  const repos=await fetchJSON('https://api.github.com/users/ebubekirdgn/repos?sort=updated&per_page=6');const reposWrap=el('#gh-repos');reposWrap.innerHTML='';repos.forEach(r=>{const d=document.createElement('div');d.className='repo';d.innerHTML=`<a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a><p class="muted">${r.description||''}</p>`;reposWrap.appendChild(d)})}catch(e){console.error('GH load err',e)} }

async function loadPostsList(){try{const list=await fetchJSON('posts/index.json');const postsList=el('#posts-list')||el('#recent-posts');if(!postsList) return;postsList.innerHTML='';list.sort((a,b)=>b.date.localeCompare(a.date)).forEach(p=>{const li=document.createElement('li');li.innerHTML=`<a href="post.html?post=${encodeURIComponent('posts/'+p.file)}"><strong>${p.title}</strong> <span class="muted">— ${p.date}</span><p class="excerpt">${p.excerpt||''}</p>`;postsList.appendChild(li)})}catch(e){console.error('posts load err',e)} }

async function renderMarkdownFromUrl(url, targetSelector){try{const res=await fetch(url);if(!res.ok){el(targetSelector).textContent='Yazı bulunamadı';return}const md=await res.text();el(targetSelector).innerHTML=marked.parse(md)}catch(e){console.error(e);el(targetSelector).textContent='Yükleme hatası.')} }

function getQueryParam(name){const params=new URLSearchParams(window.location.search);return params.get(name)}

// init
document.addEventListener('DOMContentLoaded',()=>{
  initThemeToggle();
  if(document.getElementById('gh-name')) loadGitHub();
  if(document.getElementById('posts-list')||document.getElementById('recent-posts')) loadPostsList();
  const postParam=getQueryParam('post');
  if(postParam && document.getElementById('post-content')){
    renderMarkdownFromUrl(postParam,'#post-content')
  }
})
