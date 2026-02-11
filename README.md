<div align="center">

# 🧳 UniGo — Travel Companion Finder

### Connect with travelers heading to the same destination. Share rides, split costs, and make new friends on your journey.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_UniGo-8b5cf6?style=for-the-badge)](https://uni-go-companion-finder-omega.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Personal_Project-green?style=for-the-badge)]()

---

**JavaScript** `55.8%` · **CSS** `40.7%` · **Java** `1.2%` · **Other** `2.3%`

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Google Maps Setup](#-google-maps-setup)
- [Android App](#-android-app)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 About the Project

**UniGo** is a full-stack travel companion finder platform that helps travelers connect with others heading to the same destination. Whether you're looking to share a cab, split travel costs, or simply find a travel buddy — UniGo makes it effortless.

The platform features an interactive map-based interface, real-time trip listings, AI-powered design analysis via Google Gemini, and smooth animations powered by Framer Motion — all wrapped in a beautiful, responsive UI.

### 🎯 Why UniGo?

- 🚕 **Share Rides** — Find co-travelers and split costs
- 🤝 **Make Connections** — Meet like-minded travelers on your journey
- 🗺️ **Visual Discovery** — Explore trips on an interactive map with real-time pins
- 📱 **Cross-Platform** — Available on web and Android

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Interactive Maps** | Google Maps + Leaflet integration with real-time trip pins and smooth 60fps zoom |
| 🔍 **Smart Search** | Search destinations and find travel companions instantly |
| 🤖 **AI-Powered Analysis** | Google Gemini AI integration for brand and design analysis |
| 🔥 **Real-time Backend** | Firebase-powered authentication, database, and storage |
| 🎨 **Modern UI/UX** | Tailwind CSS with Framer Motion animations and responsive design |
| 📍 **Location Services** | GPS-based location detection for nearby trip suggestions |
| 🛡️ **Error Monitoring** | Sentry integration for real-time error tracking and performance monitoring |
| 📱 **Android App** | Native Android wrapper with splash screen, swipe-to-refresh, and offline support |
| 🌙 **Beautiful Design** | Neon-glow aesthetics with graffiti-style branding |
| ⚡ **Lightning Fast** | Vite-powered build system with HMR for instant development feedback |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI component library |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **Lucide React** | Icon library |
| **React Leaflet** | Open-source map rendering |
| **@react-google-maps/api** | Google Maps integration |

### Backend & Services
| Technology | Purpose |
|-----------|---------|
| **Firebase 12** | Auth, Firestore, Storage |
| **Google Gemini AI** | AI-powered content analysis |
| **Sentry** | Error tracking & monitoring |

### Android
| Technology | Purpose |
|-----------|---------|
| **Java** | Android native development |
| **WebView** | Web content rendering |
| **Android SDK 34** | Target Android 14 |

### Dev Tools
| Technology | Purpose |
|-----------|---------|
| **TypeScript** | Type safety |
| **ESLint 9** | Code linting |
| **Prettier** | Code formatting |
| **PostCSS** | CSS processing |

---

## 📂 Project Structure

```
travel-companion-finder/
├── 📄 index.html                # Root HTML (Brand Forge)
├── 📄 index.tsx                 # Root entry point
├── 📄 package.json              # Root dependencies
├── 📄 vite.config.ts            # Vite configuration
├── 📄 tsconfig.json             # TypeScript config
├── 📄 types.ts                  # Shared TypeScript types
├── 📄 geminiService.ts          # Google Gemini AI integration
├── 📄 UniGoLogo.tsx             # Interactive logo component
├── 📄 metadata.json             # Project metadata
├── 📄 GOOGLE_MAPS_SETUP.md     # Google Maps setup guide
│
├── 📁 src/                      # Source directory
│   └── App.jsx                  # Main app component
│
├── 📁 my-app/                   # Main web application
│   ├── index.html               # App entry HTML with SEO meta tags
│   ├── package.json             # App dependencies
│   └── src/                     # React components & pages
│
├── 📁 UniGoAndroid/             # Android wrapper app
│   └── app/
│       └── src/main/
│           ├── java/            # Java source files
│           ├── res/             # Android resources
│           └── AndroidManifest.xml
│
└── 📄 fix-original-vercel.sh   # Vercel deployment fix script
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18+ — [Download](https://nodejs.org/)
- **npm** 9+ (comes with Node.js)
- **Git** — [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayushagnihotrii/travel-companion-finder.git
   cd travel-companion-finder
   ```

2. **Install dependencies** (Main app)
   ```bash
   cd my-app
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#-environment-variables))

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

---

## 🔐 Environment Variables

Create a `.env.local` file in the `my-app/` directory:

```env
# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Sentry (Error Monitoring)
VITE_SENTRY_DSN=your_sentry_dsn

# Google Gemini AI (for root Brand Forge)
API_KEY=your_gemini_api_key
```

> ⚠️ **Important:** Never commit your `.env.local` file. It's already included in `.gitignore`.

---

## 🗺️ Google Maps Setup

Follow the detailed guide in [`GOOGLE_MAPS_SETUP.md`](./GOOGLE_MAPS_SETUP.md) for step-by-step instructions:

1. Create a Google Cloud project
2. Enable Maps JavaScript API
3. Generate an API key
4. Add the key to your `.env.local` file
5. Restart the dev server and enjoy interactive maps! 🎉

> 💡 **Free Tier:** Google Maps offers $200/month in free credits (~28,000 map loads/month).

---

## 📱 Android App

The project includes a native Android wrapper app in the `UniGoAndroid/` directory.

### Quick Start
1. Open the `UniGoAndroid/` folder in **Android Studio**
2. Wait for Gradle sync to complete
3. Click **Run** to build and install

### Build APK
```bash
cd UniGoAndroid
./gradlew assembleDebug    # Debug APK
./gradlew assembleRelease  # Release APK
```

### Android App Features
- ✅ Full-screen WebView experience
- ✅ Custom splash screen
- ✅ Location/GPS permissions
- ✅ Swipe-to-refresh
- ✅ Back button navigation
- ✅ Offline error handling
- ✅ Hardware acceleration

> 📋 **Requirements:** Android Studio Hedgehog+, JDK 11+, Android SDK API 34

For more details, see the [Android README](./UniGoAndroid/README.md).

---

## 🚢 Deployment

### Vercel (Recommended)

The app is deployed on **Vercel** at [uni-go-companion-finder-omega.vercel.app](https://uni-go-companion-finder-omega.vercel.app/)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Set the **Root Directory** to `my-app`
4. Add your environment variables in Vercel's dashboard
5. Deploy! 🚀

### Manual Build
```bash
cd my-app
npm run build
# Output will be in my-app/dist/
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Guidelines
- Follow the existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Test your changes before submitting

---

## 📄 License

This is a personal learning and hackathon project. Feel free to explore the code and learn from it.

---

## 📬 Contact

**Ayush Agnihotri** — [@ayushagnihotrii](https://github.com/ayushagnihotrii)

🔗 **Project Link:** [github.com/ayushagnihotrii/travel-companion-finder](https://github.com/ayushagnihotrii/travel-companion-finder)

🌐 **Live Demo:** [uni-go-companion-finder-omega.vercel.app](https://uni-go-companion-finder-omega.vercel.app/)

---

<div align="center">

### ⭐ If you found this project useful, give it a star!

**Built with ❤️ by [Ayush Agnihotri](https://github.com/ayushagnihotrii)**

</div>
