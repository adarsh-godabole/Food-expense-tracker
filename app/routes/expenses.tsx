import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import type { Route } from "./+types/expenses";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Food Delivery Expenses" },
    { name: "description", content: "Track your Swiggy and Zomato expenses" },
  ];
}

type Platform = "swiggy" | "zomato";

interface Transaction {
  id: string;
  date: string;
  platform: Platform;
  amount: number;
  description: string;
  items?: string[];
  restaurantName?: string;
}

export default function Expenses() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<"all" | Platform>("all");

  // Date range state
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("gmail_access_token");
    if (!token && !searchParams.get("access_token")) {
      navigate("/");
    }
  }, [navigate, searchParams]);

  // Load transactions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("foodExpenses");
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored transactions", e);
      }
    }
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const token = searchParams.get("access_token");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("Authentication failed. Please try again.");
      setSearchParams({});
    } else if (token) {
      setAccessToken(token);
      localStorage.setItem("gmail_access_token", token);
      setSearchParams({});
      fetchOrdersFromGmail(token);
    } else {
      const storedToken = localStorage.getItem("gmail_access_token");
      if (storedToken) {
        setAccessToken(storedToken);
      }
    }
  }, [searchParams, setSearchParams]);

  // Save to localStorage
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("foodExpenses", JSON.stringify(transactions));
    }
  }, [transactions]);

  const fetchOrdersFromGmail = async (token: string) => {
    setIsSyncing(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/fetch-orders?access_token=${encodeURIComponent(token)}&start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const existingIds = new Set(transactions.map((t) => t.id));
      const newTransactions = data.orders.filter(
        (order: Transaction) => !existingIds.has(order.id)
      );

      if (newTransactions.length > 0) {
        const merged = [...newTransactions, ...transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTransactions(merged);
        alert(`Successfully imported ${newTransactions.length} new orders!`);
      } else {
        alert("No new orders found.");
      }
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to fetch orders from Gmail");
      if (err.message?.includes("invalid")) {
        localStorage.removeItem("gmail_access_token");
        setAccessToken(null);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleGmailSync = () => {
    if (accessToken) {
      fetchOrdersFromGmail(accessToken);
    } else {
      window.location.href = "/api/auth";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("gmail_access_token");
    localStorage.removeItem("foodExpenses");
    setAccessToken(null);
    navigate("/");
  };

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        const inDateRange = transactionDate >= start && transactionDate <= end;
        const matchesPlatform = filterPlatform === "all" || t.platform === filterPlatform;
        return inDateRange && matchesPlatform;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, startDate, endDate, filterPlatform]);

  // Calculate totals
  const swiggyTotal = filteredTransactions
    .filter((t) => t.platform === "swiggy")
    .reduce((sum, t) => sum + t.amount, 0);

  const zomatoTotal = filteredTransactions
    .filter((t) => t.platform === "zomato")
    .reduce((sum, t) => sum + t.amount, 0);

  const grandTotal = swiggyTotal + zomatoTotal;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Food Expense Tracker
                </h1>
                <p className="text-xs text-gray-500">
                  Swiggy & Zomato Analytics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleGmailSync}
                disabled={isSyncing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                {isSyncing ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Sync
                  </>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Swiggy Total
              </span>
              <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded">
                SWIGGY
              </span>
            </div>
            <div className="text-3xl font-bold text-orange-600">
              ₹{swiggyTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {filteredTransactions.filter(t => t.platform === "swiggy").length} orders
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Zomato Total
              </span>
              <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">
                ZOMATO
              </span>
            </div>
            <div className="text-3xl font-bold text-red-600">
              ₹{zomatoTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {filteredTransactions.filter(t => t.platform === "zomato").length} orders
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white/90">
                Grand Total
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold">
              ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-white/80 mt-1">
              {filteredTransactions.length} total orders
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Date Range Filter
          </h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                📅 Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 bg-purple-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-colors font-medium"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                📅 End Date111
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 bg-purple-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-colors font-medium"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterPlatform("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterPlatform === "all"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterPlatform("swiggy")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterPlatform === "swiggy"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Swiggy
              </button>
              <button
                onClick={() => setFilterPlatform("zomato")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterPlatform === "zomato"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Zomato
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Order History
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredTransactions.length} orders from {startDate} to {endDate}
            </p>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-gray-500 text-lg font-medium">No orders found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters or sync with Gmail
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            transaction.platform === "swiggy"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {transaction.platform.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {transaction.restaurantName || transaction.platform === "swiggy" ? "Swiggy" : "Zomato"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {transaction.items && transaction.items.length > 0 ? (
                          <div className="max-w-md">
                            <div className="flex flex-wrap gap-1">
                              {transaction.items.slice(0, 3).map((item, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                                >
                                  {item}
                                </span>
                              ))}
                              {transaction.items.length > 3 && (
                                <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">
                                  +{transaction.items.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-xs">No items found</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                        ₹{transaction.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
