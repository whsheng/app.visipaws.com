'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, Trash2, AlertCircle, Box, Globe, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAppStore } from '@/store/appStore';
import MainLayout from '@/components/layout/MainLayout';

const VERSION = '1.0.0';
const WEBSITE = 'https://visipaws.com';

export default function SettingsPage() {
  const router = useRouter();
  const { settings, deviceInfo, setDeviceInfo, setAiPrompt, clearHistory } = useAppStore();
  const [prompt, setPrompt] = useState(settings.aiPrompt);
  const [saved, setSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // 设备信息本地状态
  const [deviceData, setDeviceData] = useState({
    boxId: deviceInfo.boxId || '',
    petName: deviceInfo.petName || '',
    emergencyPhone: deviceInfo.emergencyPhone || '',
  });

  const handleSavePrompt = () => {
    setAiPrompt(prompt);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveDeviceInfo = () => {
    setDeviceInfo(deviceData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-neutral-500 hover:text-neutral-700"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-neutral-800">设置</h1>
        </div>

        {/* 1. AI 分析提示词 */}
        <Card className="bg-white border-neutral-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-neutral-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              AI 分析提示词
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-neutral-600">自定义 AI 分析的提示词，以获得更精准的分析结果</p>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="请输入 AI 分析提示词..."
              className="min-h-[120px] bg-neutral-50 border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-primary/20"
            />
            <div className="flex items-center justify-between">
              <Button
                onClick={handleSavePrompt}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                {saved ? '已保存' : '保存'}
              </Button>
              {saved && (
                <span className="text-sm text-green-600">✓ 已保存</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 2. 设备信息 */}
        <Card className="bg-white border-neutral-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-neutral-800 flex items-center gap-2">
              <Box className="w-5 h-5 text-primary" />
              设备信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm text-neutral-600">宠物箱 ID</label>
                <Input
                  value={deviceData.boxId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeviceData({ ...deviceData, boxId: e.target.value })}
                  placeholder="请输入宠物箱 ID"
                  className="bg-neutral-50 border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-neutral-600">宠物昵称</label>
                <Input
                  value={deviceData.petName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeviceData({ ...deviceData, petName: e.target.value })}
                  placeholder="请输入宠物昵称"
                  className="bg-neutral-50 border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-neutral-600">紧急联系电话</label>
                <Input
                  value={deviceData.emergencyPhone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeviceData({ ...deviceData, emergencyPhone: e.target.value })}
                  placeholder="请输入紧急联系电话"
                  className="bg-neutral-50 border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>
            <Button
              onClick={handleSaveDeviceInfo}
              className="bg-cyan-500 hover:bg-cyan-600 text-white w-full sm:w-auto"
            >
              保存设备信息
            </Button>
            {saved && (
              <span className="text-sm text-green-600">✓ 已保存</span>
            )}
          </CardContent>
        </Card>

        {/* 3. 关于 */}
        <Card className="bg-white border-neutral-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-neutral-800 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              关于
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-neutral-200">
                <span className="text-sm text-neutral-600">版本号</span>
                <span className="text-sm text-neutral-800 font-mono">v{VERSION}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-neutral-600 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  官网
                </span>
                <a 
                  href={WEBSITE} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                  {WEBSITE}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="bg-slate-700/50" />

        {/* 4. 清除数据 */}
        <Card className="glass-card border-slate-700/50 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-neutral-800 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              清除数据
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600 mb-4">清除所有历史记录、截图和 AI 分析数据</p>
            <Button
              variant="destructive"
              onClick={() => setShowClearConfirm(true)}
              className="w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              清除数据
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Clear Confirm Dialog */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="bg-white border-neutral-200">
          <DialogHeader>
            <DialogTitle className="text-neutral-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              清除数据
            </DialogTitle>
            <DialogDescription className="text-neutral-600">
              确定要清除所有历史记录和分析数据吗？此操作不可恢复。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowClearConfirm(false)}
              className="border-neutral-300"
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearData}
            >
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
