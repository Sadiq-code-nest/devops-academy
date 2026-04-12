# DevOps Academy — Course Website

A modern, high-converting, single-page scrolling website for a DevOps bootcamp course.

## Project Structure

```
devops-academy/
├── index.html          ← Main page (single-page scroll)
├── css/
│   └── style.css       ← All styles (CSS variables, dark mode, responsive)
├── js/
│   └── main.js         ← All interactivity (curriculum, reviews, animations)
├── assets/             ← (optional) images, icons, PDFs
└── README.md
```

## How to Open & Run Locally

### Option 1 — VS Code Live Server (recommended)

1. Open VS Code
2. Install the **Live Server** extension (by Ritwick Dey)
3. Open the `devops-academy/` folder in VS Code: `File → Open Folder`
4. Right-click `index.html` → **Open with Live Server**
5. Site opens at `http://127.0.0.1:5500`

### Option 2 — Python (no install needed)

```bash
cd devops-academy
python3 -m http.server 8080
# Open: http://localhost:8080
```

### Option 3 — Node.js serve

```bash
npm install -g serve
cd devops-academy
serve .
# Open the URL shown in terminal
```

### Option 4 — Direct file open

Just double-click `index.html` — works for most features (Google Fonts requires internet).

---

## Deployment

### Netlify (free, fastest)
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the `devops-academy/` folder onto the deploy zone
3. Done — live in 30 seconds

### GitHub Pages
```bash
git init
git add .
git commit -m "initial commit"
gh repo create devops-academy --public --push --source=.
# Enable GitHub Pages: Settings → Pages → Branch: main, folder: / (root)
```

### Vercel
```bash
npm install -g vercel
cd devops-academy
vercel
```

---

## Customization Guide

### Update batch info
In `index.html`, search for `"Next Batch"` and update:
- Start date
- Seats remaining (seats bar width %)
- Pricing (৳9,999 etc.)

### Add your instructor photo
Replace the `.avatar-initials` div with an `<img>` tag:
```html
<img src="assets/instructor.jpg" alt="Instructor" class="avatar-photo">
```
Add to CSS:
```css
.avatar-photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; }
```

### Connect a backend (future)
In `js/main.js`, the `submitEnroll()` function has a `TODO` comment showing where to add your `fetch('/api/enroll', ...)` call.

### Add Google Analytics
Paste your GA4 snippet just before `</head>` in `index.html`.

---

## Features

- ✅ Single-page scroll layout
- ✅ Sticky navbar with active section highlight
- ✅ Dark mode (persists via localStorage)
- ✅ Mobile responsive with hamburger menu
- ✅ Terminal animation in hero
- ✅ Interactive curriculum accordion
- ✅ Phase stepper / roadmap
- ✅ Review submission form
- ✅ Sticky "Enroll Now" floating CTA
- ✅ Enrollment form with success state
- ✅ Scroll-triggered fade-in animations
- ✅ Seats remaining progress bar
- ✅ Free resources section
- ✅ Backend-ready enrollment form (TODO comments included)

## Tech Stack

Pure HTML + CSS + Vanilla JS. No build tools, no npm, no frameworks.
Zero dependencies — everything loads from Google Fonts CDN.
