'use client';

import MainLayout from '@/components/layout/MainLayout';
import DeviceStatusCompact from '@/components/device/DeviceStatusCompact';
import VideoPlayer from '@/components/video/VideoPlayer';
import AIAnalyzerIntegrated from '@/components/ai/AIAnalyzerIntegrated';
import { useAppStore } from '@/store/appStore';
import { ScreenshotRecord } from '@/types';

export default function HomePage() {
  const { addScreenshot, settings } = useAppStore();

  const handleScreenshot = (imageBase64: string) => {
    const screenshot: ScreenshotRecord = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      imageUrl: imageBase64,
      type: settings.demoMode ? 'demo' : 'screenshot',
    };
    addScreenshot(screenshot);
  };

  const handleAiAnalyze = (imageBase64: string) => {
    interface WindowWithTrigger extends Window {
      triggerAIAnalysis?: (image: string) => void;
    }
    if (typeof window !== 'undefined' && (window as WindowWithTrigger).triggerAIAnalysis) {
      (window as WindowWithTrigger).triggerAIAnalysis!(imageBase64);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        {/* Device Status - Compact */}
        <DeviceStatusCompact />

        {/* Video Player Section */}
        <VideoPlayer
          onScreenshot={handleScreenshot}
          onAiAnalyze={handleAiAnalyze}
        />

        {/* AI Analyzer - Integrated */}
        <AIAnalyzerIntegrated />
      </div>
    </MainLayout>
  );
}
