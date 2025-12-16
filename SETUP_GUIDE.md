# Food Delivery Expense Tracker - Setup Guide

This application fetches your actual Swiggy and Zomato order data from Gmail using the Gmail API.

**IMPORTANT:** This app uses **user-provided OAuth credentials**, meaning each user creates their own Google Cloud project and OAuth credentials. This approach avoids the need for expensive CASA Tier 2 security assessments and keeps the app free and private.

## Why User-Provided Credentials?

Google requires apps that use sensitive scopes (like Gmail access) to undergo a CASA Tier 2 security assessment, which costs $15,000-$75,000+ annually. By having each user create their own Google Cloud project and OAuth credentials, we:

- ✅ Avoid CASA assessment requirements
- ✅ Keep the app completely free
- ✅ Ensure maximum privacy (you control your own credentials)
- ✅ Allow unlimited users without verification delays

## Setup Instructions

### 1. Create Your Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Food Expense Tracker" (or any name you prefer)
4. Click "Create"

### 2. Enable Gmail API

1. In your new project, go to "APIs & Services" → "Library"
2. Search for "Gmail API"
3. Click on it and press "Enable"

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type and click "Create"
3. Fill in required fields:
   - App name: "Food Expense Tracker" (or your preference)
   - User support email: Your email
   - Developer contact: Your email
4. Click "Save and Continue"
5. On Scopes page:
   - Click "Add or Remove Scopes"
   - Search for and select: `https://www.googleapis.com/auth/gmail.readonly`
   - Click "Update" then "Save and Continue"
6. Add Test Users:
   - Add your Gmail address (the one with Swiggy/Zomato emails)
   - Click "Save and Continue"

### 4. Create OAuth Client ID

1. Go to "APIs & Services" → "Credentials"
2. Click "+ Create Credentials" → "OAuth client ID"
3. Select "Web application" as application type
4. Name: "Food Expense Tracker Web"
5. Under "Authorized redirect URIs", click "+ Add URI"
6. Add your redirect URI:
   - For local development: `http://localhost:5173/api/auth/callback`
   - For production: `https://yourdomain.com/api/auth/callback`
7. Click "Create"
8. **Copy the Client ID and Client Secret** - you'll need these in the app

### 5. Install and Run the App

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### 6. Configure Credentials in the App

1. Open the app in your browser: `http://localhost:5173`
2. Click "Click here to set up →"
3. Paste your Client ID, Client Secret, and Redirect URI
4. Click "Save Credentials"

### 7. Use the Application

1. Click "Continue with Google"
2. You'll see an "unverified app" warning - this is normal!
   - Click "Advanced" → "Go to Food Expense Tracker (unsafe)"
   - This is safe because it's YOUR app with YOUR credentials
3. Grant permission to read emails
4. The app will automatically sync your orders
5. Click "Sync Gmail" anytime to fetch new orders

## How It Works

1. **Authentication**: Uses Google OAuth 2.0 to securely access your Gmail
2. **Email Fetching**: Searches for emails from:
   - `noreply@swiggy.in` with subject containing "order" or "delivered"
   - `no-reply@zomato.com` with subject containing "order" or "delivered"
3. **Parsing**: Extracts order details from email content:
   - Order date
   - Order amount (looks for patterns like "Total: ₹XXX")
   - Restaurant name or order description
4. **Storage**: Stores data in browser localStorage (persists across sessions)

## Privacy & Security

- **Your credentials stay with you**: OAuth credentials are stored only in your browser's localStorage
- **No central server**: Your Gmail credentials never touch our servers
- **No CASA assessment needed**: Each user authenticates with their own Google Cloud project
- **Complete control**: You can revoke access anytime from your Google Account settings
- **Local processing**: Email parsing happens in your browser
- **Transparent**: All code is open source and auditable

## Credential Management

### Viewing/Updating Your Credentials
1. Go to `/setup` page
2. Your saved credentials will be pre-filled
3. Update any field and click "Save Credentials"

### Clearing Credentials
1. Go to `/setup` page
2. Click "Clear" button
3. You'll need to reconfigure credentials to use the app again

### Security Best Practices
- Don't share your Client Secret with anyone
- If compromised, delete the OAuth client in Google Cloud Console and create a new one
- Your credentials are stored in browser localStorage - clearing browser data will delete them

## Troubleshooting

### "Authentication failed" or "Missing credentials"
- Make sure you've completed the setup at `/setup` page
- Verify your Client ID ends with `.apps.googleusercontent.com`
- Check that the redirect URI in your Google Cloud Console exactly matches the one in the app
- Ensure Gmail API is enabled in your Google Cloud project

### "Unverified app" warning
- This is **normal and expected** for apps in Testing mode
- Click "Advanced" → "Go to [App Name] (unsafe)" to proceed
- It's safe because you're using your own credentials with your own Google Cloud project
- You don't need to publish or verify the app for personal use

### "No orders found"
- Verify you have Swiggy/Zomato order confirmation emails
- The parser looks for specific email patterns - some older emails might not be recognized
- Try checking the browser console for parsing errors

### "Failed to fetch orders"
- Token might have expired - click "Disconnect" then "Connect Gmail" again
- Check that your test user email is added in Google Cloud Console
- Check browser console for detailed error messages

## Email Parsing Patterns

The app looks for these patterns in emails:

**Swiggy:**
- From: `noreply@swiggy.in`
- Amount patterns: "Total: ₹XXX", "Grand Total: ₹XXX", "Amount Paid: ₹XXX"

**Zomato:**
- From: `no-reply@zomato.com`
- Amount patterns: "Total: ₹XXX", "Bill Amount: ₹XXX"

If your emails use different formats, you may need to update the parsing logic in `app/lib/gmail.server.ts`.

## Production Deployment

When deploying to production (e.g., Vercel, Netlify):

1. Deploy your app normally (no environment variables needed!)

2. Each user will need to:
   - Create their own Google Cloud project (following steps 1-4 above)
   - Use the production redirect URI: `https://yourdomain.com/api/auth/callback`
   - Configure their credentials in the app at `/setup`

3. **Important**: Keep your Google Cloud project in "Testing" mode for personal use
   - Testing mode allows up to 100 users
   - No verification required
   - Users will see "unverified app" warning (which is safe to proceed through)

4. **For public/commercial use**: You would need to:
   - Publish the OAuth consent screen
   - Complete Google's verification process
   - OR maintain the user-provided credentials approach to avoid verification

## Advantages of User-Provided Credentials

1. **No CASA Assessment**: Avoid $15,000-$75,000+ annual security assessment costs
2. **Unlimited Users**: Each user has their own quota and limits
3. **Maximum Privacy**: Users control their own OAuth credentials
4. **No Verification Delays**: No waiting for Google's app verification process
5. **Lower Liability**: You're not responsible for securing centralized credentials
6. **Educational**: Users learn about OAuth and Google Cloud Platform

## Open Source & Sharing

This app is designed to be:
- **Forkable**: Others can deploy their own instance
- **Self-hosted**: No dependency on centralized infrastructure
- **Transparent**: All code is auditable and modifiable
- **Free**: No recurring costs for security assessments

Share the code, deploy your own instance, and help others avoid expensive CASA assessments!
