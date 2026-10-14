import React from 'react';

export interface LogoProps {
  variant?: 'light' | 'dark' | 'lime' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  subtitle?: string;
  onClick?: () => void;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
  subtitle = 'Vadodara • Ahmedabad',
  onClick,
  className = '',
}) => {
  // Height classes for responsive sizing while preserving 403:100 aspect ratio
  const heightClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10 sm:h-11',
    xl: 'h-12 sm:h-16',
  }[size];

  const subtitleClasses = {
    sm: 'text-[9px] tracking-[0.2em] mt-1',
    md: 'text-[10px] tracking-[0.25em] mt-1.5',
    lg: 'text-xs tracking-[0.28em] mt-2',
    xl: 'text-xs sm:text-sm tracking-[0.3em] mt-2.5',
  }[size];

  // Which logo SVG asset to display
  const logoSrc = {
    light: '/rentro-logo-white.svg',
    dark: '/rentro-logo-black.svg',
    lime: '/rentro-logo-lime.svg',
    badge: '/rentro-logo-black.svg',
  }[variant];

  // If badge variant is chosen, render the white squircle card featured on PDF Page 1 & 10
  if (variant === 'badge') {
    const badgeContent = (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 border border-slate-200/80 flex items-center justify-center transition-transform hover:scale-[1.02]">
          <img
            src="/rentro-logo-black.svg"
            alt="RENTRO"
            className={`${heightClasses} w-auto object-contain`}
            loading="eager"
          />
        </div>
        {showSubtitle && (
          <span className={`font-black uppercase text-[#bef237] ${subtitleClasses} text-center font-mono`}>
            {subtitle}
          </span>
        )}
      </div>
    );

    if (onClick) {
      return (
        <button
          type="button"
          onClick={onClick}
          className="cursor-pointer focus:outline-none transition-opacity hover:opacity-95"
          aria-label="Rentro Home"
        >
          {badgeContent}
        </button>
      );
    }
    return badgeContent;
  }

  // Standard inline brand logo
  const inlineContent = (
    <div className={`inline-flex flex-col select-none group ${className}`}>
      <div className="flex items-center">
        <img
          src={logoSrc}
          alt="RENTRO"
          className={`${heightClasses} w-auto object-contain transition-transform group-hover:scale-[1.01]`}
          loading="eager"
        />
      </div>

      {showSubtitle && (
        <span
          className={`font-bold uppercase text-[#bef237] font-mono leading-none ${subtitleClasses} group-hover:text-white transition-colors`}
        >
          {subtitle}
        </span>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer focus:outline-none text-left"
        aria-label="Rentro Home"
      >
        {inlineContent}
      </button>
    );
  }

  return inlineContent;
};

export default Logo;
