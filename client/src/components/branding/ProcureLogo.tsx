import React from 'react';

interface ProcureLogoProps {
  className?: string;
  size?: number;
}

export const ProcureLogo: React.FC<ProcureLogoProps> = ({ className = 'w-7 h-7', size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="procureGradient" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="arrowGradient" x1="12" y1="8" x2="28" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>

      {/* Stylized P Backbone with Dynamic Forward Arrow Movement */}
      <path
        d="M6 5C6 3.89543 6.89543 3 8 3H18C23.5228 3 28 7.47715 28 13C28 18.5228 23.5228 23 18 23H12V27C12 28.1046 11.1046 29 10 29H8C6.89543 29 6 28.1046 6 27V5Z"
        fill="url(#procureGradient)"
      />

      {/* Inner Forward Arrow Notch & Process Flow */}
      <path
        d="M12 9H17.5C19.9853 9 22 11.0147 22 13.5C22 15.9853 19.9853 18 17.5 18H12V9Z"
        fill="#050507"
      />
      <path
        d="M14 11.5L18.5 13.5L14 15.5V11.5Z"
        fill="url(#arrowGradient)"
      />
    </svg>
  );
};
