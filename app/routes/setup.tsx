import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import type { Route } from "./+types/setup";
import { Logo } from "~/components/Logo";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Setup - Food Expense Tracker" },
    { name: "description", content: "Configure your Google OAuth credentials" },
  ];
}

export default function Setup() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    clientId: "",
    clientSecret: "",
    redirectUri: "",
  });
  const [error, setError] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Load existing credentials if any
    const stored = localStorage.getItem("google_oauth_credentials");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCredentials(parsed);
      } catch (e) {
        console.error("Failed to load credentials", e);
      }
    }

    // Auto-fill redirect URI based on current domain
    const currentDomain = window.location.origin;
    setCredentials((prev) => ({
      ...prev,
      redirectUri: prev.redirectUri || `${currentDomain}/api/auth/callback`,
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!credentials.clientId.trim()) {
      setError("Client ID is required");
      return;
    }
    if (!credentials.clientSecret.trim()) {
      setError("Client Secret is required");
      return;
    }
    if (!credentials.redirectUri.trim()) {
      setError("Redirect URI is required");
      return;
    }

    // Validate Client ID format (should end with .apps.googleusercontent.com)
    if (!credentials.clientId.includes(".apps.googleusercontent.com")) {
      setError("Invalid Client ID format. Should be from Google Cloud Console.");
      return;
    }

    // Store credentials in localStorage
    localStorage.setItem("google_oauth_credentials", JSON.stringify(credentials));

    // Redirect to home page
    navigate("/");
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your credentials? You'll need to set them up again.")) {
      localStorage.removeItem("google_oauth_credentials");
      setCredentials({
        clientId: "",
        clientSecret: "",
        redirectUri: `${window.location.origin}/api/auth/callback`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Logo className="w-16 h-16 drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Google OAuth Setup
          </h1>
          <p className="text-gray-600">
            Configure your own Google Cloud credentials to use this app
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="flex items-center justify-between w-full text-left bg-blue-50 hover:bg-blue-100 rounded-lg p-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-semibold text-blue-900">
                  How to get your credentials (Click to expand)
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-blue-600 transition-transform ${
                  showInstructions ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showInstructions && (
              <div className="mt-4 p-6 bg-gray-50 rounded-lg space-y-4 text-sm text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Step 1: Create a Google Cloud Project</h3>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                    <li>Click "Select a project" → "New Project"</li>
                    <li>Name it "Food Expense Tracker" and click "Create"</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Step 2: Enable Gmail API</h3>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>In your project, go to "APIs & Services" → "Library"</li>
                    <li>Search for "Gmail API"</li>
                    <li>Click on it and press "Enable"</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Step 3: Configure OAuth Consent Screen</h3>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Go to "APIs & Services" → "OAuth consent screen"</li>
                    <li>Choose "External" user type and click "Create"</li>
                    <li>Fill in app name: "Food Expense Tracker" (or your preference)</li>
                    <li>Add your email as user support email</li>
                    <li>Add your email in developer contact</li>
                    <li>Click "Save and Continue"</li>
                    <li>On Scopes page, click "Add or Remove Scopes"</li>
                    <li>Filter and select: <code className="bg-white px-2 py-1 rounded">https://www.googleapis.com/auth/gmail.readonly</code></li>
                    <li>Click "Update" and "Save and Continue"</li>
                    <li>Add yourself as a test user (your email)</li>
                    <li>Click "Save and Continue"</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Step 4: Create OAuth Credentials</h3>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Go to "APIs & Services" → "Credentials"</li>
                    <li>Click "+ Create Credentials" → "OAuth client ID"</li>
                    <li>Application type: "Web application"</li>
                    <li>Name: "Food Expense Tracker Web"</li>
                    <li>Under "Authorized redirect URIs", click "+ Add URI"</li>
                    <li>Add: <code className="bg-white px-2 py-1 rounded">{credentials.redirectUri}</code></li>
                    <li>Click "Create"</li>
                    <li>Copy the Client ID and Client Secret (you'll enter them below)</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="font-semibold text-yellow-800">Important:</p>
                  <p className="text-yellow-700 mt-1">
                    Since your app will be in "Testing" mode, you'll see an "unverified app" warning when signing in.
                    This is normal and secure - you're authenticating with your own app. Click "Advanced" → "Go to [App Name] (unsafe)" to proceed.
                  </p>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={credentials.clientId}
                onChange={(e) =>
                  setCredentials({ ...credentials, clientId: e.target.value })
                }
                placeholder="123456789-abc123.apps.googleusercontent.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                From Google Cloud Console → Credentials
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Secret <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={credentials.clientSecret}
                onChange={(e) =>
                  setCredentials({ ...credentials, clientSecret: e.target.value })
                }
                placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                From Google Cloud Console → Credentials
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redirect URI <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={credentials.redirectUri}
                onChange={(e) =>
                  setCredentials({ ...credentials, redirectUri: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm bg-gray-50"
              />
              <p className="mt-1 text-xs text-gray-500">
                This should match the URI you added in Google Cloud Console
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-800">
                <strong>Privacy Note:</strong> Your credentials are stored only in your browser's localStorage.
                They are never sent to any external servers except Google's OAuth servers for authentication.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Save Credentials
              </button>

              {(credentials.clientId || credentials.clientSecret) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-6 py-3 border-2 border-gray-300 hover:border-red-500 hover:text-red-600 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
