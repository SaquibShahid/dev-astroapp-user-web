import { IconArrowLeft, IconCheck, IconLoader2 } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import FaqAccordionItem from '../../Components/Common/FaqAccordionItem';
import { useRemedyStore } from '../../store/useRemedyStore';

const RemedyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId, remedyId } = useParams<{ categoryId: string; remedyId: string }>();
  const remediesByCategory = useRemedyStore((state) => state.remediesByCategory);
  const isLoading = useRemedyStore((state) => state.isLoadingRemedies);
  const fetchRemediesByCategory = useRemedyStore((state) => state.fetchRemediesByCategory);
  const bookRemedy = useRemedyStore((state) => state.bookRemedy);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (categoryId) fetchRemediesByCategory(categoryId);
  }, [categoryId, fetchRemediesByCategory]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [remedyId]);

  if (!categoryId || !remedyId) return null;

  const remedy = (remediesByCategory[categoryId] || []).find((r) => r._id === remedyId);

  const handleBookNow = async () => {
    setIsBooking(true);
    const res = await bookRemedy(remedyId);
    if (res.success && res.redirectUrl) {
      // Full-page redirect: payment completes on the gateway's own page,
      // outside the SPA, and the booking is confirmed async via webhook/cron.
      window.location.href = res.redirectUrl;
      return;
    }
    setIsBooking(false);
    toast.error(res.message || 'Failed to book remedy');
  };

  return (
    <div className="container-custom py-8 md:py-10 max-w-4xl">
      <button
        type="button"
        onClick={() => navigate(`/remedies/${categoryId}`)}
        className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors mt-2 mb-6"
      >
        <IconArrowLeft size={18} />
        Back
      </button>

      {isLoading && !remedy ? (
        <div className="flex items-center justify-center py-16">
          <IconLoader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : !remedy ? (
        <div className="text-center py-16 bg-bg rounded-2xl border border-border">
          <p className="text-sm text-text-muted">Remedy not found.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="sm:w-96 flex-shrink-0 flex flex-col">
              <img
                src={remedy.images[selectedImageIndex]}
                alt={remedy.title}
                className="w-full flex-1 min-h-64 rounded-2xl object-cover"
              />

              {remedy.images.length > 1 && (
                <div className="flex items-center gap-3 mt-4">
                  {remedy.images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-colors ${
                        index === selectedImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-bg rounded-2xl border border-border p-6 flex-1 space-y-5">
              <h1 className="text-xl font-bold text-primary">{remedy.title}</h1>

              {remedy.tags.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-text-main mb-2">Key Features</p>
                  <ul className="space-y-2">
                    {remedy.tags.map((tag) => (
                      <li key={tag} className="flex items-center gap-2 text-sm text-text-muted">
                        <IconCheck size={16} className="text-accent-dark flex-shrink-0" />
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-text-main mb-2">Description</p>
                <p className="text-sm text-text-muted leading-relaxed">{remedy.description}</p>
              </div>

              <div className="border-t border-border pt-5 flex items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  {remedy.discountPrice !== undefined && remedy.discountPrice < remedy.basePrice && (
                    <span className="text-sm text-text-light line-through">₹{remedy.basePrice}</span>
                  )}
                  <span className="text-xl font-bold text-text-main">
                    ₹
                    {remedy.discountPrice !== undefined && remedy.discountPrice < remedy.basePrice
                      ? remedy.discountPrice
                      : remedy.basePrice}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBookNow}
                disabled={isBooking}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-70"
              >
                {isBooking && <IconLoader2 size={18} className="animate-spin" />}
                Book Now
              </button>
            </div>
          </div>

          {remedy.faq.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-text-main mb-4">FAQs</h2>
              <div className="space-y-3">
                {remedy.faq.map((faq) => (
                  <FaqAccordionItem key={faq.question} faq={faq} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RemedyDetail;
