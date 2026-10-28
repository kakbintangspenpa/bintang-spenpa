import React from 'react';
import { Sparkles, Star } from 'lucide-react';

interface AnimatedAppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const AnimatedAppLogo: React.FC<AnimatedAppLogoProps> = ({
  size = 'lg',
  showSubtitle = true,
  className = '',
}) => {
  // Size presets
  const sizeMap = {
    sm: {
      wrapper: 'w-14 h-14',
      star: 'w-8 h-8',
      title: 'text-lg',
      badge: 'text-[10px]',
    },
    md: {
      wrapper: 'w-20 h-20',
      star: 'w-12 h-12',
      title: 'text-2xl',
      badge: 'text-xs',
    },
    lg: {
      wrapper: 'w-28 h-28',
      star: 'w-16 h-16',
      title: 'text-3xl sm:text-4xl',
      badge: 'text-xs sm:text-sm',
    },
    xl: {
      wrapper: 'w-36 h-36',
      star: 'w-20 h-20',
      title: 'text-4xl sm:text-5xl',
      badge: 'text-sm sm:text-base',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      {/* Animated Logo Container with Gentle Floating & Glowing Aura */}
      <div className="relative group flex items-center justify-center p-3">
        {/* Soft Ambient Radial Glow Layers */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/30 via-yellow-300/40 to-emerald-400/25 rounded-full blur-2xl animate-pulse-soft pointer-events-none" />
        <div className="absolute inset-2 bg-radial from-amber-200/50 via-yellow-100/30 to-transparent rounded-full blur-md animate-pulse pointer-events-none" />

        {/* Orbiting Sparkles */}
        <div className="absolute -top-1 -right-1 text-amber-500 animate-bounce pointer-events-none delay-100">
          <Sparkles className="w-5 h-5 drop-shadow-md" />
        </div>
        <div className="absolute -bottom-1 -left-1 text-emerald-500 animate-pulse pointer-events-none delay-300">
          <Sparkles className="w-4 h-4 drop-shadow-md" />
        </div>
        <div className="absolute top-1/2 -right-3 text-orange-400 animate-spin-slow pointer-events-none">
          <Star className="w-3.5 h-3.5 fill-current" />
        </div>

        {/* The Main Logo Emblem with Smooth Floating Keyframe */}
        <div
          className={`${currentSize.wrapper} relative rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-1 shadow-xl shadow-amber-500/20 ring-4 ring-white/80 animate-float transition-transform duration-500 hover:scale-105 flex items-center justify-center`}
        >
          {/* Inner Badge Frame */}
          <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-yellow-300 via-amber-400 to-orange-400 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            {/* Soft Light Sheen Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

            {/* Kak Bintang Mascot Face Graphic (High-Fidelity SVG) */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full p-2 drop-shadow-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF3B0" />
                  <stop offset="50%" stopColor="#FFD13B" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
                <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DC2626" />
                  <stop offset="100%" stopColor="#991B1B" />
                </linearGradient>
                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Five-point Star Body with Smooth Rounded Corners */}
              <polygon
                points="50,6 63,33 93,37 71,58 76,88 50,74 24,88 29,58 7,37 37,33"
                fill="url(#starGrad)"
                stroke="#D97706"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Sparkly Star Cheeks Blush */}
              <circle cx="36" cy="56" r="4.5" fill="#F87171" opacity="0.65" />
              <circle cx="64" cy="56" r="4.5" fill="#F87171" opacity="0.65" />

              {/* Friendly Big Eyes with Light Catchers */}
              <ellipse cx="38" cy="46" rx="4" ry="5.5" fill="#1E293B" />
              <circle cx="36.5" cy="44" r="1.6" fill="#FFFFFF" />
              <ellipse cx="62" cy="46" rx="4" ry="5.5" fill="#1E293B" />
              <circle cx="60.5" cy="44" r="1.6" fill="#FFFFFF" />

              {/* Cheerful Friendly Smile */}
              <path
                d="M43 56 Q50 63 57 56"
                stroke="#78350F"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />

              {/* Indonesian Student Scout / Red-White Character Ribbon */}
              <g transform="translate(0, 7) scale(0.9) translate(5, 0)">
                <path
                  d="M44 78 L50 85 L56 78 Z"
                  fill="#EF4444"
                  stroke="#B91C1C"
                  strokeWidth="0.8"
                />
                <circle cx="50" cy="77" r="3" fill="#FFFFFF" stroke="#EF4444" strokeWidth="1" />
              </g>

              {/* Top Star Sparkle Highlight */}
              <circle cx="48" cy="18" r="2" fill="#FFFFFF" opacity="0.9" />
            </svg>

            {/* Small Character Ribbon "7" Badge at bottom */}
            <div className="absolute -bottom-1 bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-white shadow-sm flex items-center gap-0.5">
              <span>7</span>
              <span className="text-[8px] font-semibold">HEBAT</span>
            </div>
          </div>
        </div>
      </div>

      {showSubtitle && (
        <div className="mt-3 space-y-1">
          {/* Main App Title */}
          <div className="flex items-center justify-center gap-2">
            <h1
              className={`${currentSize.title} font-extrabold tracking-tight text-slate-900 font-display drop-shadow-xs`}
            >
              Kak Bintang
            </h1>
            <span className="inline-block animate-wave text-xl sm:text-2xl">✨</span>
          </div>

          {/* Subtitle Badge */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <span
              className={`${currentSize.badge} inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 font-bold border border-emerald-300 shadow-2xs`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              7 Kebiasaan Anak Indonesia Hebat
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              • Menuju Generasi Emas 🇮🇩
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
