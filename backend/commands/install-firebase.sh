#!/bin/bash

# Navigate to backend directory
cd "$(dirname "$0")/.."

# Install Firebase Admin SDK
npm install firebase-admin uuid express-validator

# Create a message to guide the user
echo "✅ Firebase Admin SDK and dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Create a Firebase project at https://console.firebase.google.com/"
echo "2. Generate a private key for your service account"
echo "3. Add the following environment variables to your .env file:"
echo "   - FIREBASE_SERVICE_ACCOUNT_BASE64 (base64 encoded service account key)"
echo "   - FIREBASE_APP_ID"
echo "   - FIREBASE_API_KEY"
echo ""
echo "To encode your service account JSON as base64:"
echo "On Linux/Mac: cat your-service-account.json | base64"
echo "On Windows: certutil -encode your-service-account.json tmp.b64 && type tmp.b64"
echo ""
echo "Also, make sure to run the SQL script at sql/notification_tokens.sql"
echo "to create the necessary database tables."
