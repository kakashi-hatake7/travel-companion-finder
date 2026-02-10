# UniGo Android App - Icon Setup Guide

## 📱 App Icons Overview

Your app currently uses a **vector drawable icon** (XML-based) which works great for the splash screen. However, for the best launcher icon experience, you should create proper PNG icons for all screen densities.

## 🎨 Current Icon Setup

The project includes:
- ✅ **Splash screen logo**: `ic_splash_logo.xml` (vector drawable)
- ✅ **Adaptive icon configuration**: For Android 8.0+ devices
- ⚠️ **Launcher icons**: Using default placeholders (should be replaced)

## 🔧 How to Create Custom Launcher Icons

### Option 1: Android Asset Studio (Recommended - Easiest)

1. **Visit**: [Android Asset Studio - Icon Generator](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)

2. **Upload your logo**:
   - Click "Image" tab
   - Upload a square PNG image (512x512px recommended)
   - Or use the "Clipart" tab to choose from built-in icons

3. **Customize**:
   - Adjust padding, background color
   - Preview on different devices
   - Choose shape (circle, square, rounded)

4. **Download**:
   - Click "Download"
   - Extract the ZIP file

5. **Replace icons**:
   - Copy all `mipmap-*` folders from the ZIP
   - Paste into `app/src/main/res/` (replace existing folders)

### Option 2: Using Android Studio (Built-in)

1. **Right-click** on `res` folder in Android Studio
2. Select **New → Image Asset**
3. Choose **Launcher Icons (Adaptive and Legacy)**
4. Configure:
   - **Foreground Layer**: Upload your logo
   - **Background Layer**: Choose color or image
   - **Preview**: Check how it looks
5. Click **Next** → **Finish**
6. Icons are automatically generated!

### Option 3: Manual Creation (Advanced)

Create PNG icons in these sizes and place in respective folders:

| Folder | Size | Density |
|--------|------|---------|
| `mipmap-mdpi` | 48x48 | Medium |
| `mipmap-hdpi` | 72x72 | High |
| `mipmap-xhdpi` | 96x96 | Extra High |
| `mipmap-xxhdpi` | 144x144 | Extra Extra High |
| `mipmap-xxxhdpi` | 192x192 | Extra Extra Extra High |

File names: `ic_launcher.png` and `ic_launcher_round.png`

## 🎯 Design Recommendations

### For UniGo Travel App

**Suggested icon concepts**:
1. **Map pin with airplane** - Represents travel + location
2. **Compass with people icons** - Finding companions
3. **Globe with connection lines** - Global travel connections
4. **Backpack icon** - Travel theme
5. **Location pin with "U" letter** - UniGo branding

### Design Guidelines

- ✅ **Simple and recognizable** at small sizes
- ✅ **High contrast** for visibility
- ✅ **Unique** - stands out from other apps
- ✅ **Brand colors** - Use your primary blue (#2563EB)
- ❌ Avoid text (hard to read at small sizes)
- ❌ Avoid complex details (gets lost when scaled down)

## 🖼️ Creating Your Icon Image

### Using Free Design Tools

1. **Canva** (Easiest):
   - Go to [canva.com](https://www.canva.com)
   - Create 512x512px design
   - Use templates or design from scratch
   - Download as PNG

2. **Figma** (Professional):
   - Create 512x512px frame
   - Design your icon
   - Export as PNG

3. **GIMP** (Free Photoshop alternative):
   - Create new 512x512px image
   - Design your icon
   - Export as PNG

### Quick Icon from Text

If you want a simple text-based icon:

1. Create 512x512px image
2. Add solid background (your brand color)
3. Add large "U" or "UG" in white
4. Add subtle shadow or gradient
5. Export as PNG

## 📋 Icon Checklist

Before finalizing your icons:

- [ ] Icon looks good at 48x48px (smallest size)
- [ ] Icon is recognizable without text
- [ ] Icon uses your brand colors
- [ ] Icon works on both light and dark backgrounds
- [ ] Icon is unique and memorable
- [ ] All density folders have icons
- [ ] Both `ic_launcher.png` and `ic_launcher_round.png` exist

## 🔄 Testing Your Icons

After adding icons:

1. **Rebuild the app**:
   ```bash
   ./gradlew clean
   ./gradlew assembleDebug
   ```

2. **Reinstall on device**:
   - Uninstall old version
   - Install new APK
   - Check home screen icon

3. **Test on different launchers**:
   - Default launcher
   - Nova Launcher
   - Microsoft Launcher
   - Check shape adaptation

## 🎨 Current Icon (Placeholder)

The current `ic_splash_logo.xml` shows a **map pin icon** which is perfect for your travel app! You can:

1. **Keep it as-is** for quick testing
2. **Generate PNGs from it** using Android Studio
3. **Create a custom design** using the tools above

## 📝 Example: Quick Setup

**Fastest way to get started**:

1. Open Android Studio
2. Right-click `res` folder
3. New → Image Asset
4. Choose "Launcher Icons"
5. Select "Clipart" tab
6. Search "map" or "location"
7. Choose a pin icon
8. Set background color to `#2563EB` (your brand blue)
9. Click Finish
10. Rebuild and test!

**Time**: 2-3 minutes ⚡

---

## 🆘 Need Help?

If you're stuck:
1. Use Android Studio's built-in Image Asset tool (easiest)
2. Use Android Asset Studio website (no software needed)
3. Ask a designer friend to create a 512x512px PNG
4. Use the current vector icon (works fine for testing)

---

**Note**: The app works perfectly with the current placeholder icons. Custom icons are optional but recommended for a professional look! 🎨
