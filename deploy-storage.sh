#!/bin/bash
# Firebase Storage Deployment Script
# Run this from the project root to deploy storage rules

echo "🚀 Deploying Firebase Storage Rules..."
echo ""
echo "Checking Firebase CLI installation..."

# Check if firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

echo ""
echo "📋 Deploying storage rules to Firebase project: gopicnic-a258a"
echo ""

# Deploy only storage rules
firebase deploy --only storage

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Storage rules deployed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Go to Firebase Console: https://console.firebase.google.com/project/gopicnic-a258a/storage"
    echo "2. Verify the Rules tab shows your new rules"
    echo "3. Test profile image upload in the app"
    echo ""
else
    echo ""
    echo "❌ Deployment failed. Check the error above."
    echo ""
    echo "Troubleshooting:"
    echo "1. Make sure you're logged in: firebase login"
    echo "2. Make sure you're in the correct project directory"
    echo "3. Check that storage.rules file exists"
    echo ""
fi
