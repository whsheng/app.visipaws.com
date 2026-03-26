import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DeviceStatus,
  LiveStreamState,
  HistoryState,
  AppSettings,
  AIAnalysisResult,
  ScreenshotRecord,
} from '@/types';

// 设备信息
interface DeviceInfo {
  boxId: string;
  petName: string;
  emergencyPhone: string;
}

interface AppState {
  // Device Status
  deviceStatus: DeviceStatus | null;
  setDeviceStatus: (status: DeviceStatus | null) => void;

  // Device Info
  deviceInfo: DeviceInfo;
  setDeviceInfo: (info: Partial<DeviceInfo>) => void;

  // Live Stream
  liveStream: LiveStreamState;
  setLiveStatus: (status: LiveStreamState['status']) => void;
  setPlayerMode: (mode: LiveStreamState['mode']) => void;
  setCurrentDemoImage: (image: string | null) => void;
  setLiveError: (error: string | null) => void;

  // History
  history: HistoryState;
  addScreenshot: (screenshot: ScreenshotRecord) => void;
  addAnalysis: (analysis: AIAnalysisResult) => void;
  clearHistory: () => void;

  // Settings
  settings: AppSettings;
  setLanguage: (lang: AppSettings['language']) => void;
  setAiPrompt: (prompt: string) => void;
  setDemoMode: (enabled: boolean) => void;
}

const initialLiveStream: LiveStreamState = {
  status: 'idle',
  mode: 'live',
  currentDemoImage: null,
  error: null,
};

const initialDeviceInfo: DeviceInfo = {
  boxId: '',
  petName: '',
  emergencyPhone: '',
};

const initialHistory: HistoryState = {
  screenshots: [],
  analysis: [],
};

const initialSettings: AppSettings = {
  language: 'zh',
  aiPrompt: '请分析这张宠物图片，判断宠物的状态（正常/应激/异常），并指出任何异常情况和建议。',
  demoMode: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Device Status
      deviceStatus: null,
      setDeviceStatus: (status) => set({ deviceStatus: status }),

      // Device Info
      deviceInfo: initialDeviceInfo,
      setDeviceInfo: (info) =>
        set((state) => ({
          deviceInfo: { ...state.deviceInfo, ...info },
        })),

      // Live Stream
      liveStream: initialLiveStream,
      setLiveStatus: (status) =>
        set((state) => ({
          liveStream: { ...state.liveStream, status },
        })),
      setPlayerMode: (mode) =>
        set((state) => ({
          liveStream: { ...state.liveStream, mode },
        })),
      setCurrentDemoImage: (image) =>
        set((state) => ({
          liveStream: { ...state.liveStream, currentDemoImage: image },
        })),
      setLiveError: (error) =>
        set((state) => ({
          liveStream: { ...state.liveStream, error },
        })),

      // History
      history: initialHistory,
      addScreenshot: (screenshot) =>
        set((state) => ({
          history: {
            ...state.history,
            screenshots: [screenshot, ...state.history.screenshots].slice(0, 50),
          },
        })),
      addAnalysis: (analysis) =>
        set((state) => ({
          history: {
            ...state.history,
            analysis: [analysis, ...state.history.analysis].slice(0, 50),
          },
        })),
      clearHistory: () => set({ history: initialHistory }),

      // Settings
      settings: initialSettings,
      setLanguage: (language) =>
        set((state) => ({
          settings: { ...state.settings, language },
        })),
      setAiPrompt: (aiPrompt) =>
        set((state) => ({
          settings: { ...state.settings, aiPrompt },
        })),
      setDemoMode: (demoMode) =>
        set((state) => ({
          settings: { ...state.settings, demoMode },
        })),
    }),
    {
      name: 'visipaws-storage',
      partialize: (state) => ({
        deviceInfo: state.deviceInfo,
        history: state.history,
        settings: state.settings,
      }),
    }
  )
);
