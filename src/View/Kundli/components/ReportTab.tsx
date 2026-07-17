import { IconLoader2 } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { useAstrologyStore } from '../../../store/useAstrologyStore';

interface ReportTabProps {
  chatProfileId: string;
}

const ReportTab: React.FC<ReportTabProps> = ({ chatProfileId }) => {
  const report = useAstrologyStore((s) => s.ascendantReport[chatProfileId]);
  const isLoadingReport = useAstrologyStore((s) => s.isLoadingReport);
  const fetchAscendantReport = useAstrologyStore((s) => s.fetchAscendantReport);

  useEffect(() => {
    fetchAscendantReport(chatProfileId);
  }, [chatProfileId, fetchAscendantReport]);

  return (
    <div>
      <h2 className="font-bold text-text-main mb-3">General Ascendant Report</h2>

      {isLoadingReport || !report ? (
        <div className="flex items-center justify-center py-16">
          <IconLoader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-bg rounded-2xl border border-accent p-6">
          <h3 className="text-center font-bold text-text-main mb-3">
            {report.asc_report.ascendant} Ascendant Report
          </h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted">Overview</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <p className="text-sm text-text-main leading-relaxed whitespace-pre-line">{report.asc_report.report}</p>
        </div>
      )}
    </div>
  );
};

export default ReportTab;
