import React from 'react';
import { Link } from 'react-router-dom';
import type { RemedyCategory } from '../../../store/useRemedyStore';

interface CategoryCardProps {
  category: RemedyCategory;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/remedies/${category._id}`}
      className="relative aspect-[4/5] rounded-2xl overflow-hidden group block"
    >
      <img
        src={category.imageUrl}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      {category.tag && (
        <span className="absolute top-3 right-3 bg-accent text-primary-dark text-xs font-bold px-2.5 py-1 rounded-full">
          {category.tag}
        </span>
      )}
      <p className="absolute bottom-4 left-4 right-4 text-white font-bold text-lg leading-tight">{category.name}</p>
    </Link>
  );
};

export default CategoryCard;
