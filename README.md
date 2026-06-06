# SYNAPSE CORE  Premium Cybernetics & Neural Integration Mainframe

An advanced, highly interactive 3D web experience built with **React**, **Three.js (WebGL)**, and **Vite**. 

Travel through 8 illuminated districts in a custom-textured self-driving **Cybertruck** while running diagnostics, compiling C protocols, and managing neural links.

## 🚀 Features & HUD Systems

*   **3D Cybernetic Grid Engine**: Powered by Three.js with realistic fog, volumetric neon lighting, dynamic camera path tracking on scroll, and a textured Tesla Cybertruck with custom chrome/stainless steel body panels, black rubber tires, and tinted glass shaders.
*   **Tactical HUD Overlay**: Responsive dashboard styling featuring:
    *   **Segmented Capsule Tracker**: Segments illuminating as you traverse districts, without cluttering the screen.
    *   **Targeting Reticle**: Locked onto the Cybertruck with rotating telemetry rings and crosshairs.
    *   **Live Sensor Feeds**: Interactive panels showcasing real-time fluctuating diagnostic readouts (`SYS.FPS`, `NET.RTT`, `CPU.TMP`, `UPLINK`).
    *   **Bio-Pulse Monitor**: Animated vector EKG line representing cognitive link coherence.
    *   **Status Footer**: Time clock, session ID compiler, and active scroll indicators.
*   **Low-Level C Code Compiler**: An interactive terminal emulator simulating real-time GCC compiles and memory mapping logs.
*   **Neural Link Synchronization**: Futuristic biometric modal showcasing connection status, security overlays, and visual synchronization progress.
*   **Responsive Overhaul**: Scaled and designed to look stunning on mobile devices, tablets, and ultra-wide screens.

---

## 🛠️ Tech Stack

*   **React** — Component architecture & state orchestration
*   **Three.js** — 3D scene loading, object parsing, material mapping, and camera interpolation
*   **Framer Motion** — Kinetic slide animations and layout transitions
*   **Tailwind CSS v4** — High-performance modern utility styling
*   **Vite** — Lightning-fast local development and asset bundling
*   **Lucide React** — Cybernetic icon assets

---

## 📂 Project Structure

```
src/
├── components/
│   ├── City3DScene.jsx       # 3D Canvas, Orbiting lights, and Cybertruck Loader
│   ├── CustomCursor.jsx      # Custom neon target cursor
│   ├── HUDOverlay.jsx        # Telemetry panels, reticle, bio-pulse, and bottom status
│   ├── IntroLoader.jsx       # Boot sequence and console logs loader
│   ├── InteractiveTerminal.jsx # Interactive user terminal UI
│   └── Navbar.jsx            # Desktop/Mobile navigation
├── sections/
│   └── CoreSection.jsx       # GCC compiler panel (District 2)
├── App.jsx                   # Main layout container and district config
├── index.css                 # Global styles, scrollbar styling, and custom neon filters
└── main.jsx                  # React entry point
```

---

## 📦 Getting Started

### Prerequisites

Make sure you have **Node.js** (v18+) and **npm** installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rishabhkankariya/Cyborg-Landing-Page.git
   cd Cyborg-Landing-Page
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🤝 Verification & Contributing

All components are fully decoupled and production-ready. Visual elements scale automatically to fit any viewport aspect ratio. Feel free to submit issues or pull requests to enhance the cybernetic mainframe!
