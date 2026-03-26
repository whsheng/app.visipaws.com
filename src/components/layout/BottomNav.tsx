'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Map, BarChart3 } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { id: 'home', label: '首页', icon: Home, path: '/' },
    { id: 'map', label: '地图', icon: Map, path: '/map' },
    { id: 'data', label: '数据', icon: BarChart3, path: '/history' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path || pathname === path + '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-neutral-200 safe-bottom">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const active = isActive(tab.path);
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.path)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                  active
                    ? 'text-primary'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <div
                  className={`relative p-2 rounded-xl transition-all duration-200 ${
                    active ? 'bg-primary/10' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {active && (
                    <span className="absolute inset-0 rounded-xl bg-primary/10" />
                  )}
                </div>
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
