'use client';

import MainLayout from '@/components/layout/MainLayout';
import DeviceStatusCompact from '@/components/device/DeviceStatusCompact';
import MapContainer from '@/components/map/MapContainer';

export default function MapPage() {
  return (
    <MainLayout>
      <div className="space-y-4">
        {/* Device Status - Compact */}
        <DeviceStatusCompact />

        {/* Map Section */}
        <MapContainer />
      </div>
    </MainLayout>
  );
}
