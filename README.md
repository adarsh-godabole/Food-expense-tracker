# Food Delivery Expense Tracker

Track your Swiggy and Zomato food delivery expenses by automatically extracting order data from your Gmail.

**⚠️ IMPORTANT: This app uses user-provided OAuth credentials to avoid expensive CASA Tier 2 security assessments ($15,000-$75,000+ annually).**

## Why User-Provided Credentials?

Google requires apps using sensitive scopes like Gmail to complete a CASA Tier 2 security assessment. By having each user create their own Google Cloud project and OAuth credentials, we:

- ✅ **Avoid CASA assessment** - Save $15,000-$75,000+ per year
- ✅ **Keep it free** - No subscription or verification costs
- ✅ **Maximum privacy** - Users control their own credentials
- ✅ **No verification delays** - Start using immediately
- ✅ **100% transparent** - All code is open source

## Features

- 📧 Automatically extracts orders from Gmail (Swiggy & Zomato)
- 💰 Tracks total spending and order history
- 📊 Analytics and insights about your food delivery habits
- 🔒 Private and secure - all data stored locally in your browser
- 🎨 Beautiful, modern UI built with React Router and TailwindCSS
- 🌐 No backend servers - completely client-side processing

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### 3. Set Up Your Google OAuth Credentials

**You need to create your own Google Cloud project and OAuth credentials.** This takes about 5-10 minutes:

1. Open the app and click "Click here to set up →"
2. Follow the detailed step-by-step instructions on the setup page
3. Or refer to [SETUP_GUIDE.md](./SETUP_GUIDE.md) for complete instructions

**Key steps:**
- Create a Google Cloud project
- Enable Gmail API
- Configure OAuth consent screen
- Create OAuth client ID
- Paste credentials into the app

### 4. Start Tracking Your Expenses

1. Click "Continue with Google"
2. Authenticate (you'll see an "unverified app" warning - this is normal and safe!)
3. Your orders will be automatically synced from Gmail

## Building for Production

Create a production build:

```bash
npm run build
```

**Note:** No environment variables needed! Each user configures their own credentials in the app.

## Deployment

Deploy to any platform that supports Node.js applications:

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

### Docker

```bash
docker build -t food-expense-tracker .
docker run -p 3000:3000 food-expense-tracker
```

**Important for Production:**
- No environment variables needed!
- Each user creates their own Google Cloud credentials
- Users configure credentials at `/setup` page
- Update redirect URI to match your production domain

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#production-deployment) for detailed deployment instructions.

## Architecture

### User-Provided Credentials Flow

```
User → Creates Google Cloud Project → Obtains OAuth Credentials →
Configures in App (/setup) → Authenticates with Google →
Gmail API (User's Project) → Email Data → Client-Side Processing →
Local Storage
```

### Key Design Decisions

1. **No Backend Database**: All data stored in browser localStorage
2. **Client-Side Processing**: Email parsing happens in the browser
3. **OAuth State Parameter**: Credentials passed through OAuth flow securely
4. **No Central Credentials**: Each user has their own Google Cloud project

### Tech Stack

- **Frontend**: React Router v7, TypeScript
- **Styling**: TailwindCSS
- **API**: Gmail API (via googleapis npm package)
- **Auth**: OAuth 2.0 with user-provided credentials
- **Storage**: Browser localStorage

## Privacy & Security

- ✅ No server-side storage of personal data
- ✅ No centralized OAuth credentials
- ✅ All email processing happens client-side
- ✅ OAuth credentials stored only in your browser
- ✅ You can revoke access anytime via Google Account settings
- ✅ Open source - audit the code yourself

## Contributing

Contributions are welcome! This project helps people avoid expensive CASA assessments.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this in your own projects!

## Acknowledgments

- Built with [React Router](https://reactrouter.com/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Powered by [Gmail API](https://developers.google.com/gmail/api)

---

**Avoiding CASA assessments through user-provided credentials** 💡

If you find this approach useful, consider starring the repo and sharing it with others!
