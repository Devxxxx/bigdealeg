# Firebase Cloud Messaging (FCM) Setup

This guide explains how to set up Firebase Cloud Messaging (FCM) for browser notifications in the BigDealEgy application. FCM allows notifications to be delivered even when the browser is closed.

## Installation

### Backend Setup

1. **Install required packages**:
   ```bash
   # Linux/Mac
   ./commands/install-firebase.sh
   
   # Windows
   .\commands\install-firebase.bat
   ```

2. **Create a Firebase project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Set up a web app in your Firebase project

3. **Generate a Firebase Service Account key**:
   - In the Firebase Console, go to Project Settings > Service Accounts
   - Click "Generate new private key" to download the JSON file
   - Encode the JSON file as base64:
     ```bash
     # Linux/Mac
     cat your-service-account.json | base64
     
     # Windows
     certutil -encode your-service-account.json tmp.b64 && type tmp.b64
     ```

4. **Add environment variables to your `.env` file**:
   ```
   FIREBASE_SERVICE_ACCOUNT_BASE64=<base64-encoded-service-account-key>
   ```

5. **Run the database SQL script** to create the notification_tokens table:
   ```sql
   -- Run this in your database
   \i sql/notification_tokens.sql
   ```

### Frontend Setup

1. **Update Firebase config**:
   Edit `frontend/src/lib/firebase/config.js` with your Firebase project details:
   ```javascript
   export const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```

2. **Generate a VAPID key** for web push notifications:
   - In the Firebase Console, go to Project Settings > Cloud Messaging
   - Under "Web configuration", scroll to "Web Push certificates"
   - Create a new certificate and copy the key pair
   - Add it to your `.env.local` file:
     ```
     NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
     ```

3. **Update the service worker**:
   Edit `frontend/public/firebase-messaging-sw.js` with your Firebase config:
   ```javascript
   firebase.initializeApp({
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   });
   ```

4. **Add notification sound**:
   Place an MP3 file at `frontend/public/sounds/notification.mp3`

## Testing

To test the notification system:

1. **Enable push notifications** in the user settings

2. **Send a test notification** using Postman or similar tool:
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
       "type": "system",
       "link": "/dashboard/notifications"
     }
   ```

## Troubleshooting

- **Firebase Admin not installing**: Make sure you're running npm with the correct permissions
- **FCM token not generating**: Check the browser console for errors and ensure notifications are enabled in the browser
- **FCM token not saving**: Check the backend console logs for errors
- **Notifications not showing**: 
  - Check the browser console for errors
  - Make sure the service worker is registered correctly
  - Verify that notifications are enabled in the browser and system settings

## Using Notifications in the Code

### Creating Notifications

```javascript
// In any backend controller
const notificationService = require('../services/notification.service');

// Create a notification
await notificationService.createNotification({
  user_id: userId,
  title: 'Property Updated',
  message: 'A property you saved has been updated',
  type: 'update',
  related_entity_id: propertyId,
  related_entity_type: 'property',
  link: `/properties/${propertyId}`
});
```

### Handling Notifications in Frontend

```javascript
// Using the notification context
import { useNotifications } from '@/components/providers/NotificationProvider';

const MyComponent = () => {
  const { newNotification, pushEnabled } = useNotifications();
  
  useEffect(() => {
    if (newNotification) {
      // Handle new notification (e.g., show a toast)
      console.log('New notification:', newNotification);
    }
  }, [newNotification]);
  
  return (
    <div>
      {/* Component content */}
    </div>
  );
};
```
