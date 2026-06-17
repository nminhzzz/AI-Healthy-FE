import React from 'react';

interface RatingStarsProps {
  rating: number;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
}

const Star: React.FC<{ fillPercent: number; sizeClass: string }> = ({ fillPercent, sizeClass }) => {
  const uniqueId = React.useId();
  return (
    <svg
      className={`${sizeClass}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={uniqueId}>
          <stop offset={`${fillPercent}%`} stopColor="#fbbf24" /> {/* amber-400 */}
          <stop offset={`${fillPercent}%`} stopColor="#e5e7eb" /> {/* gray-200 */}
        </linearGradient>
      </defs>
      <path
        d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
        fill={`url(#${uniqueId})`}
      />
    </svg>
  );
};

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, totalReviews, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const stars = [];
  for (let i = 0; i < 5; i++) {
    // Tính toán lượng phần trăm tô màu cho mỗi ngôi sao
    let fillPercent = 0;
    if (rating >= i + 1) {
      fillPercent = 100;
    } else if (rating > i) {
      fillPercent = (rating - i) * 100;
    }
    
    stars.push(
      <Star key={i} fillPercent={fillPercent} sizeClass={sizeClasses[size]} />
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">{stars}</div>
      {totalReviews !== undefined && (
        <span className="text-gray-500 text-xs ml-1 hover:underline cursor-pointer select-none">
          ({totalReviews})
        </span>
      )}
    </div>
  );
};
