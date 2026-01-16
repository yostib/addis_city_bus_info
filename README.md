# Addis City Bus Guide 

A simple, offline-first mobile application built with **React Native** and **Expo** that helps users find Addis Ababa city bus routes, fares, and destinations easily.

---

## ✨ Features

- 🔍 Browse all city bus routes
- 🔎 Search by bus number, origin, destination, or via
- 🧭 View detailed route information
- 💰 See fare and distance clearly
- 📱 Works fully offline
- 🌙 Clean UI with consistent theme

---

## 📱 Screens

- **Home**
- **Bus List (Browse All Buses)**
- **Bus Detail Screen**
  - Start
  - Via
  - Destination
  - Fare & distance
  - Full route stops

---

## 🛠️ Tech Stack

- **React Native**
- **Expo**
- **Expo Router**
- **JavaScript**
- **Git & GitHub**

---

## 📂 Project Structure

```text
addis_city_bus_info/
├── app/
│   ├── index.jsx          # Home screen
│   ├── bus-list.jsx       # List of all buses
│   ├── bus-detail/
│   │   └── [id].jsx       # Bus detail screen
│   └── _layout.jsx        # App layout
├── src/                   # Shared components & utilities
├── package.json
└── README.md

 Getting Started

1️⃣ Clone the repository

git clone https://github.com/YOUR_USERNAME/addis_city_bus_info.git
cd addis_city_bus_info

2️⃣ Install dependencies

npm install

3️⃣ Run the app

npx expo start 

Then scan the QR code with Expo Go or run on an emulator.

📦 Data Source

.  Bus route data is currently stored locally in the app.

.  Designed to work offline.

.  Future versions may support dynamic updates.

🧩 Future Improvements

.  🗺️ Map integration

.  ⭐ Favorite routes

.  🚌 Route directions (two-way)

.  🌐 Multi-language support (Amharic / English)

.  ☁️ Remote data sync