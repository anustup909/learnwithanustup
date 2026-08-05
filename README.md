# 🎓 Learn with Anustup - E-Learning Platform

![Learn with Anustup Banner](assets/hero_illustration.png)

A modern, highly interactive, and responsive E-Learning web application built with **HTML5**, **CSS3**, and **Vanilla JavaScript**. Designed with modern visual aesthetics, HSL color tokens, dark mode theme switching, web audio synthesizers, 3D card tilt tracking, and zero-third-party direct SMTP email integration.

---

## 🌟 Key Features

- 🚀 **Interactive Hero Section**: 3D card tilt tracking following mouse cursor position, live counter stats animation, and intro demo video player.
- 🎨 **Modern Design & Aesthetic System**: HSL tailored blue/cyan color system, modern Google Fonts (*Outfit* & *Inter*), glassmorphic elements, wave SVG dividers, and micro-interactions.
- 🌙 **Dark & Light Mode**: Seamless dark mode theme switcher with `localStorage` persistence.
- 📚 **Popular Courses Showcase**: Interactive category filters (*Speaking*, *Photography*, *Productivity*), price badges in **INR (₹)**, quick preview popups, and full enrollment modal.
- 🔊 **Web Audio Synthesizer**: Custom audio feedback synthesizer built using Web Audio API for responsive click feedback (includes volume mute/unmute toggle).
- 🎆 **Celebration Confetti & Ripples**: Dynamic ripple click effects and canvas confetti bursts upon course enrollment.
- 📧 **Direct SMTP Email Integration**: Built-in direct Python SMTP backend (`server.py`) for automated email dispatches from `mailrivu.in@gmail.com` with **0% third-party services**.
- 📱 **Offline PWA Support**: Includes `manifest.json`, `sw.js` (Service Worker caching), and a 1-click offline batch launcher (`open_offline_website.bat`).
- 🔍 **Live Search Modal**: Keyboard shortcut (`Ctrl + K`) quick search for instant course filtering.

---

## 📁 Project Structure

```text
├── index.html                  # Main semantic HTML5 structure
├── styles.css                  # Custom styling, dark mode, grid, & animations
├── script.js                   # Interactivity, audio synth, 3D tilt, & search
├── server.py                   # Direct Python SMTP email backend server
├── manifest.json               # Progressive Web App (PWA) manifest
├── sw.js                       # Service Worker offline cache engine
├── open_offline_website.bat    # Windows 1-click offline launcher
├── assets/                     # High-definition course & avatar graphics
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### 1. Run Locally (Web Server)
You can open `index.html` directly in any web browser or serve it using Python:

```bash
# Serve website on port 8080
python -m http.server 8080 --directory .
```
Then visit: `http://localhost:8080`

### 2. Direct SMTP Email Server Setup (Optional)
To send real automated emails directly from `mailrivu.in@gmail.com`:

1. Generate a 16-character App Password at [Google App Passwords](https://myaccount.google.com/apppasswords).
2. Set your App Password in `server.py`:
   ```python
   GMAIL_APP_PASSWORD = "your-16-character-app-password"
   ```
3. Start the email backend server:
   ```bash
   python server.py
   ```

---

## 🌐 Deploy to GitHub Pages (Free 24/7 Hosting)

To make this site permanently available online to anyone on mobile or PC:

1. Push this repository to GitHub.
2. Navigate to **Repository Settings ➔ Pages**.
3. Under **Source**, select `main` branch and `/ (root)` folder, then click **Save**.
4. Your website will be live globally at:
   `https://<your-username>.github.io/learn-with-anustup`

---

## 🛠️ Built With

- **HTML5** - Semantic layout
- **CSS3** - Custom CSS tokens, Flexbox, Grid, Glassmorphism
- **JavaScript (ES6+)** - DOM Manipulation, Web Audio API, Intersection Observer
- **FontAwesome 6** - Vector iconography
- **Canvas Confetti** - Particle celebrations

---

## 📝 License & Author

Crafted with passion by **Anustup**.  
&copy; 2026 Learn with Anustup. All rights reserved.
