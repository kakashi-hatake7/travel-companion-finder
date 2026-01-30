#!/bin/bash

# Script to add Firebase environment variables to Vercel
# This adds variables to production, preview, and development environments

echo "Adding Firebase environment variables to Vercel..."

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
  
  echo "Adding $KEY..."
  
  # Add to production
  echo "$VALUE" | npx vercel env add "$KEY" production --force
  
  # Add to preview  
  echo "$VALUE" | npx vercel env add "$KEY" preview --force
  
  # Add to development
  echo "$VALUE" | npx vercel env add "$KEY" development --force
  
  echo "✓ $KEY added to all environments"
  echo ""
done

echo "🎉 All environment variables added successfully!"
echo "Now triggering a redeploy..."

# Trigger redeploy
npx vercel --prod

echo "✅ Done! Your site should be live shortly."
