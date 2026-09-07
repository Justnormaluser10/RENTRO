import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitle?: string;
  onClick?: () => void;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  subtitle = 'Ahmedabad • Self-Drive',
  onClick,
  className = '',
}) => {
  const sizeClasses = {
    sm: {
      box: 'w-8 h-8 rounded-xl',
      r: 'text-base',
      dot: 'w-1.5 h-1.5',
      title: 'text-lg',
      sub: 'text-[9px]',
      gap: 'gap-2',
    },
    md: {
      box: 'w-10 h-10 rounded-2xl',
      r: 'text-xl',
      dot: 'w-2 h-2',
      title: 'text-xl',
      sub: 'text-[10px]',
      gap: 'gap-2.5',
    },
    lg: {
      box: 'w-12 h-12 rounded-2xl',
      r: 'text-2xl',
      dot: 'w-2.5 h-2.5',
      title: 'text-2xl',
      sub: 'text-xs',
      gap: 'gap-3',
    },
  }[size];

  const content = (
    <div className={`flex items-center ${sizeClasses.gap} group select-none ${className}`}>
      {/* Sleek metallic squircle badge with pulse dot */}
      <div
        className={`${sizeClasses.box} bg-gradient-to-br from-[#111624] to-[#0a0d14] border border-white/15 flex items-center justify-center text-white shadow-md group-hover:border-[#00f2aa]/50 transition-all shrink-0`}
      >
        <span className={`font-black ${sizeClasses.r} tracking-tight flex items-center leading-none`}>
          R
          <span className={`${sizeClasses.dot} rounded-full bg-[#00f2aa] inline-block ml-0.5 animate-pulse`}></span>
        </span>
      </div>

      {/* Brand typography */}
      <div className="text-left">
        <span className={`${sizeClasses.title} font-black tracking-tight text-white block leading-tight`}>
          RENTRO
        </span>
        {showSubtitle && (
          <span className={`${sizeClasses.sub} font-bold text-[#00f2aa] tracking-widest uppercase block leading-tight`}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer focus:outline-none text-left"
      >
        {content}
      </button>
    );
  }

  return content;
};

export default Logo;
