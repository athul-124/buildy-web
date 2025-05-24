"use client";

import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingDisplayProps {
  rating: number;
  maxRating?: number;
  starSize?: number;
  className?: string;
  showText?: boolean;
  reviewCount?: number;
}

export function RatingDisplay({
  rating,
  maxRating = 5,
  starSize = 16,
  className,
  showText = false,
  reviewCount,
}: RatingDisplayProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="currentColor" size={starSize} className="text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf key="half" fill="currentColor" size={starSize} className="text-yellow-400" />}
      {[...Array(emptyStars > 0 ? emptyStars : 0)].map((_, i) => ( // Ensure emptyStars is not negative
        <Star key={`empty-${i}`} size={starSize} className="text-yellow-400 opacity-50" />
      ))}
      {showText && (
        <span className="ml-1 text-sm text-muted-foreground">
          {rating.toFixed(1)}
          {reviewCount !== undefined && ` (${reviewCount} reviews)`}
        </span>
      )}
    </div>
  );
}
