# UniGo Android App

A simple Android wrapper app for the UniGo Travel Companion Finder website.

## 📱 About

This Android app provides a native mobile experience for the UniGo website (https://uni-go-companion-finder-omega.vercel.app/). It uses a WebView to display the website with added features like:

- Custom splash screen
- Location/GPS permissions for maps
- Swipe-to-refresh
- Offline error handling
- Native Android feel (no browser UI)

## 🚀 Quick Start

1. **Install Android Studio** and JDK 11+
2. **Open this project** in Android Studio
3. **Wait for Gradle sync** to complete
4. **Click Run** to build and install

For detailed instructions, see [`build_instructions.md`](../../../.gemini/antigravity/brain/f2199dca-f6e9-4c02-86e0-32839f0f4d92/build_instructions.md)

## 📋 Requirements

- Android Studio Hedgehog or newer
- JDK 11 or higher
- Android SDK API 34
- Android device running 7.0+ for testing

## 🔨 Building

### Debug APK (for testing)
```bash
./gradlew assembleDebug
```
Output: `app/build/outputs/apk/debug/app-debug.apk`

### Release APK (for distribution)
```bash
./gradlew assembleRelease
```
Or use Android Studio: **Build → Generate Signed Bundle / APK**

## 📱 Installation

1. Enable **Developer Options** on your Android device
2. Enable **USB Debugging**
3. Connect device via USB
4. Click **Run** in Android Studio

Or transfer the APK file and install manually.

## 🎨 Customization

### Change Website URL
Edit `MainActivity.java` line 24:
```java
private static final String WEBSITE_URL = "https://your-url.com/";
```

### Change App Name
Edit `app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Your App Name</string>
```

### Change Colors
Edit `app/src/main/res/values/colors.xml`

## 📂 Project Structure

```
app/
├── src/main/
│   ├── java/com/unigo/companion/
│   │   ├── MainActivity.java       # Main WebView activity
│   │   └── SplashActivity.java     # Splash screen
│   ├── res/
│   │   ├── layout/                 # UI layouts
│   │   ├── values/                 # Strings, colors, themes
│   │   ├── drawable/               # Vector graphics
│   │   └── mipmap-*/               # App icons
│   ├── assets/
│   │   └── error.html              # Offline error page
│   └── AndroidManifest.xml         # App configuration
└── build.gradle                    # Dependencies
```

## 🔑 Permissions

- `INTERNET` - Load website content
- `ACCESS_FINE_LOCATION` - GPS for maps feature
- `ACCESS_COARSE_LOCATION` - Network-based location
- `ACCESS_NETWORK_STATE` - Check connectivity

## 🐛 Troubleshooting

See the comprehensive troubleshooting guide in [`build_instructions.md`](../../../.gemini/antigravity/brain/f2199dca-f6e9-4c02-86e0-32839f0f4d92/build_instructions.md)

Common issues:
- **Gradle sync failed**: Invalidate caches and restart
- **SDK not found**: Set SDK location in Project Structure
- **App crashes**: Check internet connection and permissions

## 📖 Documentation

- [`project_overview.md`](../../../.gemini/antigravity/brain/f2199dca-f6e9-4c02-86e0-32839f0f4d92/project_overview.md) - Detailed project explanation
- [`build_instructions.md`](../../../.gemini/antigravity/brain/f2199dca-f6e9-4c02-86e0-32839f0f4d92/build_instructions.md) - Step-by-step build guide
- [`ICON_SETUP.md`](ICON_SETUP.md) - How to customize app icons

## 🎯 Features

- ✅ Full-screen WebView
- ✅ Custom splash screen (2 seconds)
- ✅ Location permissions for maps
- ✅ Swipe-to-refresh
- ✅ Back button navigation
- ✅ Offline error handling
- ✅ Hardware acceleration
- ✅ Secure HTTPS connection

## 📊 App Info

- **Package**: com.unigo.companion
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)
- **Version**: 1.0

## 📄 License

This is a personal learning project for testing purposes.

## 🆘 Support

For detailed help, see the documentation files or check:
- [Android Developer Docs](https://developer.android.com)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/android)

---

**Built with ❤️ for learning Android development**
