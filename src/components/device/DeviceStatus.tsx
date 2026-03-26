'use client';

import { useEffect, useState } from 'react';
import { Thermometer, Droplets, Battery, Signal, MapPin, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/appStore';
import { fetchDeviceLocation } from '@/lib/api';


export default function DeviceStatus() {
  const { deviceStatus, setDeviceStatus } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const status = await fetchDeviceLocation();
      if (status) {
        setDeviceStatus(status);
        setLastUpdate(new Date());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // 每30秒刷新
    return () => clearInterval(interval);
  }, []);

  const status = deviceStatus;

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-green-400';
    if (level > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTempColor = (temp: number) => {
    if (temp < 30) return 'text-green-400';
    if (temp < 35) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSignalLevel = (signal: number) => {
    if (signal >= 4) return '强';
    if (signal >= 3) return '中';
    return '弱';
  };

  return (
    <Card className="glass-card border-slate-700/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            设备状态
            <Badge
              variant="outline"
              className={status?.isOnline
                ? 'bg-green-500/20 text-green-400 border-green-500/50'
                : 'bg-red-500/20 text-red-400 border-red-500/50'
              }
            >
              <span className={`w-2 h-2 rounded-full mr-1 ${status?.isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              {status?.isOnline ? '在线' : '离线'}
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-white"
            onClick={fetchStatus}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        {lastUpdate && (
          <p className="text-xs text-slate-500">
            更新于 {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Temperature */}
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Thermometer className="w-4 h-4 text-orange-400" />
              </div>
              <span className="text-sm text-slate-400">温度</span>
            </div>
            <p className={`text-2xl font-bold ${status ? getTempColor(status.temperature) : 'text-slate-500'}`}>
              {status ? `${status.temperature.toFixed(1)}°C` : '--'}
            </p>
          </div>

          {/* Humidity */}
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm text-slate-400">湿度</span>
            </div>
            <p className="text-2xl font-bold text-cyan-400">
              {status ? `${status.humidity.toFixed(0)}%` : '--'}
            </p>
          </div>

          {/* Battery - 使用 voltage 电压代替 */}
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Battery className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-sm text-slate-400">电压</span>
            </div>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-bold ${status && status.voltage > 0 ? 'text-green-400' : 'text-slate-500'}`}>
                {status ? `${status.voltage}V` : '--'}
              </p>
              {status && status.voltage > 0 && (
                <Badge variant="outline" className="bg-green-500/20 text-green-400 text-[10px]">
                  正常
                </Badge>
              )}
            </div>
          </div>

          {/* Signal - GPS 卫星颗数 */}
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Signal className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-sm text-slate-400">GPS 信号</span>
            </div>
            <p className="text-2xl font-bold text-purple-400">
              {status ? `${status.gpsSignal} 颗` : '--'}
            </p>
          </div>
        </div>

        {/* Location */}
        {status && (
          <div className="mt-4 glass-card p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-sm text-slate-400">位置</span>
            </div>
            <p className="text-sm text-slate-300 truncate">{status.location || '未知位置'}</p>
            <div className="flex gap-4 mt-2 text-xs text-slate-500">
              <span>Lat: {status.lat.toFixed(6)}</span>
              <span>Lng: {status.lng.toFixed(6)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
