import React from 'react';

interface CosmicLoaderProps {
    message?: string;
}

const CosmicLoader: React.FC<CosmicLoaderProps> = ({ message = "Consulting the cosmos..." }) => (
  <div className="flex flex-col items-center justify-center space-y-6 text-center">
    <div className="relative w-24 h-24">
      {/* Central Pulsing Star */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-pulse-star">
        <defs>
          <radialGradient id="starGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: 'rgba(252, 211, 77, 1)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(251, 191, 36, 0)', stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="12" fill="url(#starGradient)" />
        <circle cx="50" cy="50" r="6" fill="#fefce8" />
      </svg>
      
      {/* Orbiting Paths & Bodies */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-orbit-1">
         <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(252, 211, 77, 0.2)" strokeWidth="0.5" />
         <circle cx="75" cy="50" r="2.5" fill="#fde047" />
      </svg>
       <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-orbit-2">
         <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(252, 211, 77, 0.2)" strokeWidth="0.5" />
         <circle cx="10" cy="50" r="3.5" fill="#facc15" />
      </svg>
    </div>
    <p className="text-yellow-300 text-lg font-serif">{message}</p>
  </div>
);

export default CosmicLoader;