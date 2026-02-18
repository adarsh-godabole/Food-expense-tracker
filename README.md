# Food Expense Tracker

A privacy-focused web application that automatically fetches and analyzes your Swiggy and Zomato food delivery expenses from Gmail.

## Features

- **Automatic Email Import** - Fetches order confirmation emails from Swiggy and Zomato
- **Expense Analytics** - View total spending by platform with detailed breakdowns
- **Date Range Filtering** - Analyze expenses for custom time periods
- **Privacy-First Design** - No data stored on external servers; all processing happens locally
- **Transaction History** - Detailed table with order dates, amounts, and items
- **Responsive UI** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: React Router (full-stack framework)
- **Bundler**: Vite
- **Authentication**: Google OAuth 2.0
- **API**: Gmail API for email access

## Prerequisites

- Node.js 20+
- Google Cloud Project with Gmail API enabled
- OAuth 2.0 credentials (Client ID and Client Secret)

## Setup

### 1. Google Cloud Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Gmail API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure the OAuth consent screen
6. Add authorized redirect URI: `http://localhost:5173/api/auth/callback` (for development)
7. Download or copy your Client ID and Client Secret

### 2. Environment Variables

Create a `.env` file in the project root:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=http://localhost:5173/api/auth/callback
```

### 3. Installation

```bash
npm install
```

### 4. Development

Start the development server with HMR:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Docker Deployment

Build and run using Docker:

```bash
docker build -t food-expense-tracker .
docker run -p 3000:3000 food-expense-tracker
```

### Supported Platforms

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

## Project Structure

```
├── app/
│   ├── components/        # Reusable UI components
│   ├── lib/
│   │   └── gmail.server.ts   # Gmail API integration
│   ├── routes/
│   │   ├── api.auth.ts           # OAuth initiation
│   │   ├── api.auth.callback.ts  # OAuth callback handler
│   │   ├── api.fetch-orders.ts   # Email fetching endpoint
│   │   ├── home.tsx              # Login page
│   │   ├── expenses.tsx          # Main dashboard
│   │   ├── privacy.tsx           # Privacy policy
│   │   └── terms.tsx             # Terms of service
│   ├── root.tsx           # App root layout
│   └── app.css            # Global styles
├── public/                # Static assets
├── Dockerfile             # Container configuration
└── package.json
```

## How It Works

1. **Authentication**: Users sign in with Google OAuth, granting read-only access to Gmail
2. **Email Search**: The app searches for order confirmation emails from Swiggy and Zomato
3. **Parsing**: Email content is parsed to extract order details (date, amount, items)
4. **Display**: Expenses are displayed in an interactive dashboard with filtering options

## Supported Platforms

| Platform | Status |
|----------|--------|
| Swiggy   | Fully supported |
| Zomato   | Coming soon |

## Privacy

- **No Server Storage**: Order data is never stored on external servers
- **Local Processing**: All email parsing happens in your browser
- **Minimal Access**: Only order confirmation emails are accessed
- **Token Security**: OAuth tokens are stored locally in your browser

For more details, see the [Privacy Policy](/privacy) page in the app.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Run production server |
| `npm run typecheck` | Run TypeScript type checking |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source.

---

Built with React Router and Tailwind CSS
