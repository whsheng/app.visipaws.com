'use client';

import { useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const router = useRouter();

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.ico"
            alt="VisiPaws"
            className="w-8 h-8 rounded-lg shadow-md"
          />
          <div>
            <h1 className="text-base font-bold text-neutral-800">VisiPaws</h1>
            <p className="text-[9px] text-neutral-500 -mt-0.5">Always See, Always Sure</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="text-neutral-500 hover:text-primary hover:bg-primary/10"
            onClick={handleSettingsClick}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
