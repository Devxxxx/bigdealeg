# Fix for Installation Issues

## 1. Missing date-fns Package

The error `Module not found: Can't resolve 'date-fns/formatDistanceToNow'` indicates that the date-fns package is missing. Run the following commands to install it:

```bash
# Navigate to your frontend directory
cd E:\bigdealegy\bigdealegy\frontend

# Install date-fns
npm install date-fns
```

Or you can use the provided script:
```bash
# From the backend directory
.\install-date-fns.bat
```

## 2. SQL Error: "relation 'users' does not exist"

The SQL error occurs because the original script referenced a "users" table, but in Supabase, user accounts are typically stored in the "auth.users" table, while profile information is often in a "profiles" table.

I've created a corrected SQL script at `backend/sql/notification_tables.sql`. This script:

1. Creates the notification_tokens table correctly
2. Creates the notifications table if it doesn't exist
3. Sets up proper RLS (Row Level Security) policies
4. Creates the necessary triggers
5. Handles the case where the update_timestamp function doesn't exist

To run this script:

```sql
-- In your Supabase SQL editor or database client
\i E:/bigdealegy/bigdealegy/backend/sql/notification_tables.sql
```

## Verification Steps

After making these changes:

1. Restart your frontend development server
2. Verify that the date-fns import is working correctly
3. Run the SQL script and verify that the tables are created without errors
4. Test the notification functionality

If you encounter any further issues, please provide the error messages and we can address them.
