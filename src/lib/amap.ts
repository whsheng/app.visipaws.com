// 高德地图 SDK 封装
export const AMAP_CONFIG = {
  // 需要用户申请后填入
  KEY: process.env.NEXT_PUBLIC_AMAP_KEY || '',
  SECURITY_CONFIG: process.env.NEXT_PUBLIC_AMAP_SECURITY_CONFIG || '',
};

// 高德地图类型定义
export interface Size {
  width: number;
  height: number;
}

export interface Pixel {
  x: number;
  y: number;
}

export interface AMapClass {
  Map: new (container: string | HTMLElement, options?: MapOptions) => MapInstance;
  Marker: new (options: MarkerOptions) => MarkerInstance;
  Icon: new (options: IconOptions) => IconInstance;
  Size: new (width: number, height: number) => Size;
  Pixel: new (x: number, y: number) => Pixel;
}

export interface IconOptions {
  size: Size;
  imageSize: Size;
  image: string;
  anchor?: Pixel;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IconInstance {
}

// 声明高德地图全局类型
declare global {
  interface Window {
    AMap: AMapClass;
  }
}

export interface MapOptions {
  zoom?: number;
  center?: [number, number];
  viewMode?: '2D' | '3D';
}

export interface MapInstance {
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  add: (marker: MarkerInstance) => void;
  remove: (marker: MarkerInstance) => void;
  destroy: () => void;
}

export interface MarkerOptions {
  position: [number, number];
  title?: string;
  animation?: string;
}

export interface MarkerInstance {
  setPosition: (position: [number, number]) => void;
  setAnimation: (animation: string) => void;
}

// 加载高德地图 SDK
export function loadAMapSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Cannot load AMap on server'));
      return;
    }

    // 检查是否已加载
    if (window.AMap) {
      resolve();
      return;
    }

    // 配置安全密钥
    if (AMAP_CONFIG.SECURITY_CONFIG) {
      const script = document.createElement('script');
      script.textContent = `
        window._AMapSecurityConfig = {
          securityJsCode: '${AMAP_CONFIG.SECURITY_CONFIG}',
        };
      `;
      document.head.appendChild(script);
    }

    // 加载 JSAPI
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_CONFIG.KEY}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load AMap SDK'));
    document.body.appendChild(script);
  });
}

// 创建地图实例
export function createMap(
  container: string | HTMLElement,
  options: MapOptions = {}
): MapInstance | null {
  if (typeof window === 'undefined' || !window.AMap) {
    return null;
  }

  return new window.AMap.Map(container, {
    zoom: 15,
    viewMode: '2D',
    ...options,
  });
}

// 创建标记（支持自定义图标）
export function createMarker(
  position: [number, number],
  title?: string,
  options?: {
    icon?: string;  // 自定义图标 URL
    size?: [number, number];  // 图标大小 [width, height]
    anchor?: [number, number];  // 锚点位置 [x, y]
  }
): MarkerInstance | null {
  if (typeof window === 'undefined' || !window.AMap) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerOptions: any = {
    position,
    title,
    animation: 'AMAP_ANIMATION_BOUNCE',
  };

  // 如果有自定义图标
  if (options?.icon) {
    const size = options.size || [36, 36];
    const anchor = options.anchor || [18, 36];  // 默认底部中心
    
    markerOptions.icon = new window.AMap.Icon({
      size: new window.AMap.Size(size[0], size[1]),
      imageSize: new window.AMap.Size(size[0], size[1]),
      image: options.icon,
      anchor: new window.AMap.Pixel(anchor[0], anchor[1]),
    });
  }

  return new window.AMap.Marker(markerOptions);
}
