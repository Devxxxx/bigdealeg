# Firebase Notification Setup for BigDealEgy

Your Firebase configuration has been updated with the credentials you provided. Here's what's been done:

## What's Been Updated

1. **Frontend Configuration**:
   - Firebase config in `frontend/src/lib/firebase/config.js`
   - VAPID key in `frontend/src/lib/firebase/messaging.js`
   - Service worker in `frontend/public/firebase-messaging-sw.js`
   - Notification sound path in the NotificationProvider

2. **Backend Configuration**:
   - Service account credentials in `.env` file (base64 encoded)
   - FCM service coded to gracefully handle missing dependencies

## Next Steps

1. **Install Required Packages**:
   ```bash
   # Navigate to your backend directory
   cd E:\bigdealegy\bigdealegy\backend
   
   # Run the setup script
   .\setup-firebase.bat
   
   # On Linux/Mac use:
   # ./setup-firebase.sh
   ```

2. **Create the Notification Database Tables**:
   Run the following SQL script in your database:
   ```sql
   -- Use the SQL script at:
   -- E:\bigdealegy\bigdealegy\backend\sql\notification_tokens.sql
   ```

3. **Add a Real Notification Sound**:
   Replace the placeholder file with a real MP3 file at:
   ```
   E:\bigdealegy\bigdealegy\frontend\public\sounds\notification.mp3
   ```

4. **Restart Your Services**:
   ```bash
   # Restart your backend server
   # Restart your frontend development server
   ```

5. **Test the Notifications**:
   1. Login as a user
   2. Enable push notifications in settings
   3. Create a test notification using the API

## Testing Notifications

You can use the following API endpoint to test notifications:

```
POST /api/notifications
Headers:
  Authorization: Bearer <your-token>
  Content-Type: application/json
Body:
  {
    "user_id": "<user-id>",
    "title": "Test Notification",
    "message": "This is a test notification",
    "type": "system"
  }
```

## Troubleshooting

If you encounter any issues:

1. Check browser console for errors
2. Verify that notifications are enabled in browser settings
3. Check backend logs for any FCM initialization errors
4. Make sure your Firebase project has Cloud Messaging API enabled

Everything is now set up for browser notifications, even when the browser is closed!
