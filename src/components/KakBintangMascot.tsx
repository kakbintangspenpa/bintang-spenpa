import React, { useState } from 'react';
import { Sparkles, Volume2, Settings2 } from 'lucide-react';
import { playPop, speakKakBintang } from '../utils/audio';

interface KakBintangMascotProps {
  expression?: 'happy' | 'thinking' | 'celebrating' | 'talking';
  speechBubbleText?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showVoiceButton?: boolean;
  onOpenVoiceSettings?: () => void;
  className?: string;
}

export const KakBintangMascot: React.FC<KakBintangMascotProps> = ({
  expression = 'happy',
  speechBubbleText,
  size = 'md',
  showVoiceButton = true,
  onOpenVoiceSettings,
  className = '',
}) => {
  const [isWinking, setIsWinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleClickMascot = () => {
    playPop();
    setIsWinking(true);
    setTimeout(() => setIsWinking(false), 1000);
  };

  const handleVoicePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (speechBubbleText) {
      setIsSpeaking(true);
      speakKakBintang(speechBubbleText, () => setIsSpeaking(false));
    }
  };

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28 sm:w-32 sm:h-32',
    lg: 'w-40 h-40 sm:w-44 sm:h-44',
  };

  return (
    <div className={`relative flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full justify-center md:justify-end ${className}`}>
      {/* Speech Bubble */}
      {speechBubbleText && (
        <div className="relative w-full max-w-[340px] sm:max-w-md bg-white border-2 border-amber-300 rounded-2xl p-3 sm:p-3.5 shadow-lg shadow-amber-100/50 text-slate-800 text-xs sm:text-sm leading-relaxed animate-fade-in z-10">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1 font-bold text-amber-700 text-[10px] sm:text-xs uppercase tracking-wider mb-1 bg-amber-50 px-2 sm:px-2.5 py-0.5 rounded-full border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
                Kak Bintang Berkata:
              </span>
              <p className="font-medium text-slate-700 text-xs sm:text-sm mt-0.5">{speechBubbleText}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {showVoiceButton && (
                <button
                  type="button"
                  onClick={handleVoicePlay}
                  title="Dengarkan Suara Kak Bintang"
                  className={`p-2 sm:p-1.5 rounded-full transition-all cursor-pointer min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 flex items-center justify-center ${
                    isSpeaking
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
              {onOpenVoiceSettings && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playPop();
                    onOpenVoiceSettings();
                  }}
                  title="Atur Suara & Tempo Kak Bintang"
                  className="p-2 sm:p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-800 transition cursor-pointer min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          {/* Bubble Arrow pointing to mascot */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 sm:left-auto sm:-right-2 sm:top-8 sm:translate-x-0 w-3.5 h-3.5 bg-white border-r-2 border-b-2 border-amber-300 transform rotate-45 sm:-rotate-45"></div>
        </div>
      )}

      {/* Male Student Character Mascot (Kak Bintang - Siswa Laki-Laki Berprestasi) */}
      <div
        onClick={handleClickMascot}
        className={`cursor-pointer select-none relative group transform transition-transform duration-300 hover:scale-105 active:scale-95 ${
          expression === 'celebrating' ? 'animate-bounce' : 'animate-float'
        }`}
        title="Halo! Aku Kak Bintang, siswa pembina karakter anak Indonesia!"
      >
        <svg
          className={`${sizeClasses[size]} drop-shadow-md`}
          viewBox="0 0 200 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Skin Gradient */}
            <linearGradient id="skinGrad" x1="100" y1="50" x2="100" y2="135" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffe6cf" />
              <stop offset="1" stopColor="#fcd2a9" />
            </linearGradient>

            {/* Hair Gradient */}
            <linearGradient id="hairGrad" x1="100" y1="20" x2="100" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#452c1e" />
              <stop offset="0.5" stopColor="#2c1a11" />
              <stop offset="1" stopColor="#1a0f0a" />
            </linearGradient>

            {/* Hair Highlight */}
            <linearGradient id="hairHighlight" x1="80" y1="35" x2="120" y2="55" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7a533b" stopOpacity="0.8" />
              <stop offset="1" stopColor="#452c1e" stopOpacity="0" />
            </linearGradient>

            {/* Star Badge Gradient */}
            <linearGradient id="goldStar" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#fef08a" />
              <stop offset="0.6" stopColor="#facc15" />
              <stop offset="1" stopColor="#eab308" />
            </linearGradient>

            {/* Rosy Cheek Glow */}
            <radialGradient id="boyCheek" cx="0.5" cy="0.5" r="0.5">
              <stop stopColor="#fb7185" stopOpacity="0.55" />
              <stop offset="1" stopColor="#fb7185" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Soft Golden Aura */}
          <circle cx="100" cy="110" r="90" fill="#fef3c7" opacity="0.65" />
          <circle cx="100" cy="110" r="75" fill="#fde68a" opacity="0.4" className="animate-pulse" />

          {/* Body & Indonesian Student Uniform (Kemeja Putih Siswa) */}
          <g id="uniform">
            {/* White Shirt Torso */}
            <path
              d="M 52,165 
                 C 55,145 70,140 85,138 
                 L 115,138 
                 C 130,140 145,145 148,165 
                 L 155,215 
                 L 45,215 Z"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="2.5"
            />

            {/* Red Indonesian Student Tie / Dasi Merah */}
            <path
              d="M 96,144 
                 L 104,144 
                 L 106,175 
                 L 100,185 
                 L 94,175 Z"
              fill="#dc2626"
            />
            {/* Tie Knot */}
            <polygon points="94,140 106,140 104,147 96,147" fill="#b91c1c" />

            {/* Shirt Collar (Kerah Kemeja) */}
            <path d="M 82,138 L 96,148 L 74,152 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M 118,138 L 104,148 L 126,152 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Shirt Center Line and Buttons */}
            <line x1="100" y1="148" x2="100" y2="215" stroke="#e2e8f0" strokeWidth="1.5" />
            <circle cx="100" cy="192" r="2" fill="#94a3b8" />
            <circle cx="100" cy="205" r="2" fill="#94a3b8" />

            {/* Golden Star Pin Badge (Pin Bintang Prestasi) on Chest Pocket */}
            <g transform="translate(125, 170)">
              <rect x="-8" y="-4" width="16" height="14" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              {/* Mini Star Pin */}
              <polygon
                points="0,-6 2,-1 7,-1 3,2 5,7 0,4 -5,7 -3,2 -7,-1 -2,-1"
                fill="url(#goldStar)"
                stroke="#ca8a04"
                strokeWidth="0.8"
              />
            </g>
          </g>

          {/* Neck */}
          <rect x="90" y="122" width="20" height="20" rx="4" fill="#fcd2a9" />

          {/* Ears */}
          <ellipse cx="60" cy="98" rx="8" ry="11" fill="url(#skinGrad)" stroke="#f59e0b" strokeWidth="1" />
          <path d="M 60 94 Q 63 98 60 102" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

          <ellipse cx="140" cy="98" rx="8" ry="11" fill="url(#skinGrad)" stroke="#f59e0b" strokeWidth="1" />
          <path d="M 140 94 Q 137 98 140 102" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

          {/* Head Shape */}
          <ellipse cx="100" cy="95" rx="38" ry="42" fill="url(#skinGrad)" />

          {/* Rosy Cheeks */}
          <circle cx="76" cy="107" r="9" fill="url(#boyCheek)" />
          <circle cx="124" cy="107" r="9" fill="url(#boyCheek)" />

          {/* Boy's Hair (Rambut Siswa Laki-Laki yang Rapi & Keren) */}
          <g id="hair">
            {/* Back/Top hair volume */}
            <path
              d="M 60,90 
                 C 55,60 70,30 100,28 
                 C 130,30 145,60 140,90 
                 C 136,75 132,60 120,52 
                 C 105,42 95,45 80,52 
                 C 68,60 64,75 60,90 Z"
              fill="url(#hairGrad)"
            />

            {/* Front Bangs (Poni Rambut Siswa Laki-Laki) */}
            <path
              d="M 63,78 
                 C 72,55 90,52 105,58 
                 C 115,55 128,62 137,75 
                 C 133,70 125,66 116,66 
                 C 102,66 94,76 86,76 
                 C 78,76 70,82 63,78 Z"
              fill="url(#hairGrad)"
            />

            {/* Hair Side Strands */}
            <path d="M 61,72 L 64,88 L 68,78 Z" fill="#2c1a11" />
            <path d="M 139,72 L 136,88 L 132,78 Z" fill="#2c1a11" />

            {/* Hair Top Tuft / Highlight Arc */}
            <path
              d="M 85,38 Q 100,32 118,40"
              stroke="url(#hairHighlight)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Eyebrows */}
          <g id="eyebrows">
            {expression === 'thinking' ? (
              <>
                <path d="M 74,80 Q 83,75 92,81" stroke="#2c1a11" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 108,83 Q 117,76 126,80" stroke="#2c1a11" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <path d="M 75,82 Q 84,77 93,81" stroke="#2c1a11" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 107,81 Q 116,77 125,82" stroke="#2c1a11" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </>
            )}
          </g>

          {/* Eyes */}
          <g id="eyes">
            {isWinking ? (
              // Winking: Left eye curved wink, Right eye wide open
              <>
                <path d="M 75,95 Q 84,87 93,95" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <ellipse cx="116" cy="94" rx="7.5" ry="8.5" fill="#1e293b" />
                <circle cx="114" cy="91" r="3" fill="#ffffff" />
                <circle cx="118" cy="97" r="1.5" fill="#ffffff" />
              </>
            ) : expression === 'thinking' ? (
              // Looking up thoughtfully
              <>
                <ellipse cx="84" cy="91" rx="7" ry="8" fill="#1e293b" />
                <circle cx="85" cy="88" r="3" fill="#ffffff" />
                <ellipse cx="116" cy="91" rx="7" ry="8" fill="#1e293b" />
                <circle cx="117" cy="88" r="3" fill="#ffffff" />
              </>
            ) : expression === 'celebrating' ? (
              // Joyful curved laughing eyes (^ ^)
              <>
                <path d="M 74,95 Q 84,86 94,95" stroke="#1e293b" strokeWidth="3.8" strokeLinecap="round" fill="none" />
                <path d="M 106,95 Q 116,86 126,95" stroke="#1e293b" strokeWidth="3.8" strokeLinecap="round" fill="none" />
              </>
            ) : (
              // Sparkling big eyes
              <>
                <ellipse cx="84" cy="94" rx="7.5" ry="8.5" fill="#1e293b" />
                <circle cx="82" cy="91" r="3" fill="#ffffff" />
                <circle cx="86" cy="97" r="1.5" fill="#ffffff" />

                <ellipse cx="116" cy="94" rx="7.5" ry="8.5" fill="#1e293b" />
                <circle cx="114" cy="91" r="3" fill="#ffffff" />
                <circle cx="118" cy="97" r="1.5" fill="#ffffff" />
              </>
            )}
          </g>

          {/* Cute Nose */}
          <path d="M 98,99 Q 100,103 103,101" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Cheerful Mouth */}
          <g id="mouth">
            {expression === 'talking' || isSpeaking ? (
              // Open cheerful talking mouth
              <path
                d="M 92,109 Q 100,123 108,109 Z"
                fill="#e11d48"
                stroke="#9f1239"
                strokeWidth="2"
              />
            ) : expression === 'celebrating' ? (
              // Big joyful laugh with teeth
              <g>
                <path
                  d="M 88,108 Q 100,126 112,108 Z"
                  fill="#be123c"
                  stroke="#881337"
                  strokeWidth="2"
                />
                <path d="M 92,110 Q 100,114 108,110" stroke="#ffffff" strokeWidth="2.5" fill="none" />
              </g>
            ) : (
              // Warm friendly smile
              <path
                d="M 90,110 Q 100,120 110,110"
                stroke="#1e293b"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>

          {/* Hands & Gestures */}
          {expression === 'celebrating' ? (
            // Thumbs-up gesture (Jempol Mantap!)
            <g transform="translate(155, 135)">
              <circle cx="10" cy="10" r="12" fill="#ffe6cf" stroke="#f59e0b" strokeWidth="1.5" />
              {/* Thumb sticking up */}
              <path d="M 8,10 L 8,0 C 8,-4 13,-4 13,0 L 13,10 Z" fill="#ffe6cf" stroke="#f59e0b" strokeWidth="1.5" />
            </g>
          ) : expression === 'thinking' ? (
            // Hand on chin
            <g transform="translate(108, 118)">
              <ellipse cx="6" cy="6" rx="9" ry="7" fill="#ffe6cf" stroke="#f59e0b" strokeWidth="1.5" />
            </g>
          ) : (
            // Waving hand
            <g transform="translate(148, 140)" className="group-hover:rotate-12 transition-transform origin-bottom-left">
              <path
                d="M 4,14 C 4,6 10,4 12,8 C 13,5 17,5 18,8 C 19,6 23,7 23,10 L 23,18 C 23,24 15,28 8,24 Z"
                fill="#ffe6cf"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Floating Star Badges near head */}
          <polygon
            points="170,45 173,53 182,53 175,58 178,66 170,61 162,66 165,58 158,53 167,53"
            fill="url(#goldStar)"
            className="animate-sparkle"
          />
        </svg>

        {/* Hover pill */}
        <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap flex items-center gap-1">
          Kak Bintang 👦🏻✨
        </span>
      </div>
    </div>
  );
};
