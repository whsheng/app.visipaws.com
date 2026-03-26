'use client';

import { useState } from 'react';
import { ImageIcon, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';

// 演示图片列表 
const DEMO_IMAGES = {
  normal: [
    '/demo-images/normal-1.png',
  ],
  stress: [
    '/demo-images/stress-1.jpeg',  
    '/demo-images/stress-2.jpeg',
    '/demo-images/stress-3.jpeg',
    '/demo-images/stress-4.jpeg',
  ],
};

interface DemoModeSelectorProps {
  onSelectImage?: (image: string, type: 'normal' | 'stress') => void;
  currentImage?: string | null;
  onClear?: () => void;
}

export default function DemoModeSelector({ onSelectImage, currentImage, onClear }: DemoModeSelectorProps) {
  const { liveStream, setCurrentDemoImage } = useAppStore();
  const { currentDemoImage } = liveStream;
  const [showSelector, setShowSelector] = useState(false);
  const [selectedType, setSelectedType] = useState<'normal' | 'stress' | null>(null);

  const imageToUse = currentImage || currentDemoImage;
  const clearToUse = onClear || (() => setCurrentDemoImage(null));

  const handleSelectType = (type: 'normal' | 'stress') => {
    setSelectedType(type);
  };

  const handleSelectImage = (image: string) => {
    if (onSelectImage) {
      onSelectImage(image, selectedType!);
    } else {
      setCurrentDemoImage(image);
    }
    setShowSelector(false);
    setSelectedType(null);
  };

  const handleBack = () => {
    setSelectedType(null);
  };

  const handleClear = () => {
    clearToUse();
    setSelectedType(null);
  };

  // 显示类型选择
  if (showSelector && !selectedType) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 px-2"
          >
            ← 返回
          </Button>
          <span className="text-sm font-medium text-neutral-700">选择演示类型</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSelectType('normal')}
            className="p-4 rounded-xl border-2 border-neutral-200 hover:border-primary/50 bg-gradient-to-br from-green-50 to-white transition-all text-center"
          >
            <div className="text-3xl mb-2">😊</div>
            <div className="text-sm font-medium text-neutral-800">正常状态</div>
            <div className="text-xs text-neutral-500 mt-1">宠物放松、舒适</div>
          </button>
          <button
            onClick={() => handleSelectType('stress')}
            className="p-4 rounded-xl border-2 border-neutral-200 hover:border-tertiary/50 bg-gradient-to-br from-red-50 to-white transition-all text-center"
          >
            <div className="text-3xl mb-2">😰</div>
            <div className="text-sm font-medium text-neutral-800">应激状态</div>
            <div className="text-xs text-neutral-500 mt-1">宠物紧张、焦虑</div>
          </button>
        </div>
      </div>
    );
  }

  // 显示图片选择
  if (showSelector && selectedType) {
    const images = DEMO_IMAGES[selectedType];
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 px-2"
          >
            ← 返回
          </Button>
          <span className="text-sm font-medium text-neutral-700">
            {selectedType === 'normal' ? '正常状态' : '应激状态'} - 选择图片
          </span>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectImage(img)}
              className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors shadow-sm"
            >
              <img
                src={img}
                alt={`${selectedType} ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 默认显示
  return (
    <div className="space-y-3">
      {imageToUse ? (
        <div className="relative">
          <img
            src={imageToUse}
            alt="Selected demo"
            className="w-full h-24 object-cover rounded-lg shadow-sm"
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-neutral-600 hover:bg-white hover:text-red-500 shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full border-dashed border-neutral-300 text-neutral-600 hover:text-primary hover:border-primary/50 hover:bg-primary/5"
          onClick={() => setShowSelector(true)}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          选择演示图片
        </Button>
      )}
    </div>
  );
}
