import { Link } from "react-router";
import type { Route } from "./+types/terms";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Terms & Conditions - Food Expense Tracker" },
    { name: "description", content: "Terms and Conditions for Food Expense Tracker" },
  ];
}

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <Link
          to="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 font-medium"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Food Expense Tracker ("the Service"), you accept and agree to be
              bound by these Terms and Conditions. If you do not agree to these terms, please do not
              use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p>
              Food Expense Tracker is a web application that helps you track and analyze your food
              delivery expenses by accessing your Gmail account to extract order information from
              Swiggy and Zomato.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Accounts and Authentication</h2>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Gmail Access</h3>
            <p>
              To use the Service, you must grant access to your Gmail account. By doing so, you
              authorize us to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Read emails from Swiggy and Zomato</li>
              <li>Extract order information including dates, amounts, and items</li>
              <li>Store this information locally in your browser</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 Account Security</h3>
            <p>
              You are responsible for maintaining the security of your Google account. We recommend
              using strong passwords and enabling two-factor authentication.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate information</li>
              <li>Use the Service only for lawful purposes</li>
              <li>Not attempt to gain unauthorized access to any part of the Service</li>
              <li>Not interfere with or disrupt the Service</li>
              <li>Not use automated systems to access the Service without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data and Privacy</h2>
            <p>
              Your use of the Service is also governed by our Privacy Policy. Please review our
              Privacy Policy to understand our data practices.
            </p>
            <p className="mt-4">
              All extracted data is stored locally in your browser. We do not store your email
              content or order information on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
            <p>
              The Service, including its original content, features, and functionality, is owned by
              Food Expense Tracker and is protected by international copyright, trademark, and other
              intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accuracy of extracted order information</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Food Expense Tracker shall not be liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Any indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, data, or use</li>
              <li>Inaccurate order information or calculations</li>
              <li>Issues arising from third-party services (Gmail, Swiggy, Zomato)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Third-Party Services</h2>
            <p>
              The Service integrates with third-party services including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Gmail API:</strong> Subject to Google's Terms of Service</li>
              <li><strong>Swiggy & Zomato:</strong> We are not affiliated with these services</li>
            </ul>
            <p className="mt-4">
              We are not responsible for the content, policies, or practices of these third-party
              services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Termination</h2>
            <p>
              You may stop using the Service at any time by:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Revoking Gmail access through your Google Account settings</li>
              <li>Clearing your browser's local storage</li>
              <li>Simply stopping use of the application</li>
            </ul>
            <p className="mt-4">
              We reserve the right to suspend or terminate access to the Service at any time, with
              or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of any
              material changes by updating the "Last updated" date. Your continued use of the Service
              after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws,
              without regard to conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us through our support
              channels.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">14. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions
              will remain in full force and effect.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
