'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { GlobalOutlined } from '@ant-design/icons';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="group relative overflow-hidden rounded-full p-[2px] transition-all duration-500 hover:scale-105 active:scale-95"
      aria-label="Toggle language"
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#da251d] via-[#ffcd00] to-[#da251d] opacity-75 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all duration-500 animate-gradient-x" />
      
      {/* Liquid glass container */}
      <div className="relative flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 px-1 py-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300">
        {/* Glass reflection overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
        
        {/* Vietnamese option */}
        <div
          className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 ${
            language === 'vi'
              ? 'bg-gradient-to-r from-[#da251d]/80 to-[#ff6b35]/80 shadow-[0_0_20px_rgba(218,37,29,0.4)] text-white'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#da251d] to-[#da251d] border border-[#ffcd00] flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">V</span>
          </div>
          <span className="font-medium text-sm">VI</span>
          
          {/* Active glow effect */}
          {language === 'vi' && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#da251d] to-[#ffcd00] opacity-20 blur-xl animate-pulse" />
          )}
        </div>

        {/* Divider with glass effect */}
        <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/30 to-transparent" />

        {/* English option */}
        <div
          className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 ${
            language === 'en'
              ? 'bg-gradient-to-r from-[#1d4ed8]/80 to-[#3b82f6]/80 shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] border border-white/30 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">E</span>
          </div>
          <span className="font-medium text-sm">EN</span>
          
          {/* Active glow effect */}
          {language === 'en' && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] opacity-20 blur-xl animate-pulse" />
          )}
        </div>
      </div>

      {/* Liquid ripple effect on hover */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#da251d]/20 via-[#ffcd00]/20 to-[#da251d]/20 animate-shimmer" />
      </div>
    </button>
  );
}

export function LanguageToggleCompact() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label="Toggle language"
    >
      {/* Liquid glass background */}
      <div className="relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/10 hover:border-white/20 transition-all duration-300">
        {/* Glass shine effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 flex items-center gap-3">
          {/* Globe icon */}
          <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center justify-center bg-gradient-to-br from-[#da251d]/20 to-[#ffcd00]/20">
            <GlobalOutlined className={`text-lg transition-all duration-500 ${
              language === 'vi' ? 'text-[#da251d]' : 'text-[#3b82f6]'
            }`} />
          </div>

          {/* Language text with liquid slide */}
          <div className="relative h-5 overflow-hidden min-w-[80px]">
            <span
              className={`absolute left-0 font-medium text-white/90 transition-all duration-500 ${
                language === 'vi' ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
              }`}
            >
              Tiếng Việt
            </span>
            <span
              className={`absolute left-0 font-medium text-white/90 transition-all duration-500 ${
                language === 'en' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            >
              English
            </span>
          </div>

          {/* Toggle indicator */}
          <div className="relative w-12 h-6 rounded-full bg-black/30 border border-white/10 p-0.5">
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.3)] ${
                language === 'vi'
                  ? 'left-0.5 bg-gradient-to-br from-[#da251d] to-[#ff6b35]'
                  : 'left-[calc(100%-22px)] bg-gradient-to-br from-[#1d4ed8] to-[#3b82f6]'
              }`}
            >
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
