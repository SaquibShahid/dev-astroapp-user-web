import { IconBuilding, IconCalendarEvent, IconChevronRight, IconFileText, IconSparkles } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AstrologerCard from './components/AstrologerCard';
import PromoBanner from './components/PromoBanner';
import QuickActionCard from './components/QuickActionCard';
import { useHomeStore } from '../../store/useHomeStore';

// Quick actions stay static for now — the rest still have no APIs wired up,
// so only Remedies (which does) gets a `to`.
const QUICK_ACTIONS = [
  { icon: IconCalendarEvent, label: 'Daily Horoscope' },
  { icon: IconFileText, label: 'Your Kundli' },
  { icon: IconSparkles, label: 'Remedies', to: '/remedies' },
  { icon: IconBuilding, label: 'Vastu Booking' },
];

const Home = () => {
  const navigate = useNavigate();
  const { banners, isLoadingBanners, astrologers, isLoadingAstrologers, fetchBanners, fetchAstrologers } =
    useHomeStore();

  useEffect(() => {
    fetchBanners();
    fetchAstrologers();
  }, [fetchBanners, fetchAstrologers]);

  return (
    <div className="container-custom py-8 md:py-10 space-y-10 md:space-y-14">
      <div className="mt-3 md:mt-4">
        {isLoadingBanners ? (
          <div className="w-full h-48 sm:h-72 rounded-3xl bg-bg-soft animate-pulse" />
        ) : (
          <PromoBanner banners={banners} />
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 md:gap-6">
        {QUICK_ACTIONS.map((action) => (
          <QuickActionCard
            key={action.label}
            icon={action.icon}
            label={action.label}
            onClick={action.to ? () => navigate(action.to) : undefined}
          />
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-text-main">Premium Astrologer</h2>
          <button
            type="button"
            className="flex items-center gap-1 text-sm font-semibold text-text-muted hover:text-primary transition-colors"
          >
            View All
            <IconChevronRight size={16} />
          </button>
        </div>

        {isLoadingAstrologers ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-40 rounded-2xl bg-bg-soft animate-pulse" />
            ))}
          </div>
        ) : astrologers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
            {astrologers.map((astrologer) => (
              <AstrologerCard key={astrologer.id} astrologer={astrologer} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted">No astrologers available right now.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
