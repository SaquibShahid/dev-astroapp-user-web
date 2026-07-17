import { IconLoader2 } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { useAstrologyStore } from '../../../store/useAstrologyStore';
import type { CurrentVdasha, DashaLevel } from '../../../store/useAstrologyStore';

interface DashaTabProps {
  chatProfileId: string;
}

// Standard Vimshottari Dasha hierarchy names — fixed astrology terminology, not API data.
const DASHA_LEVELS: { key: keyof CurrentVdasha; label: string }[] = [
  { key: 'major', label: 'Mahadasha' },
  { key: 'minor', label: 'Antardasha' },
  { key: 'sub_minor', label: 'Pratyantardasha' },
  { key: 'sub_sub_minor', label: 'Sookshma Dasha' },
  { key: 'sub_sub_sub_minor', label: 'Prana Dasha' },
];

const DashaRow: React.FC<{ level: string; dasha: DashaLevel }> = ({ level, dasha }) => (
  <tr className="border-b border-border last:border-0">
    <td className="py-3 pl-5 pr-3 text-sm font-medium text-text-main">{level}</td>
    <td className="py-3 px-3 text-sm text-text-main">{dasha.planet}</td>
    <td className="py-3 px-3 text-sm text-text-muted whitespace-nowrap">{dasha.start}</td>
    <td className="py-3 pr-5 pl-3 text-sm text-text-muted whitespace-nowrap">{dasha.end}</td>
  </tr>
);

const DashaTab: React.FC<DashaTabProps> = ({ chatProfileId }) => {
  const vdasha = useAstrologyStore((s) => s.currentVdasha[chatProfileId]);
  const isLoadingDasha = useAstrologyStore((s) => s.isLoadingDasha);
  const fetchCurrentVdasha = useAstrologyStore((s) => s.fetchCurrentVdasha);

  useEffect(() => {
    fetchCurrentVdasha(chatProfileId);
  }, [chatProfileId, fetchCurrentVdasha]);

  return (
    <div>
      <h2 className="font-bold text-text-main mb-3">Current Dasha</h2>

      {isLoadingDasha || !vdasha ? (
        <div className="flex items-center justify-center py-16">
          <IconLoader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-bg rounded-2xl border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-accent/10 text-left">
                <th className="py-3 pl-5 pr-3 text-xs font-semibold text-text-main">Level</th>
                <th className="py-3 px-3 text-xs font-semibold text-text-main">Planet</th>
                <th className="py-3 px-3 text-xs font-semibold text-text-main">Start Date</th>
                <th className="py-3 pr-5 pl-3 text-xs font-semibold text-text-main">End Date</th>
              </tr>
            </thead>
            <tbody>
              {DASHA_LEVELS.map(({ key, label }) => (
                <DashaRow key={key} level={label} dasha={vdasha[key]} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashaTab;
