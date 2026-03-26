'use client';

import { useState } from 'react';
import { History, Trash2, Brain, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAppStore } from '@/store/appStore';
import { AIAnalysisResult } from '@/types';

export default function HistoryList() {

  const { history, clearHistory } = useAppStore();
  const [selectedAnalysis, setSelectedAnalysis] = useState<AIAnalysisResult | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClear = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600';
      case 'stress':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <Card className="bg-white border-neutral-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-neutral-800 flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            分析历史
          </CardTitle>
          {history.analysis.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setShowClearConfirm(true)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              清除
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {history.analysis.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>暂无分析记录</p>
            <p className="text-xs mt-2">在首页进行 AI 分析后，记录会显示在这里</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.analysis.map((analysis) => (
              <button
                key={analysis.id}
                onClick={() => setSelectedAnalysis(analysis)}
                className="w-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl p-3 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={analysis.imageUrl}
                    alt="Analysis"
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${getStatusColor(analysis.petStatus)}`}>
                        {analysis.petStatus === 'normal' ? '✅ 正常' :
                         analysis.petStatus === 'stress' ? '⚠️ 应激' :
                         '❓ 未知'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      {formatTime(analysis.timestamp)}
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

      {/* Analysis Detail Dialog */}
      <Dialog open={!!selectedAnalysis} onOpenChange={(open) => !open && setSelectedAnalysis(null)}>
        <DialogContent className="bg-white border-neutral-200 max-w-md max-h-[90vh] overflow-y-auto p-0">
          {/* Header with Close Button */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-800">分析结果</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-neutral-500 hover:text-neutral-700"
              onClick={() => setSelectedAnalysis(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          {selectedAnalysis && (
            <div className="p-4 space-y-4">
              {/* Image */}
              <div className="relative">
                <img
                  src={selectedAnalysis.imageUrl}
                  alt="Analyzed"
                  className="w-full aspect-video object-cover rounded-lg"
                />
                {/* Status Badge on Image */}
                <div className="absolute top-2 left-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                    selectedAnalysis.petStatus === 'normal'
                      ? 'bg-green-500/90 text-white'
                      : selectedAnalysis.petStatus === 'stress'
                      ? 'bg-red-500/90 text-white'
                      : 'bg-yellow-500/90 text-white'
                  }`}>
                    {selectedAnalysis.petStatus === 'normal' ? '✅ 正常' :
                     selectedAnalysis.petStatus === 'stress' ? '⚠️ 应激' :
                     '❓ 未知'}
                  </span>
                </div>
              </div>

              {/* Time */}
              <div className="text-xs text-neutral-500 text-center">
                {formatTime(selectedAnalysis.timestamp)}
              </div>

              {/* Abnormalities */}
              {selectedAnalysis.abnormalities.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-red-800">异常情况</span>
                  </div>
                  <ul className="space-y-1">
                    {selectedAnalysis.abnormalities.map((item, idx) => (
                      <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {selectedAnalysis.suggestions.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-neutral-800">💡 建议</span>
                  </div>
                  <ul className="space-y-1">
                    {selectedAnalysis.suggestions.map((item, idx) => (
                      <li key={idx} className="text-sm text-primary flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Raw Response (Collapsible) */}
              {selectedAnalysis.rawResponse && (
                <details className="group">
                  <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700 flex items-center gap-1">
                    查看 AI 原始响应
                    <span className="transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <pre className="mt-2 p-3 bg-neutral-100 border border-neutral-200 rounded-lg text-xs text-neutral-700 whitespace-pre-wrap max-h-40 overflow-auto">
                    {selectedAnalysis.rawResponse}
                  </pre>
                </details>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Clear Confirm Dialog */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="bg-white border-neutral-200">
          <DialogHeader>
            <DialogTitle className="text-neutral-800">清除数据</DialogTitle>
            <DialogDescription className="text-neutral-600">
              确定要清除所有数据吗？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowClearConfirm(false)}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleClear}
            >
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
