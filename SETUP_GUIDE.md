# Food Delivery Expense Tracker - Setup Guide

This application fetches your actual Swiggy and Zomato order data from Gmail using the Gmail API.

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API:
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"

### 2. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required fields (App name, User support email, Developer contact)
   - Add your email to "Test users" section
   - Under "Scopes", add: `https://www.googleapis.com/auth/gmail.readonly`
4. Create OAuth client ID:
   - Application type: "Web application"
   - Name: "Food Expense Tracker"
   - Authorized redirect URIs:
     - `http://localhost:5173/api/auth/callback`
     - Add production URL when deploying
5. Copy the Client ID and Client Secret

### 3. Configure Environment Variables

1. Open the `.env` file in the project root
2. Replace the placeholder values:
   ```env
   GOOGLE_CLIENT_ID=your_actual_client_id_here
   GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:5173/api/auth/callback
   ```

### 4. Install Dependencies and Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### 5. Using the Application

1. Navigate to `http://localhost:5173/expenses`
2. Click "Connect Gmail" button
3. Sign in with your Google account (the one you receive Swiggy/Zomato emails on)
4. Grant permission to read emails
5. The app will automatically sync your orders from email confirmations
6. Click "Sync Gmail" anytime to fetch new orders

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

- Your Gmail credentials are never stored
- OAuth tokens are stored in browser localStorage
- Only order confirmation emails are accessed
- All processing happens on your local machine
- No data is sent to external servers

## Troubleshooting

### "Authentication failed"
- Verify your Google OAuth credentials are correct in `.env`
- Make sure the redirect URI matches exactly in Google Cloud Console
- Check that Gmail API is enabled

### "No orders found"
- Verify you have Swiggy/Zomato order confirmation emails
- The parser looks for specific email patterns - some older emails might not be recognized
- Try checking the browser console for parsing errors

### "Failed to fetch orders"
- Token might have expired - click "Disconnect" then "Connect Gmail" again
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

When deploying to production:

1. Update the redirect URI in `.env`:
   ```env
   GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/callback
   ```

2. Add the production redirect URI to Google Cloud Console OAuth settings

3. Move the app from "Testing" to "Production" in OAuth consent screen (requires verification for public use)

4. For private use, keep it in "Testing" mode and add specific Gmail accounts to the "Test users" list
