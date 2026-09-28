import React from 'react';

interface AgentIconProps {
  className?: string;
  size?: number;
}

/**
 * Clean custom geometric agent / intelligent automation symbol.
 * Communicates: automation + workflow + intelligence without generic chatbot/sparkle/robot tropes.
 * Geometric connected workflow nodes and micro-processor circuit path.
 */
export const AgentIcon: React.FC<AgentIconProps> = ({ className = 'w-4 h-4', size = 16 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Central intelligent node */}
      <rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.15" />
      {/* Connected workflow routes / bus lines */}
      <path d="M4 12h4" />
      <path d="M16 12h4" />
      <path d="M12 4v4" />
      <path d="M12 16v4" />
      {/* Satellite automation nodes */}
      <circle cx="3" cy="12" r="1.5" fill="currentColor" />
      <circle cx="21" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="3" r="1.5" fill="currentColor" />
      <circle cx="12" cy="21" r="1.5" fill="currentColor" />
    </svg>
  );
};
