# 🕉️ Shree Siddhivinayak Mahalakshmi Dham — Divine Temple Website

A majestic, production-grade, multi-page Hindu Temple web platform built with sacred Vedic aesthetics (Saffron & Royal Gold), online 80G tax-exempt donations, dynamic UPI payment QR generator, online archana bookings, interactive virtual Aarti, and an exclusive Developer Control Dashboard.

---

## 🌟 Key Features for Client Presentation

### 1. 🛕 Multi-Page Sacred Architecture
- **[index.html](file:///c:/Users/hp/Desktop/TEMPLE_WEBSITE/index.html)**: Grand Homepage with 3D interactive sanctum, live aarti ticker, virtual digital diya lighting, pushpanjali flower shower, and daily Panchang calculator.
- **[pushpa-bhandari-bhajan.html](file:///c:/Users/hp/Desktop/TEMPLE_WEBSITE/pushpa-bhandari-bhajan.html)**: **Official Devotional Channel Hub for Smt. Pushpa Bhandari ([@pushpabhandari6645](https://www.youtube.com/@pushpabhandari6645))** — Full biography, 45K+ subscribers telemetry, 16:9 HD video theater player, curated playlists (Devbhoomi Jagars, Aartis, Shiv Stuti, Navratri Bhajans), and direct YouTube subscribe button.
- **[auth.html](file:///c:/Users/hp/Desktop/TEMPLE_WEBSITE/auth.html)**: **Devotee & Developer Auth Portal** — Strict 2-step security flow (**Register First, Then Login**) with role selection (Devotee, Trustee, Developer).
- **[about.html](file:///c:/Users/hp/Desktop/TEMPLE_WEBSITE/about.html)**: Temple history, 200-year Swayambhu manifestation, sacred architecture, and social welfare trust activities.
- **[darshan.html](file:///c:/Users/hp/Desktop/TEMPLE_WEBSITE/darshan.html)**: Daily aarti schedule (Kakad Aarti, Panchamrit, Bhog, Sandhya Deepa Aarti), pilgrim dress code, and live queue wait time indicator.
- **[pooja-booking.html](file:///c:/Users/hp/Desktop/TEMPLE_WEBSITE/pooja-booking.html)**: Online Archana, Rudrabhishekam, and Ganapati Homa booking with Sankalpa, gotra chant details, and printable Darshan E-Pass.
- **[donation.html](file:///c:/Users/hp/Desktop/TEMPLE_WEBSITE/donation.html)**: Full-fledged Seva portal for Annadanam, Goshala, Temple Renovation, and Akhand Deepa.
- **[events.html](file:///c:/Users/hp/Desktop/TEMPLE_WEBSITE/events.html)**: Annual festival calendar (Ganesh Utsav, Maha Shivaratri, Deepotsav, Navratri, Ekadashi).
- **[gallery.html](file:///c:/Users/hp/Desktop/TEMPLE_WEBSITE/gallery.html)**: High-resolution temple photography gallery with category filters, video bhajans, and interactive lightbox modal.
- **[contact.html](file:///c:/Users/hp/Desktop/TEMPLE_WEBSITE/contact.html)**: Pilgrim guide, transport connectivity (Airport, Dadar Railway, Metro Aqua Line, Parking), Dharamshala room bookings, and 24x7 helpdesk.

---

### 2. 💰 Sacred Seva & 80G Donation Engine (`donation.html`)
- **Seva Categorization**: Annadanam (Feed 100/500 devotees), Gau Seva (Goshala care), Gopuram Renovation, Akhand Deepa, Veda Pathashala.
- **Vedic Preferences**: Devotee name, Gotra, Birth Star (Nakshatra), Rashi, and Sankalpa intention.
- **Dynamic UPI QR Code**: Generates real-time UPI QR codes with countdown timer.
- **Instant Official 80G Tax Exemption E-Receipt**: Automatic generation of print-ready / downloadable PDF certificate featuring:
  - Trust Registration & 80G IT Approval Numbers
  - Unique Receipt No. and Transaction ID
  - PAN Card validation
  - Temple Seal & Authorized Treasurer signature
  - Amount in words and digits.
- **Live Donor Wall of Honor**: Dynamically updates on every donation.

---

### 3. ⚙️ Restricted Developer Dashboard (`developer-dashboard.html`)
- **Passkey Gate Security**: Protected by master developer passkey (Default: `shree108` or `admin2026`).
- **Telemetry & KPIs**: Real-time totals for Donations (₹), Active Donors, Online Pooja Bookings, and Daily Footfall.
- **Live Marquee Broadcaster**: Developer can change the header announcement in real-time, instantly reflecting across all public website pages.
- **Master Donations Table**: Search donors by name, phone, PAN, or transaction ID; filter by seva category; view individual receipts.
- **Pooja Allotments Table**: View and track bookings by date, priest, and devotee gotra.
- **Developer Super-Tools**:
  - Re-seed demo donors and bookings in 1 click.
  - Export all donation data to CSV (Excel).
  - Download complete JSON database snapshot.
  - Live system terminal audit logs.

---

### 4. 🪔 Delightful Interactive Touches (Client Favorites)
- **Web Audio Synthesizer**: Temple brass ghanti (bell chime) and Shankh sound synthesized natively with zero external audio dependencies.
- **Digital Diya & Pushpanjali Shower**: Devotees click to light a digital lamp and trigger an animated flower petal shower across the screen.
- **Dynamic Hindu Panchang**: Automatically computes today's Tithi, Paksha, and Vikram Samvat for the current date.

---

### 5. ✨ Real-Time 3D Sacred Engine ("3d animation jaise")
- **Interactive 3D Temple Sanctum (`#sanctum-3d-section`)**:
  - Full 360° rotational 3D Sanctum featuring the sacred Golden Kalash, coconut, mango leaves, and self-illuminating Akhand Jyoti flame.
  - Built with **WebGL (Three.js)** and graceful high-performance Canvas fallback.
  - **"🪔 Perform 3D Aarti"**: Camera sweeps smoothly in an elliptical parikrama orbit around the sacred altar with glowing dynamic light trails while the temple brass bell rings.
  - **"🌸 3D Pushpanjali"**: Explodes 3D flower petals directly towards the sanctum in 3D physics space.
  - **Lighting Modes**: Switch between Gold Sunlight, Sandhya (Dusk) Crimson Glow, and Night Aarti illumination.
- **Interactive 3D Card Tilt (`init3DCardTilt`)**:
  - Hovering over temple cards, donation seva cards, and video cards creates realistic 3D perspective tilt with specular lighting glare.
- **Floating 3D Temple Bell (`.floating-3d-bell`)**:
  - Interactive brass bell hanging by a golden chain that realistically swings in 3D when clicked and rings the sacred chime.

---

### 6. 📺 YouTube Devotional Channel Hub (Pushpa Bhandari)
- **Official Channel Integration**: Integrated **[Pushpa Bhandari (@pushpabhandari6645)](https://www.youtube.com/@pushpabhandari6645)**.
- **Channel Spotlight**: Verified badge, subscriber counter, and 1-click "Subscribe on YouTube" official button.
- **Interactive Bhakti Video Player**:
  - Embedded responsive 16:9 HD video player.
  - Curated spiritual playlist including Ganesha & Mahalakshmi Aartis, Devbhoomi Uttarakhand traditional folk Jagars, and Shiva Stutis.
  - Also linked across Gallery, Events, Navigation, and Developer Dashboard!

---

## 🚀 How to Run & Preview

### Option A: Direct Browser Preview (Zero Dependencies)
You can double-click **`index.html`** or open any `.html` file directly in Chrome, Edge, Safari, or Firefox.

### Option B: Built-in Node.js Server
Run in PowerShell / Terminal:
```bash
npm start
```
or
```bash
node server.js
```
Then visit:
- **Public Site**: [http://localhost:3000](http://localhost:3000)
- **Pushpa Bhandari Bhajans TV**: [http://localhost:3000/pushpa-bhandari-bhajan.html](http://localhost:3000/pushpa-bhandari-bhajan.html)
- **Auth (Register & Login)**: [http://localhost:3000/auth.html](http://localhost:3000/auth.html)
- **Donation Page**: [http://localhost:3000/donation.html](http://localhost:3000/donation.html)
- **Developer Dashboard**: [http://localhost:3000/developer-dashboard.html](http://localhost:3000/developer-dashboard.html) *(Requires Developer login)*
