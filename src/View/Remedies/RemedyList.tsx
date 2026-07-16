import { IconArrowLeft, IconLoader2, IconSparkles } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRemedyStore } from '../../store/useRemedyStore';
import RemedyCard from './components/RemedyCard';

const RemedyList: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const categories = useRemedyStore((state) => state.categories);
  const remediesByCategory = useRemedyStore((state) => state.remediesByCategory);
  const isLoading = useRemedyStore((state) => state.isLoadingRemedies);
  const fetchCategories = useRemedyStore((state) => state.fetchCategories);
  const fetchRemediesByCategory = useRemedyStore((state) => state.fetchRemediesByCategory);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (categoryId) fetchRemediesByCategory(categoryId);
  }, [categoryId, fetchRemediesByCategory]);

  if (!categoryId) return null;

  const category = categories.find((c) => c._id === categoryId);
  const remedies = remediesByCategory[categoryId] || [];

  return (
    <div className="container-custom py-8 md:py-10 max-w-3xl">
      <button
        type="button"
        onClick={() => navigate('/remedies')}
        className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors mt-2 mb-6"
      >
        <IconArrowLeft size={18} />
        Back
      </button>

      <h1 className="text-xl sm:text-2xl font-bold text-text-main mb-6">{category?.name || 'Remedies'}</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <IconLoader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : remedies.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-bg rounded-2xl border border-border">
          <IconSparkles size={36} className="text-text-light mb-3" />
          <p className="font-semibold text-text-main">No remedies found</p>
          <p className="text-sm text-text-muted mt-1">Please check back later.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {remedies.map((remedy) => (
            <RemedyCard key={remedy._id} remedy={remedy} categoryId={categoryId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RemedyList;
