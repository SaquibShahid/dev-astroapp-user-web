import { IconArrowLeft, IconLoader2, IconSparkles } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRemedyStore } from '../../store/useRemedyStore';
import type { RemedyBooking } from '../../store/useRemedyStore';

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700',
  CREATED: 'bg-accent/20 text-accent-dark',
  FAILED: 'bg-error/10 text-error',
  CANCELLED: 'bg-error/10 text-error',
};

const formatStatus = (status: string): string => {
  if (status === 'CREATED') return 'Payment Pending';
  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatBookedAt = (isoString: string): string => {
  const date = new Date(isoString);
  const datePart = date.toLocaleDateString('en-CA');
  const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${datePart} ${timePart}`;
};

const BookingCard: React.FC<{ booking: RemedyBooking }> = ({ booking }) => (
  <div className="bg-bg rounded-2xl border border-border p-5 flex items-center gap-4">
    <img
      src={booking.remedyId.images[0]}
      alt={booking.remedyId.title}
      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
    />
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold text-text-main truncate">{booking.remedyId.title}</p>
        <span
          className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full flex-shrink-0 ${
            STATUS_STYLES[booking.status] || 'bg-bg-soft text-text-muted'
          }`}
        >
          {formatStatus(booking.status)}
        </span>
      </div>
      <p className="text-sm text-text-muted mt-1">{formatBookedAt(booking.bookedAt)}</p>
      <p className="font-semibold text-text-main mt-1">₹{booking.pricePaid}</p>
    </div>
  </div>
);

const RemedyBookings: React.FC = () => {
  const navigate = useNavigate();
  const bookings = useRemedyStore((state) => state.bookings);
  const isLoading = useRemedyStore((state) => state.isLoadingBookings);
  const fetchMyBookings = useRemedyStore((state) => state.fetchMyBookings);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  return (
    <div className="container-custom py-8 md:py-10 max-w-2xl">
      <button
        type="button"
        onClick={() => navigate('/profile')}
        className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors mt-2 mb-6"
      >
        <IconArrowLeft size={18} />
        Back
      </button>

      <h1 className="text-xl sm:text-2xl font-bold text-text-main mb-6">Remedies Bookings</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <IconLoader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-bg rounded-2xl border border-border">
          <IconSparkles size={36} className="text-text-light mb-3" />
          <p className="font-semibold text-text-main">No bookings yet</p>
          <p className="text-sm text-text-muted mt-1">Book a remedy to see it here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RemedyBookings;
