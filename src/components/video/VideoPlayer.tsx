'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Square, AlertCircle, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/appStore';
import {
  loadMgSdk,
  createPlayer,
  startLive,
  stopLive,
  MgPlayerInstance,
} from '@/lib/mg-sdk';
import DemoModeSelector from './DemoModeSelector';

interface VideoPlayerProps {
  onScreenshot?: (imageBase64: string) => void;
  onAiAnalyze?: (imageBase64: string) => void;
}

export default function VideoPlayer({ onScreenshot, onAiAnalyze }: VideoPlayerProps) {
  const playerRef = useRef<MgPlayerInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);

  const { liveStream, setLiveStatus, settings } = useAppStore();
  const { status, mode, currentDemoImage } = liveStream;

  // 模拟分析模式状态
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [simulationImage, setSimulationImage] = useState<string | null>(null);
  const [showSimulationSelector, setShowSimulationSelector] = useState(false);

  // 加载 SDK
  useEffect(() => {
    loadMgSdk()
      .then(() => setSdkLoaded(true))
      .catch((err) => setSdkError(err.message));
  }, []);

  // 初始化播放器
  const initPlayer = useCallback(() => {
    if (!sdkLoaded || !containerRef.current) return;

    try {
      if (playerRef.current) {
        playerRef.current.destroyPlayer();
      }

      playerRef.current = createPlayer('mg-player-container');
    } catch {
      setSdkError('Failed to initialize player');
    }
  }, [sdkLoaded]);

  // SDK 加载完成后初始化播放器
  useEffect(() => {
    if (sdkLoaded) {
      initPlayer();
    }
  }, [sdkLoaded, initPlayer]);

  // 监听截图事件 - 截图后自动触发 AI 分析
  useEffect(() => {
    const handleCapture = (e: Event) => {
      const customEvent = e as CustomEvent;
      
      if (!customEvent.detail) {
        console.warn('📸 截图事件无数据');
        return;
      }
      
      // 处理 blob 或 base64 数据
      const processImage = (base64: string) => {
        // 1. 保存截图
        if (onScreenshot) {
          onScreenshot(base64);
        }
        // 2. 自动触发 AI 分析
        if (onAiAnalyze) {
          onAiAnalyze(base64);
        }
      };
      
      // 如果 detail 是对象且有 content 属性（blob），需要转换
      if (typeof customEvent.detail === 'object' && 'content' in customEvent.detail) {
        const blob = customEvent.detail.content;
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          processImage(base64);
        };
        reader.onerror = () => {
          console.error('📸 blob 转 base64 失败');
        };
        reader.readAsDataURL(blob);
        return;
      }
      
      // 如果 detail 已经是 base64 字符串
      if (typeof customEvent.detail === 'string') {
        processImage(customEvent.detail);
      }
    };

    document.addEventListener('captureImg', handleCapture);
    return () => document.removeEventListener('captureImg', handleCapture);
  }, [onScreenshot, onAiAnalyze]);

  // 开始直播
  const handleStartLive = () => {
    if (!playerRef.current) {
      initPlayer();
    }

    setLiveStatus('connecting');

    setTimeout(() => {
      try {
        if (playerRef.current) {
          startLive(playerRef.current);
          setLiveStatus('connected');
        }
      } catch (error) {
        console.error('Live stream error:', error);
        setLiveStatus('error');
      }
    }, 1000);
  };

  // 停止直播
  const handleStopLive = () => {
    if (playerRef.current) {
      stopLive(playerRef.current);
    }
    setLiveStatus('idle');
    initPlayer();
  };

  // 处理模拟分析
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSimulationSelect = (image: string, _type: 'normal' | 'stress') => {
    setSimulationImage(image);
    setIsSimulationMode(true);
    
    // 1.5 秒后关闭对话框
    setTimeout(() => {
      setShowSimulationSelector(false);
    }, 1500);
    
    // 自动触发 AI 分析
    setTimeout(() => {
      fetch(image)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            onAiAnalyze?.(base64);
          };
          reader.readAsDataURL(blob);
        });
    }, 500);
  };

  // 清除模拟模式
  const handleClearSimulation = () => {
    setSimulationImage(null);
    setIsSimulationMode(false);
  };

  // AI 分析 - 只处理模拟模式和演示模式
  // 直播模式：用户点击播放器截图按钮后自动触发 AI 分析（通过 useEffect 监听）
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAiAnalyze = () => {
    if (isSimulationMode && simulationImage) {
      // 模拟模式
      fetch(simulationImage)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            onAiAnalyze?.(base64);
          };
          reader.readAsDataURL(blob);
        });
    } else if (mode === 'demo' && currentDemoImage) {
      // 演示模式
      fetch(currentDemoImage)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            onAiAnalyze?.(base64);
          };
          reader.readAsDataURL(blob);
        });
    }
  };

  // 获取状态显示
  const getStatusBadge = () => {
    if (mode === 'demo') {
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-600 border-purple-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          演示模式
        </Badge>
      );
    }

    switch (status) {
      case 'connected':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-600 border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse" />
            已连接
          </Badge>
        );
      case 'connecting':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-600 border-yellow-200">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1 animate-pulse" />
            连接中
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-neutral-100 text-neutral-500 border-neutral-200">
            未连接
          </Badge>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50/50">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-neutral-800">视频直播</h2>
          {getStatusBadge()}
        </div>
        {/* 模拟分析按钮 */}
        <Button
          onClick={() => setShowSimulationSelector(true)}
          variant="outline"
          size="sm"
          className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">模拟分析</span>
        </Button>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-neutral-900">
        {sdkError ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-400">
            <AlertCircle className="w-8 h-8 mr-2" />
            <span>SDK Error: {sdkError}</span>
          </div>
        ) : isSimulationMode && simulationImage ? (
          <img
            src={simulationImage}
            alt="Simulation"
            className="w-full h-full object-contain"
          />
        ) : mode === 'demo' && currentDemoImage ? (
          <img
            src={currentDemoImage}
            alt="Demo"
            className="w-full h-full object-contain"
          />
        ) : (
          <div
            id="mg-player-container"
            ref={containerRef}
            className="w-full h-full"
          />
        )}

        {/* Empty State with Slogan */}
        {status === 'idle' && mode === 'live' && !sdkError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-white">
            <div className="text-center px-4">
              {/* Slogan */}
              <h2 className="text-2xl font-bold text-neutral-800 mb-2">VisiPaws</h2>
              <p className="text-neutral-500 text-sm mb-8">Always See, Always Sure</p>
              {/* Start Button */}
              <Button
                onClick={handleStartLive}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-6 text-lg shadow-lg shadow-primary/30"
              >
                <Play className="w-5 h-5 mr-2" />
                开始直播
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="p-4 border-t border-neutral-200 bg-neutral-50/50">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {/* Stop button - only show when connected/connecting */}
          {status !== 'idle' && (
            <Button
              onClick={handleStopLive}
              variant="destructive"
              className="px-6"
            >
              <Square className="w-4 h-4 mr-2" />
              停止直播
            </Button>
          )}

          {/* 提示：直播时点击播放器上的截图按钮自动进行 AI 分析 */}
          {status === 'connected' && (
            <p className="text-xs text-neutral-500">
              📸 点击播放器上的截图按钮，自动进行 AI 分析
            </p>
          )}
        </div>

        {/* Demo Mode Selector - Integrated */}
        {settings.demoMode && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <DemoModeSelector />
          </div>
        )}

        {/* Simulation Mode Active Banner */}
        {isSimulationMode && (
          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-neutral-700">模拟分析模式</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSimulation}
              className="h-8 px-3 text-neutral-600 hover:text-red-500"
            >
              <X className="w-4 h-4 mr-1" />
              退出
            </Button>
          </div>
        )}
      </div>

      {/* Simulation Selector Dialog */}
      {showSimulationSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-neutral-800">模拟分析</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSimulationSelector(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <DemoModeSelector
              onSelectImage={handleSimulationSelect}
              currentImage={simulationImage}
              onClear={handleClearSimulation}
            />
          </div>
        </div>
      )}
    </div>
  );
}
