import React from 'react';

interface RatingStarsProps {
  rating: number;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, totalReviews, size = 'sm' }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<span key={i} className="text-yellow-500">★</span>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<span key={i} className="text-yellow-500">★</span>); // Về CSS có thể cắt nửa sao, tạm dùng full sao
    } else {
      stars.push(<span key={i} className="text-gray-300">★</span>);
    }
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
      <div className="flex">{stars}</div>
      {totalReviews !== undefined && (
        <span className="text-gray-500 text-xs ml-1 hover:underline cursor-pointer">
          {totalReviews}
        </span>
      )}
    </div>
  );
};
