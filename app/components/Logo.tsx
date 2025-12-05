export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      aria-label="Food Expense Tracker Logo"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#8B5CF6", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#EC4899", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Background circle */}
      <circle cx="50" cy="50" r="45" fill="url(#logo-grad)" />

      {/* Plate */}
      <ellipse cx="50" cy="55" rx="28" ry="26" fill="white" opacity="0.95" />
      <ellipse cx="50" cy="55" rx="23" ry="21" fill="url(#logo-grad)" opacity="0.1" />

      {/* Fork */}
      <g transform="translate(35, 30)">
        <rect x="5" y="0" width="2" height="35" fill="white" rx="1" />
        <rect x="2" y="0" width="1.5" height="20" fill="white" rx="0.5" />
        <rect x="8" y="0" width="1.5" height="20" fill="white" rx="0.5" />
        <rect x="0" y="0" width="1.5" height="15" fill="white" rx="0.5" />
      </g>

      {/* Knife */}
      <g transform="translate(55, 30)">
        <rect x="5" y="0" width="2" height="35" fill="white" rx="1" />
        <path d="M 4 0 L 8 0 L 7 12 L 5 12 Z" fill="white" />
      </g>

      {/* Currency symbol (Rupee) */}
      <text
        x="50"
        y="67"
        fontFamily="Arial, sans-serif"
        fontSize="18"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
      >
        ₹
      </text>
    </svg>
  );
}
