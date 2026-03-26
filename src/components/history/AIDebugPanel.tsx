'use client';

import { useState } from 'react';
import { Brain, TestTube, Copy, Check, Image, Sparkles, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/appStore';
import { analyzeImage } from '@/lib/api';
import { AIAnalysisResult } from '@/types';
import DemoModeSelector from '@/components/video/DemoModeSelector';

const DEFAULT_PROMPT = `角色定位：
你是一位专业的宠物行为学专家，专门负责分析托运环境下的猫咪应激状态。

任务描述：
请分析这张由 VisiPaws IoT 主机捕获的 1080p 广角图片。图片拍摄于封闭的宠物托运箱内。请根据以下视觉维度，评估猫咪的应激等级：

重点观察指标：

耳朵形态：是否出现"飞机耳"（耳朵压平或完全向后）？

面部表情：是否张嘴哈气（Hissing）、露出牙齿或咆哮？

瞳孔变化：在当前光线下，瞳孔是否剧烈放大成圆形？

肢体动作：是否出现身体极度蜷缩、炸毛（毛发竖立）或爪子试探性抬起？

判定标准：
- 平静 (Calm)：身体放松，耳朵自然向上，眼睛半眯或正常。
- 警觉 (Alert)：耳朵竖立转向，眼神锐利，可能有一只爪子抬起试探。
- 应激 (Stressed)：具备上述"重点观察指标"中的 2 项或以上。

输出格式要求（严格按 JSON 返回以便 APP 解析）：
{
"status": "平静/警觉/应激",
"reason": "简短的理由，例如：发现飞机耳和瞳孔放大",
"suggestion": "给主人的建议"
}`;

export default function AIDebugPanel() {
  const { history } = useAppStore();
  const [testImage, setTestImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // 默认收起

  // 使用最近的分析记录作为测试图片
  const recentAnalysis = history.analysis[0];

  // 处理图片选择
  const handleSelectImage = (image: string, type?: 'normal' | 'stress') => {
    setTestImage(image);
    setShowImageSelector(false);
  };

  const handleClearImage = () => {
    setTestImage(null);
  };

  const handleTest = async () => {
    const imageToTest = testImage || recentAnalysis?.imageUrl;
    if (!imageToTest) {
      setError('请先选择测试图片');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      // 如果图片是 URL 或本地路径，需要转换为 Base64
      let imageBase64 = imageToTest;
      
      // 检测是否是 HTTP URL 或本地路径（不是 data:开头）
      if (imageToTest.startsWith('http') || imageToTest.startsWith('/')) {
        const response = await fetch(imageToTest);
        if (!response.ok) {
          throw new Error(`图片加载失败：${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        
        // 验证 blob 是否为图片
        if (!blob.type.startsWith('image/')) {
          throw new Error(`无效的图片格式：${blob.type}`);
        }
        
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Base64 转换失败'));
          reader.readAsDataURL(blob);
        });
      }

      const response = await analyzeImage(imageBase64, prompt);
      if (response.status === 'success' && response.result) {
        setResult(response.result);
      } else {
        setError(response.error || '分析失败');
      }
    } catch (err) {
      console.error('AI analysis error:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyRaw = () => {
    if (result?.rawResponse) {
      navigator.clipboard.writeText(result.rawResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUseRecentImage = () => {
    if (recentAnalysis) {
      setTestImage(recentAnalysis.imageUrl);
    }
  };

  return (
    <Card className="bg-white border-neutral-200 shadow-sm">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="text-base font-semibold text-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-primary" />
            <span>AI 分析调试面板</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-neutral-500"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? '收起 ▲' : '展开 ▼'}
          </Button>
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
        {/* 测试图片选择 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-700">测试图片</label>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageSelector(true)}
                className="text-primary hover:text-primary"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                选择图片
              </Button>
              {recentAnalysis && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUseRecentImage}
                  className="text-neutral-600"
                >
                  使用最近分析
                </Button>
              )}
            </div>
          </div>
          {testImage ? (
            <div className="relative">
              <img
                src={testImage}
                alt="Test"
                className="w-full h-32 object-cover rounded-lg border border-neutral-200"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearImage}
                className="absolute top-2 right-2 h-6 w-6 p-0 bg-white/90"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-neutral-300 rounded-lg text-center text-neutral-500">
              <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">未选择图片</p>
              <p className="text-xs mt-1">点击「选择图片」或「使用最近分析」</p>
            </div>
          )}
        </div>

        {/* Prompt 编辑 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">分析 Prompt</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] bg-white border-neutral-300 text-neutral-800"
          />
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPrompt(DEFAULT_PROMPT)}
              className="text-neutral-600"
            >
              恢复默认
            </Button>
            <Button
              onClick={handleTest}
              disabled={analyzing || (!testImage && !recentAnalysis)}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              {analyzing ? '分析中...' : '开始测试'}
            </Button>
          </div>
        </div>

        {/* 错误显示 */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            ❌ {error}
          </div>
        )}

        {/* 分析结果 */}
        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={
                result.petStatus === 'normal' ? 'bg-green-100 text-green-700 border-green-200' :
                result.petStatus === 'stress' ? 'bg-red-100 text-red-700 border-red-200' :
                'bg-yellow-100 text-yellow-700 border-yellow-200'
              }>
                {result.petStatus === 'normal' ? '✅ 正常' :
                 result.petStatus === 'stress' ? '⚠️ 应激' :
                 '❓ 未知'}
              </Badge>
            </div>

            {/* 异常情况 */}
            {result.abnormalities.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-sm font-medium text-red-800 mb-2">异常情况</h4>
                <ul className="space-y-1 text-sm text-red-700">
                  {result.abnormalities.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 建议 */}
            {result.suggestions.length > 0 && (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <h4 className="text-sm font-medium text-neutral-800 mb-2">建议</h4>
                <ul className="space-y-1 text-sm text-primary">
                  {result.suggestions.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 原始响应 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-700">AI 原始响应</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyRaw}
                  className="h-7 text-neutral-600"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? '已复制' : '复制'}
                </Button>
              </div>
              <pre className="p-3 bg-neutral-100 border border-neutral-200 rounded-lg text-xs text-neutral-800 whitespace-pre-wrap max-h-60 overflow-auto">
                {result.rawResponse}
              </pre>
            </div>
          </div>
        )}
        </CardContent>
      )}

      {/* Image Selector Dialog */}
      {showImageSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-neutral-800">选择测试图片</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageSelector(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <DemoModeSelector
              onSelectImage={handleSelectImage}
              currentImage={testImage}
              onClear={handleClearImage}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
