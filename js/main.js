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
  if(saved){ applyTheme(saved); }
  else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){ applyTheme('light'); }

  const btns = document.querySelectorAll('#theme-toggle');
  btns.forEach(btn=>{
    const updateBtn = ()=>{
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      btn.textContent = isLight ? '☀️' : '🌙';
      btn.setAttribute('aria-pressed', String(isLight));
    };
    btn.addEventListener('click', ()=>{
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
