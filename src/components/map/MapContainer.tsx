'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { loadAMapSdk, createMap, createMarker, MapInstance, MarkerInstance } from '@/lib/amap';
import { fetchDeviceLocation } from '@/lib/api';

export default function MapContainer() {

  const { deviceStatus, setDeviceStatus } = useAppStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<MapInstance | null>(null);
  const markerRef = useRef<MarkerInstance | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showDebug, setShowDebug] = useState(false); // 调试模式开关

  // 加载高德地图 SDK
  useEffect(() => {
    loadAMapSdk()
      .then(() => setSdkLoaded(true))
      .catch((err) => setSdkError(err.message));
  }, []);

  // 检查 API Key 是否配置
  const isApiKeyConfigured = process.env.NEXT_PUBLIC_AMAP_KEY && 
    process.env.NEXT_PUBLIC_AMAP_KEY !== 'your_amap_key_here';

  // 刷新位置
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const status = await fetchDeviceLocation();
      console.log('刷新位置结果:', status);
      if (status) {
        setDeviceStatus(status);
      } else {
        console.warn('未获取到位置信息');
      }
    } catch (error) {
      console.error('Failed to refresh location:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // 初始化地图
  useEffect(() => {
    if (!sdkLoaded || !mapRef.current) return;

    const initMap = () => {
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = createMap(mapRef.current!, {
          zoom: 15,
          center: deviceStatus
            ? [deviceStatus.lng, deviceStatus.lat]
            : [113.930336, 22.542867], // 默认广东深圳南山区
        });
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [sdkLoaded]);

  // 定时刷新位置（每 120 秒）
  useEffect(() => {
    // 页面加载时不自动刷新，由用户手动点击刷新
    const interval = setInterval(() => {
      if (deviceStatus?.isOnline) {
        console.log('⏰ 定时刷新位置（120 秒）');
        handleRefresh();
      }
    }, 120000); // 120 秒

    return () => clearInterval(interval);
  }, [deviceStatus?.isOnline]);

  // 更新标记位置
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!mapInstanceRef.current || !deviceStatus) {
      console.log('跳过 marker 更新：mapInstance=', !!mapInstanceRef.current, 'deviceStatus=', !!deviceStatus);
      return;
    }

    const position: [number, number] = [deviceStatus.lng, deviceStatus.lat];
    console.log('更新 marker 位置:', position);

    // 更新地图中心
    mapInstanceRef.current.setCenter(position);

    // 更新或创建标记（使用猫咪图标）
    if (markerRef.current) {
      console.log('更新现有 marker');
      markerRef.current.setPosition(position);
    } else {
      console.log('创建新 marker');
      markerRef.current = createMarker(position, '宠物箱位置', {
        icon: '/icons/cat-marker.svg',
        size: [36, 36],
        anchor: [18, 36],  // 底部中心
      });
      if (markerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.add(markerRef.current);
      }
    }
  }, [deviceStatus]);

  const status = deviceStatus;

  return (
    <Card className="bg-white border-neutral-200 shadow-sm h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-neutral-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            实时定位
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-500 hover:text-primary"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Map Container */}
        <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden rounded-xl">
          {!isApiKeyConfigured ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 p-4 text-center">
              <MapPin className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-base font-medium text-neutral-700 mb-2">地图未配置</p>
              <p className="text-sm mb-4">需要在 `.env.local` 中配置高德地图 API Key</p>
              <div className="text-xs text-neutral-500 bg-neutral-50 p-3 rounded-lg text-left border border-neutral-200">
                <p className="mb-1">配置步骤：</p>
                <p>1. 访问 <a href="https://lbs.amap.com/" target="_blank" className="text-primary hover:underline">高德开放平台</a> 申请 Key</p>
                <p>2. 在 `.env.local` 中设置：</p>
                <p className="font-mono mt-1">NEXT_PUBLIC_AMAP_KEY=你的 key</p>
                <p className="font-mono">NEXT_PUBLIC_AMAP_SECURITY_CONFIG=你的安全密钥</p>
              </div>
              <p className="text-xs text-neutral-400 mt-4">默认显示位置：广东深圳南山区</p>
            </div>
          ) : sdkError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 p-4 text-center">
              <MapPin className="w-12 h-12 mb-4 opacity-30" />
              <p>地图加载失败</p>
              <p className="text-sm mt-2">{sdkError}</p>
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full" />
          )}

          {/* Location Info Overlay */}
          {status && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-neutral-200 shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Navigation className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-neutral-800 truncate">
                      当前位置
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDebug(!showDebug)}
                      className={`h-6 px-2 text-xs ${showDebug ? 'bg-primary/10 text-primary' : 'text-neutral-400 hover:text-primary'}`}
                    >
                      {showDebug ? '🔒 关闭调试' : '🐛 打开调试'}
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-600 truncate">{status.location || '未知位置'}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-neutral-500">
                    <span>纬度：{status.lat.toFixed(6)}</span>
                    <span>经度：{status.lng.toFixed(6)}</span>
                    <span>速度：{status.speed} km/h</span>
                  </div>
                  {status.gpsTime && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-neutral-400">
                      <Clock className="w-3 h-3" />
                      <span>更新时间：{status.gpsTime}</span>
                    </div>
                  )}

                  {/* 调试信息 - 可展开 */}
                  {showDebug && (
                    <div className="mt-3 pt-3 border-t border-neutral-200">
                      <p className="text-xs font-semibold text-neutral-700 mb-2">📊 原始数据 (JSON):</p>
                      <pre className="bg-neutral-900 text-green-400 p-3 rounded-lg text-xs overflow-auto max-h-[400px] font-mono">
                        {JSON.stringify(status, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
