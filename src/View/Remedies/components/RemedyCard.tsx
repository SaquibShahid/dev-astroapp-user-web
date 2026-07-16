import { IconCheck } from '@tabler/icons-react';
import React from 'react';
import { Link } from 'react-router-dom';
import type { Remedy } from '../../../store/useRemedyStore';

interface RemedyCardProps {
  remedy: Remedy;
  categoryId: string;
}

const RemedyCard: React.FC<RemedyCardProps> = ({ remedy, categoryId }) => {
  const hasDiscount = remedy.discountPrice !== undefined && remedy.discountPrice < remedy.basePrice;

  return (
    <Link
      to={`/remedies/${categoryId}/${remedy._id}`}
      className="bg-bg rounded-2xl border border-border p-5 flex flex-col sm:flex-row gap-4 hover:border-primary/30 transition-colors"
    >
      <img
        src={remedy.images[0]}
        alt={remedy.title}
        className="w-full sm:w-28 h-40 sm:h-28 rounded-xl object-cover flex-shrink-0"
      />

      <div className="min-w-0 flex-1 flex flex-col">
        <p className="font-bold text-primary">{remedy.title}</p>
        <p className="text-sm text-text-muted mt-1 line-clamp-2">{remedy.description}</p>

        {remedy.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {remedy.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 bg-bg-soft text-text-muted text-xs font-medium px-2.5 py-1 rounded-full"
              >
                <IconCheck size={12} className="text-primary" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 mt-4">
          <div className="flex items-baseline gap-2">
            {hasDiscount && <span className="text-sm text-text-light line-through">₹{remedy.basePrice}</span>}
            <span className="font-bold text-text-main">₹{hasDiscount ? remedy.discountPrice : remedy.basePrice}</span>
          </div>
          <span className="bg-accent text-primary-dark font-semibold text-sm px-5 py-2 rounded-xl">Book Now</span>
        </div>
      </div>
    </Link>
  );
};

export default RemedyCard;
