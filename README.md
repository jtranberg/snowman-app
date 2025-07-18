# ❄️ Project Snowman Companion App

An ecosystem app for managing, monitoring, and gamifying carbon capture with Project Snowman — the modular CO₂ capture unit.

---

## 🚀 Tech Stack

* **Frontend:** React + Vite
* **Backend:** Node.js / Express (future expansion)
* **Database:** MongoDB (for user stats, logs)
* **Deployment:** Netlify (frontend), Render (backend)

---

## 🔧 Core Features

### 1. System Monitoring & Maintenance

* **Live Dashboard**

  * CO₂ captured (daily, total)
  * Cryochamber temperature
  * Manifold pressure
  * Filter saturation level
  * Electrochem cell efficiency
* **Maintenance Scheduler**

  * Automatic service reminders
  * Service history logging
  * QR scan for part replacement

### 2. Carbon Tracking

* **Offset Counter**

  * Daily/monthly/yearly tracking
  * Comparison to real-world equivalents (cars, flights)
* **Emission Logging**

  * Input: fuel, mileage, home energy
  * App calculates offset balance

### 3. Gamification

* **Snowman Score**

  * XP based on carbon capture
  * User levels and system upgrades
* **Achievements & Badges**

  * Milestones ("1 Ton Captured", "100 Days Operational")
* **Leaderboards**

  * Local + global ranking

### 4. Environmental Awareness

* **Air Quality Data**

  * Overlay for user location
  * Visualize impact
* **Learning Hub**

  * Lessons on carbon tech and emissions
* **News Feed**

  * Climate updates, community stories

### 5. Integration & Expansion

* **Future Smart Home Support**

  * Sync with solar, EVs, smart meters
* **Tokenized CO₂ Offsets**

  * Track and verify offsets on blockchain
* **Fleet & Map Mode**

  * View multiple unit performance
  * Coordinate public or business deployments

---

## 🧪 Future Ideas

* Simulation Mode
* Tree & credit sponsorship
* AR/3D system visualizer

---

## 📁 Project Structure (planned)

```
/src
  /components
    Header.jsx
    Dashboard.jsx
    ScorePanel.jsx
    MaintenancePanel.jsx
  /pages
    Home.jsx
    DashboardPage.jsx
    LearnPage.jsx
  /services
    api.js
  App.jsx
  main.jsx
  index.css
```

---

## ✅ Next Steps

* [x] Initialize Vite + React project
* [ ] Scaffold basic routing and layout
* [ ] Build Dashboard.jsx with placeholder data
* [ ] Connect to backend API (planned)

---

Together, we’re building the future of personal climate action — one snowflake at a time. ❄️🌍
