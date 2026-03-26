'use client';

import { useState } from 'react';
import { Brain, Loader2, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/appStore';
import { analyzeImage } from '@/lib/api';
import { AIAnalysisResult } from '@/types';

interface AIAnalyzerProps {
  onAnalysisComplete?: (result: AIAnalysisResult) => void;
}

export default function AIAnalyzer({ onAnalysisComplete }: AIAnalyzerProps) {
  const { settings, addAnalysis } = useAppStore();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (imageBase64: string) => {
    setAnalyzing(true);
    setError(null);

    try {
      const response = await analyzeImage(imageBase64, settings.aiPrompt);

      if (response.status === 'success' && response.result) {
        setResult(response.result);
        addAnalysis(response.result);
        onAnalysisComplete?.(response.result);
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

  return (
    <Card className="glass-card border-slate-700/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
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
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-4" />
            <p className="text-slate-400">正在分析中...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-red-400">
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
        ) : result ? (
          <div className="space-y-4">
            {/* Analysis Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900">
              <img
                src={result.imageUrl}
                alt="Analyzed"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Pet Status */}
            <div className="glass-card p-3 rounded-xl">
              <h4 className="text-sm font-medium text-slate-400 mb-2">
                宠物状态
              </h4>
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className={`font-semibold ${
                  result.petStatus === 'normal' ? 'text-green-400' :
                  result.petStatus === 'stress' ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {getStatusText()}
                </span>
              </div>
            </div>

            {/* Abnormalities */}
            {result.abnormalities.length > 0 && (
              <div className="glass-card p-3 rounded-xl">
                <h4 className="text-sm font-medium text-slate-400 mb-2">
                  异常情况
                </h4>
                <ul className="space-y-1">
                  {result.abnormalities.map((item, idx) => (
                    <li key={idx} className="text-sm text-red-300 flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="glass-card p-3 rounded-xl">
                <h4 className="text-sm font-medium text-slate-400 mb-2">
                  建议
                </h4>
                <ul className="space-y-1">
                  {result.suggestions.map((item, idx) => (
                    <li key={idx} className="text-sm text-cyan-300 flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Raw Response (collapsible) */}
            <details className="text-xs">
              <summary className="text-slate-500 cursor-pointer hover:text-slate-400">
                查看原始响应
              </summary>
              <pre className="mt-2 p-3 bg-slate-900/50 rounded-lg text-slate-400 overflow-auto max-h-40">
                {result.rawResponse}
              </pre>
            </details>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400">
            <Brain className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">AI 智能分析</p>
            <p className="text-sm mt-2">点击 AI 分析按钮开始</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
