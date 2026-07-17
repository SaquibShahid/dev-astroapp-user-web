import { IconLoader2 } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useAstrologyStore } from '../../../store/useAstrologyStore';

interface ChartsTabProps {
  chatProfileId: string;
}

const CHART_IDS = [
  'D1',
  'D2',
  'D3',
  'D4',
  'D5',
  'D7',
  'D9',
  'D10',
  'D12',
  'D16',
  'D20',
  'D24',
  'D27',
  'D30',
  'D40',
  'D45',
  'D60',
  'chalit',
  'MOON',
  'SUN',
];

// Standard Vedic divisional-chart names — fixed astrology terminology, not API data.
const CHART_NAMES: Record<string, string> = {
  D1: 'Rashi Chart',
  D2: 'Hora Chart',
  D3: 'Drekkana Chart',
  D4: 'Chaturthamsa Chart',
  D5: 'Panchamsa Chart',
  D7: 'Saptamsa Chart',
  D9: 'Navamsa Chart',
  D10: 'Dashamsa Chart',
  D12: 'Dwadashamsa Chart',
  D16: 'Shodashamsa Chart',
  D20: 'Vimshamsa Chart',
  D24: 'Chaturvimshamsa Chart',
  D27: 'Nakshatramsa Chart',
  D30: 'Trimshamsa Chart',
  D40: 'Khavedamsa Chart',
  D45: 'Akshavedamsa Chart',
  D60: 'Shashtiamsa Chart',
  chalit: 'Chalit Chart',
  MOON: 'Moon Chart',
  SUN: 'Sun Chart',
};

const ChartsTab: React.FC<ChartsTabProps> = ({ chatProfileId }) => {
  const [chartId, setChartId] = useState('D1');
  const key = `${chatProfileId}:${chartId}`;

  const chartData = useAstrologyStore((s) => s.horoChartData[key]);
  const chartSvg = useAstrologyStore((s) => s.horoChartSvg[key]);
  const isLoadingChart = useAstrologyStore((s) => s.isLoadingChart);
  const fetchHoroChart = useAstrologyStore((s) => s.fetchHoroChart);

  useEffect(() => {
    fetchHoroChart(chatProfileId, chartId);
  }, [chatProfileId, chartId, fetchHoroChart]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {CHART_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setChartId(id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              chartId === id
                ? 'bg-primary text-white border-primary'
                : 'bg-bg border-border text-text-muted hover:border-primary/40'
            }`}
          >
            {id}
          </button>
        ))}
      </div>

      <h2 className="font-bold text-text-main">{CHART_NAMES[chartId] || `${chartId} Chart`}</h2>

      <div className="bg-bg rounded-2xl border border-border p-5 flex items-center justify-center min-h-[280px]">
        {isLoadingChart || !chartSvg ? (
          <IconLoader2 size={24} className="animate-spin text-primary" />
        ) : (
          <div className="w-full max-w-[350px]" dangerouslySetInnerHTML={{ __html: chartSvg }} />
        )}
      </div>

      <div className="bg-bg rounded-2xl border border-border p-5">
        <h2 className="font-bold text-text-main mb-3">Chart Planets</h2>
        {isLoadingChart || !chartData ? (
          <div className="flex items-center justify-center py-8">
            <IconLoader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <div>
            {chartData.map((house) => (
              <div
                key={house.sign}
                className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0"
              >
                <span className="text-text-muted">{house.sign_name}</span>
                <span className="font-medium text-text-main">
                  {house.planet_small.length > 0 ? house.planet_small.map((p) => p.trim()).join(', ') : '--'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartsTab;
