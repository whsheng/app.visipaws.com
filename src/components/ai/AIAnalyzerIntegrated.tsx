'use client';

import { useState } from 'react';
import { Brain, Loader2, AlertCircle, CheckCircle, AlertTriangle, History, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/appStore';
import { analyzeImage } from '@/lib/api';
import { AIAnalysisResult } from '@/types';

interface AIAnalyzerIntegratedProps {
  simulationImage?: string | null;
}

export default function AIAnalyzerIntegrated({ simulationImage }: AIAnalyzerIntegratedProps) {
  const { settings, history, addAnalysis } = useAppStore();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 使用模拟图片作为当前分析图片
  const currentImage = simulationImage || (result?.imageUrl || null);

  const handleAnalyze = async (imageBase64: string) => {
    setAnalyzing(true);
    setError(null);

    try {
      const response = await analyzeImage(imageBase64, settings.aiPrompt);

      if (response.status === 'success' && response.result) {
        setResult(response.result);
        addAnalysis(response.result);
      } else {
        setError(response.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setAnalyzing(false);
    }
  };

  // 暴露分析方法给父组件
  interface WindowWithTrigger extends Window {
    triggerAIAnalysis?: (image: string) => void;
  }
  if (typeof window !== 'undefined') {
    (window as WindowWithTrigger).triggerAIAnalysis = handleAnalyze;
  }

  const getStatusIcon = () => {
    if (!result) return null;
    switch (result.petStatus) {
      case 'normal':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'stress':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = () => {
    if (!result) return '';
    switch (result.petStatus) {
      case 'normal':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'stress':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    }
  };

  const getStatusText = () => {
    if (!result) return '';
    switch (result.petStatus) {
      case 'normal':
        return '正常';
      case 'stress':
        return '应激';
      default:
        return '未知';
    }
  };

  // 获取最近 2 条分析历史
  const recentHistory = history.analysis.slice(0, 2);
  const hasMoreHistory = history.analysis.length > 2;

  const handleViewMore = () => {
    window.location.href = '/history';
  };

  return (
    <div className="space-y-4">
      {/* Real-time Analysis */}
      <Card className="bg-white border-neutral-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-neutral-800 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI 智能分析
            </CardTitle>
            {result && (
              <Badge variant="outline" className={getStatusColor()}>
                {getStatusIcon()}
                <span className="ml-1">{getStatusText()}</span>
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {analyzing ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-neutral-500">正在分析中...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-red-500">
              <AlertCircle className="w-8 h-8 mb-4" />
              <p className="text-center">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setError(null)}
              >
                重试
              </Button>
            </div>
          ) : currentImage ? (
            /* 左右分栏布局：桌面端并排，移动端上下 */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 左侧：图片展示 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-700">分析图片</span>
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm">
                  <img
                    src={currentImage}
                    alt="待分析的宠物图片"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* 右侧：AI 分析结果 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-neutral-700">分析结果</span>
                </div>
                {result ? (
                  <div className="space-y-3">
                    {result.abnormalities.length > 0 && (
                      <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                        <h4 className="text-sm font-medium text-neutral-700 mb-2">异常情况</h4>
                        <ul className="space-y-1">
                          {result.abnormalities.map((item, idx) => (
                            <li key={idx} className="text-sm text-red-600 flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.suggestions.length > 0 && (
                      <div className="bg-primary/5 p-3 rounded-xl border border-primary/20">
                        <h4 className="text-sm font-medium text-neutral-700 mb-2">建议</h4>
                        <ul className="space-y-1">
                          {result.suggestions.map((item, idx) => (
                            <li key={idx} className="text-sm text-primary flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
                    <Brain className="w-12 h-12 mb-4 opacity-30" />
                    <p className="text-center">点击 AI 分析按钮开始</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
              <Brain className="w-12 h-12 mb-4 opacity-30" />
              <p className="text-center">点击 AI 分析按钮开始</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History */}
      <Card className="bg-white border-neutral-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-neutral-800 flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              最近分析
            </CardTitle>
            {hasMoreHistory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewMore}
                className="text-primary hover:text-primary text-xs h-7"
              >
                查看更多 →
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {recentHistory.length === 0 ? (
            <div className="text-center py-6 text-neutral-500">
              <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">暂无分析记录</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentHistory.map((analysis) => (
                <button
                  key={analysis.id}
                  onClick={() => window.location.href = '/history'}
                  className="w-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl p-3 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={analysis.imageUrl}
                      alt={`分析记录：${analysis.petStatus}`}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${
                          analysis.petStatus === 'normal' ? 'text-green-600' :
                          analysis.petStatus === 'stress' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {analysis.petStatus === 'normal' ? '✅ 正常' :
                           analysis.petStatus === 'stress' ? '⚠️ 应激' :
                           '❓ 未知'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(analysis.timestamp).toLocaleString()}
                      </p>
                      {analysis.abnormalities.length > 0 && (
                        <p className="text-xs text-neutral-600 mt-1 truncate">
                          {analysis.abnormalities[0]}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
