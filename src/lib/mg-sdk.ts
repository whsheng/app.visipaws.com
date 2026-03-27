// 麦谷车联 SDK 封装
export const MG_CONFIG = {
  IMEI: process.env.NEXT_PUBLIC_MG_IMEI || '',
  APP_KEY: process.env.NEXT_PUBLIC_MG_APP_KEY || '',
  SDK_URL: 'https://cdn-static.m-m10010.com/mgui/common/js/mg-player/pro/index-pro.min.js?v=20251218',
  CSS_URL: 'https://cdn-static.m-m10010.com/mgui/common/js/mg-player/pro/index.css',
};

// 声明 mgPlayer 全局类型
declare global {
  interface Window {
    mgPlayer: new (config: MgPlayerConfig) => MgPlayerInstance;
  }
}

export interface MgPlayerConfig {
  id: string;
  appkey: string;
  isExtend?: boolean;
  isScreenshot?: boolean;
  isRecord?: boolean;
  isFullscreen?: boolean;
  isAudio?: boolean;
  screenshotCustom?: boolean;
}

export interface MgPlayerInstance {
  setWindowNum: (num: number) => void;
  initAutoPlayer: (config: { imei: string; channel: number }) => void;
  destroyPlayer: () => void;
  // 注意：capture() 方法在 SDK 中可能不存在，需要通过模拟点击截图按钮来触发
  // capture: () => void;
}

// 加载 SDK
export function loadMgSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Cannot load SDK on server'));
      return;
    }

    // 检查是否已加载
    if (window.mgPlayer) {
      resolve();
      return;
    }

    // 加载 CSS
    const existingCss = document.querySelector(`link[href="${MG_CONFIG.CSS_URL}"]`);
    if (!existingCss) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = MG_CONFIG.CSS_URL;
      document.head.appendChild(link);
    }

    // 加载 JS
    const existingScript = document.querySelector(`script[src="${MG_CONFIG.SDK_URL}"]`);
    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = MG_CONFIG.SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load mgPlayer SDK'));
    document.body.appendChild(script);
  });
}

// 创建播放器实例
export function createPlayer(containerId: string): MgPlayerInstance | null {
  if (typeof window === 'undefined' || !window.mgPlayer) {
    return null;
  }

  const player = new window.mgPlayer({
    id: containerId,
    appkey: MG_CONFIG.APP_KEY,
    isExtend: false,       // 不扩展多屏
    isScreenshot: true,    // ✅ 显示截图按钮
    isRecord: false,       // ❌ 隐藏录制按钮
    isFullscreen: false,   // ❌ 隐藏全屏按钮
    isAudio: false,        // ❌ 静音（托运箱通常无音频）
    screenshotCustom: true, // ✅ 自定义截图事件
  });

  player.setWindowNum(1);
  return player;
}

// 开始直播
export function startLive(
  player: MgPlayerInstance,
  channel: number = 1
): void {
  player.initAutoPlayer({
    imei: MG_CONFIG.IMEI,
    channel,
  });
}

// 停止直播
export function stopLive(player: MgPlayerInstance): void {
  player.destroyPlayer();
}
