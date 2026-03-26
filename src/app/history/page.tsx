'use client';

import MainLayout from '@/components/layout/MainLayout';
import HistoryList from '@/components/history/HistoryList';
import AIDebugPanel from '@/components/history/AIDebugPanel';

export default function HistoryPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* History Section */}
        <HistoryList />

        {/* AI Debug Panel - Below History */}
        <AIDebugPanel />
      </div>
    </MainLayout>
  );
}
