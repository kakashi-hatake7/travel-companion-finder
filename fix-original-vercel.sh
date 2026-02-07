#!/bin/bash

# Script to add Firebase environment variables to the ORIGINAL Vercel project
# Project: uni-go-companion-finder-omega

echo "Adding Firebase environment variables to uni-go-companion-finder-omega project..."

# Project ID for the original deployment
PROJECT_ID="prj_GrL1oqV2gPVfOLomqYC6cRXFwlqd"

# Array of environment variable key-value pairs
declare -a vars=(
  "VITE_FIREBASE_API_KEY=AIzaSyCMbzZiyY2VcQ45ftpFe--W3K3i5mnfeBo"
  "VITE_FIREBASE_AUTH_DOMAIN=travelbuddy-cbf8a.firebaseapp.com"
  "VITE_FIREBASE_PROJECT_ID=travelbuddy-cbf8a"
  "VITE_FIREBASE_STORAGE_BUCKET=travelbuddy-cbf8a.firebasestorage.app"
  "VITE_FIREBASE_MESSAGING_SENDER_ID=391974735963"
  "VITE_FIREBASE_APP_ID=1:391974735963:web:7e79d836c56c1e01a9af7e"
  "VITE_FIREBASE_MEASUREMENT_ID=G-ZD35Z8NRCH"
)

# Loop through each variable and add to all environments
for var in "${vars[@]}"; do
  KEY="${var%%=*}"
  VALUE="${var#*=}"
  
  echo "Adding $KEY to original project..."
  
  # Add to production
  echo "$VALUE" | npx vercel env add "$KEY" production --force --scope ayush-agnihotris-projects-d9ed1cb5
  
  # Add to preview  
  echo "$VALUE" | npx vercel env add "$KEY" preview --force --scope ayush-agnihotris-projects-d9ed1cb5
  
  # Add to development
  echo "$VALUE" | npx vercel env add "$KEY" development --force --scope ayush-agnihotris-projects-d9ed1cb5
  
  echo "✓ $KEY added"
  echo ""
done

echo "🎉 All environment variables added to original project!"
echo "Now triggering a redeploy to https://uni-go-companion-finder-omega.vercel.app/"

# Go back to the parent directory where the original project is linked
cd ..

# Trigger redeploy for the original project
npx vercel --prod --scope ayush-agnihotris-projects-d9ed1cb5

echo "✅ Done! Your original link should work shortly:"
echo "https://uni-go-companion-finder-omega.vercel.app/"
