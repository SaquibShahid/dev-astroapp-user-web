import { IconSparkles } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { useRemedyStore } from '../../store/useRemedyStore';
import CategoryCard from './components/CategoryCard';

const RemedyCategories: React.FC = () => {
  const categories = useRemedyStore((state) => state.categories);
  const isLoading = useRemedyStore((state) => state.isLoadingCategories);
  const fetchCategories = useRemedyStore((state) => state.fetchCategories);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="container-custom py-8 md:py-10">
      <h1 className="text-xl sm:text-2xl font-bold text-text-main mb-6">Spiritual Remedies</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="aspect-[4/5] rounded-2xl bg-bg-soft animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-bg rounded-2xl border border-border">
          <IconSparkles size={36} className="text-text-light mb-3" />
          <p className="font-semibold text-text-main">No remedy categories available</p>
          <p className="text-sm text-text-muted mt-1">Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RemedyCategories;
