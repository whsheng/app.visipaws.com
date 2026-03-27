import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
  aiPrompt: `角色定位：
你是一位专业的宠物行为学专家，专门负责分析托运环境下的猫咪应激状态。

任务描述：
请分析这张由 VisiPaws IoT 主机捕获的 1080p 广角图片。图片拍摄于封闭的宠物托运箱内。请根据以下视觉维度，评估猫咪的应激等级：

重点观察指标：

耳朵形态：是否出现"飞机耳"（耳朵压平或完全向后）？

面部表情：是否张嘴哈气（Hissing）、露出牙齿或咆哮？

瞳孔变化：在当前光线下，瞳孔是否剧烈放大成圆形？

肢体动作：是否出现身体极度蜷缩、炸毛（毛发竖立）或爪子试探性抬起？

判定标准：
- 平静 (Calm)：身体放松，耳朵自然向上，眼睛半眯或正常。
- 警觉 (Alert)：耳朵竖立转向，眼神锐利，可能有一只爪子抬起试探。
- 应激 (Stressed)：具备上述"重点观察指标"中的 2 项或以上。

输出格式要求（严格按 JSON 返回以便 APP 解析）：
{
"status": "平静/警觉/应激",
"reason": "简短的理由，例如：发现飞机耳和瞳孔放大",
"suggestion": "给主人的建议"
}`,
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
      storage: createJSONStorage(() => {
        // 自定义存储，捕获 QuotaExceededError
        return {
          getItem: (name) => {
            if (typeof window === 'undefined') return null;
            try {
              return localStorage.getItem(name);
            } catch (e) {
              console.warn('LocalStorage getItem 失败:', e);
              return null;
            }
          },
          setItem: (name, value) => {
            if (typeof window === 'undefined') return;
            try {
              localStorage.setItem(name, value);
            } catch (e) {
              if ((e as Error).name === 'QuotaExceededError') {
                console.warn('⚠️ LocalStorage 已满，清理旧数据...');
                // 清理策略：只保留设置，清除历史记录
                const state = JSON.parse(localStorage.getItem(name) || '{}');
                const newState = {
                  deviceInfo: state.deviceInfo,
                  settings: state.settings,
                  history: { screenshots: [], analysis: [] },
                };
                try {
                  localStorage.setItem(name, JSON.stringify(newState));
                  localStorage.setItem(name, value); // 重试
                } catch {
                  console.error('LocalStorage 清理后仍然失败，清除所有数据');
                  localStorage.removeItem(name);
                }
              } else {
                console.error('LocalStorage setItem 失败:', e);
              }
            }
          },
          removeItem: (name) => {
            if (typeof window === 'undefined') return;
            try {
              localStorage.removeItem(name);
            } catch (e) {
              console.warn('LocalStorage removeItem 失败:', e);
            }
          },
        };
      }),
      partialize: (state) => ({
        deviceInfo: state.deviceInfo,
        history: state.history,
        settings: state.settings,
      }),
    }
  )
);
