# ebubekirdogan.github.io

Kişisel statik site iskeleti: ana sayfa, blog ve GitHub entegrasyonu.
GitHub Pages ile otomatik deploy

Not: Eğer repo ana dalınız `main` değilse, `.github/workflows/deploy.yml` içindeki `branches` kısmını uygun dal adıyla güncelleyin.

Canlı Site

- Site yayında: https://ebubekirdgn.github.io

Badge

![Deploy status](https://github.com/ebubekirdgn/ebubekirdogan.github.io/actions/workflows/deploy.yml/badge.svg)
# ebubekirdogan.github.io

Kişisel statik site iskeleti: ana sayfa, blog ve GitHub entegrasyonu.

Hızlı başlatma:

1. Yerel bir HTTP sunucusu ile dosyaları servis edin (örnekler):

```bash
# Python 3
python -m http.server 8000

# veya Node.js için (http-server yüklüyse)
npx http-server -c-1 . -p 8000
```

2. Tarayıcınızda `http://localhost:8000` adresini açın.

Dosyalar:

- `index.html` — Ana sayfa (GitHub özet + blog önizleme)
- `blog.html` — Yazılar listesini gösterir
- `post.html` — Markdown yazılarını render eder
- `css/style.css` — Stil dosyası
- `js/main.js` — GitHub ve blog yükleme + markdown render
- `posts/` — Markdown yazılar ve `index.json`

Notlar:

- Blog yazıları `posts/` klasörüne markdown (`.md`) olarak eklenebilir; `posts/index.json` içine meta verileri (başlık, tarih, dosya adı, özet) ekleyin.
- GitHub verisi istemci tarafında GitHub API'den çekilir; büyük trafik için bir token veya sunucu tarafı proxy düşünün.

GitHub Pages ile otomatik deploy

1. Repo'yu `main` dalında tutun ve tüm site dosyalarını commit edin.
2. Bu repo için `Settings → Pages` bölümüne gidin ve `Deploy from a branch` seçeneğini işaretleyin.
	- Branch: `gh-pages`
	- Folder: `/ (root)`
3. Her `main` push'unda workflow otomatik olarak `gh-pages` dalını güncelleyecektir.

Not: Eğer repo ana dalınız `main` değilse, `.github/workflows/deploy.yml` içindeki `branches` kısmını uygun dal adıyla güncelleyin.
GitHub Pages otomatik deploy

