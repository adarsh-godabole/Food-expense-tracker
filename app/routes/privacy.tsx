import { Link } from "react-router";
import type { Route } from "./+types/privacy";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy Policy - Food Expense Tracker" },
    { name: "description", content: "Privacy Policy for Food Expense Tracker" },
  ];
}

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <Link
          to="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 font-medium"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to Food Expense Tracker. We respect your privacy and are committed to protecting
              your personal data. This privacy policy explains how we collect, use, and safeguard your
              information when you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Gmail Data</h3>
            <p>
              When you connect your Gmail account, we access:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email messages from Swiggy and Zomato to extract order information</li>
              <li>Order details including date, amount, restaurant name, and items ordered</li>
            </ul>
            <p className="mt-4">
              We only read emails from food delivery services (Swiggy and Zomato) and do not access
              any other emails in your inbox.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Local Storage</h3>
            <p>
              We store the following data in your browser's local storage:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gmail access tokens (for authentication)</li>
              <li>Extracted food order data</li>
              <li>User preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Extract and display your food delivery order history</li>
              <li>Calculate your total spending on food delivery services</li>
              <li>Provide analytics and insights about your spending patterns</li>
              <li>Improve our service and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Data Storage and Security</h2>
            <p>
              Your data is stored locally in your browser and is never sent to our servers or any
              third-party services except Google's Gmail API for authentication and email access.
            </p>
            <p className="mt-4">
              We use OAuth 2.0 for secure authentication with Google. Your Gmail password is never
              shared with us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data Sharing</h2>
            <p>
              We do not sell, trade, or share your personal information with third parties. The only
              external service we use is:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Gmail API:</strong> To access your food delivery order emails</li>
              <li><strong>Vercel Analytics:</strong> Anonymous usage statistics (no personal data)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your data stored in the application</li>
              <li>Delete your data by logging out and clearing browser storage</li>
              <li>Revoke Gmail access at any time through your Google Account settings</li>
              <li>Request information about how your data is used</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Cookies and Tracking</h2>
            <p>
              We use browser local storage for essential functionality. We use Vercel Analytics for
              anonymous usage statistics to improve our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Third-Party Services</h2>
            <p>Our application uses:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Gmail API:</strong> Subject to Google's Privacy Policy</li>
              <li><strong>Vercel:</strong> For hosting and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Children's Privacy</h2>
            <p>
              Our service is not intended for users under the age of 13. We do not knowingly collect
              personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes
              by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our
              support channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
