import { IconLoader2 } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { useAstrologyStore } from '../../../store/useAstrologyStore';

interface BasicTabProps {
  chatProfileId: string;
}

const pad = (n: number) => n.toString().padStart(2, '0');

const DetailRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
    <span className="text-text-muted">{label}</span>
    <span className="font-medium text-text-main text-right">{value}</span>
  </div>
);

const BasicTab: React.FC<BasicTabProps> = ({ chatProfileId }) => {
  const birthDetails = useAstrologyStore((s) => s.birthDetails[chatProfileId]);
  const astroDetails = useAstrologyStore((s) => s.astroDetails[chatProfileId]);
  const isLoadingBirthDetails = useAstrologyStore((s) => s.isLoadingBirthDetails);
  const isLoadingAstroDetails = useAstrologyStore((s) => s.isLoadingAstroDetails);
  const fetchBirthDetails = useAstrologyStore((s) => s.fetchBirthDetails);
  const fetchAstroDetails = useAstrologyStore((s) => s.fetchAstroDetails);

  useEffect(() => {
    fetchBirthDetails(chatProfileId);
    fetchAstroDetails(chatProfileId);
  }, [chatProfileId, fetchBirthDetails, fetchAstroDetails]);

  return (
    <div className="space-y-6">
      <div className="bg-bg rounded-2xl border border-border p-5">
        <h2 className="font-bold text-text-main mb-3">Birth Details</h2>
        {isLoadingBirthDetails || !birthDetails ? (
          <div className="flex items-center justify-center py-8">
            <IconLoader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <div>
            <DetailRow label="Date" value={`${birthDetails.day}/${birthDetails.month}/${birthDetails.year}`} />
            <DetailRow
              label="Time"
              value={`${pad(birthDetails.hour)}:${pad(birthDetails.minute)}:${pad(birthDetails.seconds)}`}
            />
            <DetailRow label="Latitude" value={birthDetails.latitude} />
            <DetailRow label="Longitude" value={birthDetails.longitude} />
            <DetailRow label="Timezone" value={birthDetails.timezone} />
            <DetailRow label="Ayanamsha" value={birthDetails.ayanamsha} />
            <DetailRow label="Sunrise" value={birthDetails.sunrise} />
            <DetailRow label="Sunset" value={birthDetails.sunset} />
          </div>
        )}
      </div>

      <div className="bg-bg rounded-2xl border border-border p-5">
        <h2 className="font-bold text-text-main mb-3">Astro Details</h2>
        {isLoadingAstroDetails || !astroDetails ? (
          <div className="flex items-center justify-center py-8">
            <IconLoader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <div>
            <DetailRow label="Ascendant" value={astroDetails.ascendant} />
            <DetailRow label="Ascendant Lord" value={astroDetails.ascendant_lord} />
            <DetailRow label="Varna" value={astroDetails.Varna} />
            <DetailRow label="Vashya" value={astroDetails.Vashya} />
            <DetailRow label="Yoni" value={astroDetails.Yoni} />
            <DetailRow label="Gan" value={astroDetails.Gan} />
            <DetailRow label="Nadi" value={astroDetails.Nadi} />
            <DetailRow label="Sign" value={astroDetails.sign} />
            <DetailRow label="Sign Lord" value={astroDetails.SignLord} />
            <DetailRow label="Nakshatra" value={astroDetails.Naksahtra} />
            <DetailRow label="Nakshatra Lord" value={astroDetails.NaksahtraLord} />
            <DetailRow label="Charan" value={astroDetails.Charan} />
            <DetailRow label="Yog" value={astroDetails.Yog} />
            <DetailRow label="Karan" value={astroDetails.Karan} />
            <DetailRow label="Tithi" value={astroDetails.Tithi} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicTab;
