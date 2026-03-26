'use client';

import { Thermometer, Droplets, Satellite, Signal } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export default function DeviceStatusCompact() {
  const { deviceStatus } = useAppStore();
  const status = deviceStatus;

  return (
    <div className="flex items-center justify-end gap-3 px-4 py-2 mt-6 bg-white rounded-xl shadow-sm border border-neutral-200">
      {/* Temperature */}
      <div className="flex items-center gap-1" title="温度">
        <Thermometer className="w-3.5 h-3.5 text-orange-500" />
        <span className="text-sm font-semibold text-neutral-700">
          {status ? `${status.temperature.toFixed(0)}°C` : '--'}
        </span>
      </div>

      {/* Humidity */}
      <div className="flex items-center gap-1" title="湿度">
        <Droplets className="w-3.5 h-3.5 text-blue-500" />
        <span className="text-sm font-semibold text-neutral-700">
          {status ? `${status.humidity.toFixed(0)}%` : '--'}
        </span>
      </div>

      {/* GPS Signal */}
      <div className="flex items-center gap-1" title={`GPS 卫星：${status?.gpsSignal || 0} 颗`}>
        <Satellite className={`w-3.5 h-3.5 ${status?.gpsSignal && status.gpsSignal >= 5 ? 'text-green-500' : 'text-yellow-500'}`} />
        <span className="text-sm font-semibold text-neutral-700">
          {status ? `${status.gpsSignal}` : '--'}
        </span>
      </div>

      {/* 4G Network */}
      <div className="flex items-center gap-1" title={status?.isOnline ? '设备在线' : '设备离线'}>
        <Signal className={`w-3.5 h-3.5 ${status?.isOnline ? 'text-purple-500' : 'text-neutral-400'}`} />
        <span className="text-sm font-semibold text-neutral-700">
          {status?.isOnline ? '4G' : '离线'}
        </span>
      </div>
    </div>
  );
}
