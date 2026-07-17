import { IconArrowLeft } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BasicTab from './components/BasicTab';
import ChartsTab from './components/ChartsTab';
import DashaTab from './components/DashaTab';
import ReportTab from './components/ReportTab';

type KundliTab = 'basic' | 'charts' | 'dasha' | 'report';

const TABS: { id: KundliTab; label: string }[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'charts', label: 'Charts' },
  { id: 'dasha', label: 'Dasha' },
  { id: 'report', label: 'Report' },
];

const Kundli: React.FC = () => {
  const navigate = useNavigate();
  const { chatProfileId } = useParams<{ chatProfileId: string }>();
  const [activeTab, setActiveTab] = useState<KundliTab>('basic');

  if (!chatProfileId) return null;

  return (
    <div className="container-custom py-8 md:py-10 max-w-3xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors mt-2 mb-6"
      >
        <IconArrowLeft size={18} />
        Back
      </button>

      <h1 className="text-xl sm:text-2xl font-bold text-text-main mb-6">Kundli</h1>

      <div className="grid grid-cols-4 gap-1.5 bg-bg-soft rounded-2xl border border-border p-1.5 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === tab.id ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'basic' && <BasicTab chatProfileId={chatProfileId} />}
      {activeTab === 'charts' && <ChartsTab chatProfileId={chatProfileId} />}
      {activeTab === 'dasha' && <DashaTab chatProfileId={chatProfileId} />}
      {activeTab === 'report' && <ReportTab chatProfileId={chatProfileId} />}
    </div>
  );
};

export default Kundli;
