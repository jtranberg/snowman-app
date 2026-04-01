❄️ Project Snowman Companion App














📸 Preview

Live system after full rebuild — multi-sensor telemetry including voltage, temperature, and environmental data.

🧠 Overview

Project Snowman Companion App is a monitoring and engagement platform designed to support a modular environmental system through real-time telemetry, user interaction, and data visualization.

The app bridges hardware and software by combining:

live sensor data ingestion
intelligent UI state handling
device interaction via BLE
resilient fallback behavior when hardware is offline

⚠️ Note: Implementation details are intentionally abstracted.

🚀 Tech Stack
Frontend: React + Vite
Backend: Node.js / Express
Database: MongoDB
Deployment: Netlify (frontend), Render (backend)
Hardware Interface: ESP32-based telemetry system
Device Communication: Web Bluetooth (BLE)
🔧 Core Features
📊 System Monitoring
Live telemetry dashboard
Multi-sensor data visualization (temperature, voltage, environmental metrics)
Derived system state (ACTIVE / IDLE) based on real-world conditions
Runtime tracking with dynamic session accumulation
Smart fallback to cached readings when device is unavailable
📡 Device Interaction (BLE)
Direct Wi-Fi configuration via Bluetooth
Secure credential transmission to device
Real-time connection status feedback
Graceful error handling for connection failures
🌱 Environmental Tracking
Environmental data monitoring (CO₂, temperature, humidity)
Aggregated performance insights
Context-aware telemetry interpretation
🎮 Gamification Layer
System activity-based scoring
Achievements and milestone tracking
Engagement-driven progression model
🌍 Awareness & Insights
External environmental data integration (planned)
Educational system context
Community and update feeds (planned)
🔌 Integration & Expansion
Modular system architecture
Designed for multi-device scaling
Future smart system integrations
🧪 Tested Flows
Cached telemetry rendering from session storage
Refresh request behavior with firmware-triggered data flow
Graceful fallback when no new device reading is available
Failed refresh handling with system resilience
Auto-refresh toggle behavior
BLE Wi-Fi credential setup flow
SSID and password validation
Web Bluetooth availability handling
Successful BLE credential transmission
BLE failure and error handling
🧠 System Behavior Highlights
Hardware-aware UI: adapts based on device availability
Resilient data model: always shows last known good state
Asynchronous telemetry pipeline: handles delayed device responses
State derivation logic: combines sensor freshness + voltage activity
🧪 Future Direction
Simulation and predictive modeling
Visual system representations (AR / 3D)
Expanded analytics and telemetry insights
Enhanced interaction and automation layers
🏗️ Architecture (High-Level)
Sensors → ESP32 → Backend API → Dashboard UI
                ↑
              BLE Setup
Sensor data is collected via embedded hardware
Backend exposes telemetry endpoints
Frontend visualizes and interprets data
BLE enables direct device configuration from UI
📁 Project Structure
/src
  /components
  /pages
  /services
  App.jsx
  main.jsx
🧭 Current Status
 Full system rebuild and hardware integration
 Multi-sensor telemetry pipeline operational
 Real-time dashboard with derived state logic
 BLE Wi-Fi configuration interface
 Frontend test coverage (telemetry + BLE flows)
 Backend expansion and persistence optimization
 Advanced analytics and simulation layer
🎯 Why This Project Matters

This project explores the intersection of:

IoT telemetry systems
real-time data visualization
hardware ↔ software interaction
resilient frontend architecture
user engagement design

It demonstrates a full-stack, hardware-aware approach to building connected systems that operate reliably under real-world constraints.

⚙️ Run Locally
npm install
npm run dev
🌐 Deployment
Frontend: Netlify
Backend: Render

Building connected systems that turn data into insight. ❄️