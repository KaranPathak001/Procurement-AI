import React from 'react';

interface ChairIconProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Custom SVG ergonomic office chair icon — side profile view.
 * Shows: high backrest with lumbar curve, armrest, contoured seat,
 * gas-lift cylinder, and 5-star base with caster wheels.
 */
export const ChairIcon: React.FC<ChairIconProps> = ({
  className = 'w-6 h-6',
  size = 24,
  color = 'currentColor',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* ── High Ergonomic Backrest (with lumbar curve) ── */}
      <path
        d="M10 4 C10 4 8 6 8 10 L8 26 C8 28 9 29 11 29 L16 29 C18 29 19 28 19 26 L19 10 C19 6 17 4 14.5 4 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Lumbar support inner detail */}
      <path
        d="M11 20 C11.5 22.5 16.5 22.5 17 20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* ── Armrest ── */}
      <path
        d="M17 17 L28 17 C29.1 17 30 17.9 30 19 L30 20 C30 21.1 29.1 22 28 22 L17 22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Contoured Seat ── */}
      <path
        d="M8 29 L8 31 C8 32.5 9.5 34 11 34 L34 34 C36 34 37 33 37 31.5 L37 30 C37 28.5 35.5 27 34 27 L11 27 C9.5 27 8 27.8 8 29 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Gas Lift Cylinder ── */}
      <line x1="22" y1="34" x2="22" y2="40" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Height-adjustment collar */}
      <rect x="19.5" y="38" width="5" height="2" rx="1" stroke={color} strokeWidth="1.5" fill="none" />

      {/* ── 5-Star Base ── */}
      {/* Center hub */}
      <circle cx="22" cy="42" r="1.5" stroke={color} strokeWidth="1.5" fill="none" />
      {/* 5 arms radiating out */}
      <line x1="22" y1="42" x2="10" y2="45" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="42" x2="34" y2="45" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="42" x2="16" y2="46" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="42" x2="28" y2="46" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="42" x2="22" y2="46" stroke={color} strokeWidth="1.5" strokeLinecap="round" />

      {/* ── Caster Wheels ── */}
      <circle cx="10" cy="45.5" r="1.2" stroke={color} strokeWidth="1.2" fill="none" />
      <circle cx="34" cy="45.5" r="1.2" stroke={color} strokeWidth="1.2" fill="none" />
      <circle cx="16" cy="46.5" r="1.2" stroke={color} strokeWidth="1.2" fill="none" />
      <circle cx="28" cy="46.5" r="1.2" stroke={color} strokeWidth="1.2" fill="none" />
      <circle cx="22" cy="46.5" r="1.2" stroke={color} strokeWidth="1.2" fill="none" />
    </svg>
  );
};
