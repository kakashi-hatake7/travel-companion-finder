# 🗺️ Google Maps API Setup Guide

## Quick Start (5 minutes)

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "**Select a Project**" → "**New Project**"
3. Name it: **TravelBuddy** or **UniGo**
4. Click "**Create**"

### Step 2: Enable Maps JavaScript API
1. In the search bar, type "**Maps JavaScript API**"
2. Click on "**Maps JavaScript API**"
3. Click the blue "**ENABLE**" button
4. Wait ~30 seconds for activation

### Step 3: Create API Key
1. In the left sidebar, click "**Credentials**"
2. Click "**+ CREATE CREDENTIALS**" → "**API key**"
3. Copy the API key (starts with `AIza...`)
4. Click "**Close**" (or "Restrict Key" for production)

### Step 4: Add to Your Project
1. Open your project folder
2. Find the file `.env.local`
3. Replace `your_api_key_here` with your actual key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyC...your_actual_key
   ```
4. Save the file

### Step 5: Restart Dev Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 6: Test It! 🎉
1. Go to your app: `http://localhost:5173`
2. Click on "**Globe**" tab
3. You should see a satellite map with **red pins** on registered cities!

---

## 🆓 Pricing (Don't Worry!)

**Free Tier:**
- $200/month credit (FREE)
- Covers ~28,000 map loads/month
- Perfect for development and small projects

**Your usage:** Probably FREE during hackathon!

---

## ⚠️ Troubleshooting

### "This page can't load Google Maps correctly"
**Solution:** Check if your API key is correctly set in `.env.local`

### "Google Maps API error: RefererNotAllowedMapError"
**Solution:** In Google Cloud Console → Credentials → Edit your API key → Remove restrictions (for development)

### Map not showing, blank screen
**Solution:** 
1. Make sure `.env.local` is in the project root (same level as `package.json`)
2. Restart the dev server
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Still not working?
- Clear browser cache
- Check browser console for errors (F12)
- Verify API key is enabled and not expired

---

## 📍 Features You'll Get

✅ **Smooth 60fps zoom** - No lag!  
✅ **Red pins** - Only on registered cities  
✅ **Traveler count** - Badge showing number of trips  
✅ **Click pins** - See trip details  
✅ **Search** - Find any destination  
✅ **Mobile-friendly** - Touch optimized  

---

## 🎯 Next Steps

Once your map is working:
1. Test zooming in/out (should be smooth!)
2. Click on red pins to see trip details
3. Use search to find destinations
4. Test on mobile device
5. Register some trips to see more pins appear!

**Enjoy your new Google Maps powered globe!** 🌍✨
