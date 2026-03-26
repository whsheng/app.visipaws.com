# VisiPaws - 智能宠物监控平台 Always See, Alway Sure

基于 Next.js 的智能宠物监控平台，支持实时视频直播、AI 分析、地图定位等功能，专为青少年科技比赛设计。

![VisiPaws](https://img.shields.io/badge/VisiPaws-v0.1.0-26A69A?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ 功能特性

### 🎯 核心功能

| 功能 | 说明 | 状态 |
|------|------|------|
| 📹 **实时视频直播** | IoT 设备视频流播放 | ✅ |
| 🗺️ **地图定位** | 高德地图显示设备实时位置 | ✅ |
| 🤖 **AI 智能分析** | 阿里百炼通义千问 VL 图像分析 | ✅ |
| 📊 **设备状态监控** | 温度、湿度、GPS 信号、在线状态 | ✅ |
| 📜 **历史记录** | AI 分析记录本地存储 | ✅ |
| 🎭 **模拟分析演示** | 预存图片展示 AI 分析能力 | ✅ |

### 🎨 设计系统

- **主题**：浅色主题，清新现代
- **主色**：`#26A69A`（青绿色）
- **辅助色**：`#4A90E2`（蓝色）
- **圆角**：lg=16px, md=12px, sm=8px, xl=24px
- **字体**：系统字体，清晰易读

### 🚀 最新优化

- ✅ 首页最近分析只显示 2 条，风格与数据页一致
- ✅ 数据页面移除截图标签，直接显示分析历史
- ✅ 分析结果 Dialog 优化，移动端体验更好
- ✅ 地图使用猫咪图标作为 POI 标记
- ✅ 设备温湿度模拟数据（26°C / 60%）
- ✅ 设备在线时每 30 秒自动刷新位置
- ✅ 地图支持手动刷新位置
- ✅ 使用自定义 logo.ico 品牌标识

## 🛠️ 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| **框架** | Next.js (App Router) | 14.2.35 |
| **语言** | TypeScript | 5.x |
| **样式** | Tailwind CSS | 3.4.x |
| **UI 组件** | shadcn/ui | latest |
| **图标** | Lucide React | 1.6.0 |
| **状态管理** | Zustand | 5.0.12 |
| **PWA** | next-pwa | 10.2.9 |
| **地图** | 高德地图 JS API | v2.0 |
| **AI** | 阿里百炼通义千问 | qwen-vl-plus |

## 📦 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd visipaws-next
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入以下配置：

```bash
# 高德地图配置（需要申请）
NEXT_PUBLIC_AMAP_KEY=your_amap_key_here
NEXT_PUBLIC_AMAP_SECURITY_CONFIG=your_amap_security_config_here

# 阿里百炼 API 配置（需要申请）
BAILIAN_API_KEY=your_bailian_api_key_here
BAILIAN_API_URL=https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation

# IoT配置
NEXT_PUBLIC_MG_IMEI=your_device_imei
NEXT_PUBLIC_MG_APP_KEY=your_mg_app_key
```

#### 环境变量说明

| 变量 | 说明 | 必需 | 获取方式 |
|------|------|------|----------|
| `NEXT_PUBLIC_AMAP_KEY` | 高德地图 API Key | 否 | [高德开放平台](https://lbs.amap.com/) |
| `NEXT_PUBLIC_AMAP_SECURITY_CONFIG` | 高德安全密钥 | 否 | 同上 |
| `BAILIAN_API_KEY` | 阿里百炼 API Key | 否 | [阿里云百炼](https://bailian.console.aliyun.com/) |
| `BAILIAN_API_URL` | 阿里百炼 API 地址 | 否 | 默认即可 |
| `NEXT_PUBLIC_MG_IMEI` | 设备 IMEI | 否 | IoT提供 |
| `NEXT_PUBLIC_MG_APP_KEY` | IoT APP Key | 否 | IoT提供 |

> **💡 提示**：
> - 所有环境变量都是可选的，未配置时使用模拟数据
> - 高德地图未配置时，地图页面显示配置指引
> - 阿里百炼未配置时，AI 分析功能不可用
> - IoT未配置时，设备状态使用模拟数据

### 4. 启动开发服务器

```bash
npm run dev
```

访问 **http://localhost:3000**

## 📁 项目结构

```
visipaws-next/
├── public/
│   ├── logo.ico                  # 品牌 Logo
│   ├── icons/
│   │   ├── cat-marker.svg        # 地图猫咪标记
│   │   └── ...                   # PWA 图标
│   ├── demo-images/              # 模拟分析演示图片
│   │   ├── stress-1.jpeg         # 应激图片 1
│   │   ├── stress-2.jpeg         # 应激图片 2
│   │   ├── stress-3.jpeg         # 应激图片 3
│   │   ├── stress-4.jpeg         # 应激图片 4
│   │   └── normal-1.jpg          # 正常图片
│   └── manifest.json             # PWA 配置
│
├── src/
│   ├── app/
│   │   ├── page.tsx              # 首页（视频直播 + AI 分析）
│   │   ├── map/page.tsx          # 地图页面
│   │   ├── history/page.tsx      # 历史记录页面
│   │   ├── settings/page.tsx     # 设置页面
│   │   ├── api/
│   │   │   └── ai-analyze/       # AI 分析 API 路由
│   │   ├── layout.tsx            # 根布局
│   │   └── globals.css           # 全局样式
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx        # 顶部导航
│   │   │   ├── BottomNav.tsx     # 底部导航
│   │   │   └── MainLayout.tsx    # 主布局
│   │   ├── video/
│   │   │   ├── VideoPlayer.tsx   # 视频播放器
│   │   │   └── DemoModeSelector.tsx  # 模拟分析选择器
│   │   ├── ai/
│   │   │   └── AIAnalyzerIntegrated.tsx  # AI 分析组件
│   │   ├── device/
│   │   │   ├── DeviceStatusCompact.tsx   # 紧凑设备状态
│   │   │   └── DeviceStatus.tsx          # 详细设备状态
│   │   ├── map/
│   │   │   └── MapContainer.tsx  # 地图容器
│   │   ├── history/
│   │   │   ├── HistoryList.tsx   # 历史记录列表
│   │   │   └── AIDebugPanel.tsx  # AI 调试面板
│   │   └── ui/                   # shadcn/ui 组件
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── badge.tsx
│   │       └── tabs.tsx
│   │
│   ├── lib/
│   │   ├── api.ts                # API 调用封装
│   │   ├── bailian.ts            # 阿里百炼 API
│   │   ├── amap.ts               # 高德地图 SDK
│   │   ├── mg-sdk.ts             # IoT SDK
│   │   └── utils.ts              # 工具函数
│   │
│   ├── store/
│   │   └── appStore.ts           # Zustand 状态管理
│   │
│   ├── types/
│   │   └── index.ts              # TypeScript 类型定义
│   │
│   └── i18n/                     # 国际化（已简化为中文）
│
├── .env.example                  # 环境变量示例
├── .env.local                    # 本地环境变量（不提交）
├── next.config.mjs               # Next.js 配置
├── tailwind.config.ts            # Tailwind 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json
```

## 🎯 页面说明

### 首页 (`/`)

**功能**：
- 📹 实时视频直播
- 🎭 模拟分析演示（选择图片 → AI 分析）
- 🤖 AI 智能分析（阿里百炼 qwen-vl-plus）
- 📊 设备状态栏（温度、湿度、GPS 信号、在线状态）
- 📜 最近分析（显示最近 2 条记录）

**操作流程**：
1. 点击"开始直播"启动视频流
2. 点击视频右上角"✨ 模拟分析"选择演示图片
3. 点击"AI 分析"进行智能分析
4. 分析结果自动保存到历史记录

---

### 地图页 (`/map`)

**功能**：
- 🗺️ 高德地图显示设备位置
- 🐱 猫咪图标标记当前位置
- 🔄 手动刷新位置按钮
- 📍 位置信息卡片（经纬度、速度、时间）
- ⏱️ 设备在线时每 30 秒自动刷新

**地图标记**：
- 使用自定义 SVG 猫咪图标
- 青绿色圆形设计
- 底部中心对准位置点
- 带有弹跳动画

---

### 数据页 (`/history`)

**功能**：
- 📜 分析历史记录（按时间倒序）
- 🔍 点击查看详情
- 🗑️ 清除所有记录
- 🧪 AI 调试面板（可折叠）

**AI 调试面板**：
- 选择测试图片（正常/应激）
- 编辑分析 Prompt
- 查看 AI 原始响应
- 复制分析结果

---

### 设置页 (`/settings`)

**功能**：
- 🎨 主题设置（浅色主题）
- 🤖 AI Prompt 配置
- 📱 PWA 安装指引
- ℹ️ 关于信息

---

## 🔌 API 集成

### 1. 阿里百炼 AI 分析

**端点**：`POST /api/ai-analyze`

**请求**：
```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQ...",
  "prompt": "请分析这张宠物图片..."
}
```

**响应**：
```json
{
  "status": "success",
  "result": {
    "id": "1234567890",
    "timestamp": 1711440000000,
    "imageUrl": "data:image/jpeg;base64,...",
    "petStatus": "normal",
    "abnormalities": ["发现飞机耳和瞳孔放大"],
    "suggestions": ["保持环境安静"],
    "rawResponse": "{...}"
  }
}
```

**AI Prompt**（默认）：
```
角色定位：
你是一位专业的宠物行为学专家，专门负责分析托运环境下的猫咪应激状态。

任务描述：
请分析这张由 VisiPaws IoT 主机捕获的 1080p 广角图片。图片拍摄于封闭的宠物托运箱内。请根据以下视觉维度，评估猫咪的应激等级：

重点观察指标：
- 耳朵形态：是否出现"飞机耳"（耳朵压平或完全向后）？
- 面部表情：是否张嘴哈气（Hissing）、露出牙齿或咆哮？
- 瞳孔变化：在当前光线下，瞳孔是否剧烈放大成圆形？
- 肢体动作：是否出现身体极度蜷缩、炸毛（毛发竖立）或爪子试探性抬起？

判定标准：
- 平静 (Calm)：身体放松，耳朵自然向上，眼睛半眯或正常。
- 警觉 (Alert)：耳朵竖立转向，眼神锐利，可能有一只爪子抬起试探。
- 应激 (Stressed)：具备上述"重点观察指标"中的 2 项或以上。

输出格式要求（严格按 JSON 返回以便 APP 解析）：
{
  "status": "平静/警觉/应激",
  "reason": "简短的理由，例如：发现飞机耳和瞳孔放大",
  "suggestion": "给主人的建议"
}
```

---

### 2. 设备位置

**端点**：`POST http://open.4s12580.com/open/v1/GetRealtimeTrackList`

**请求**：
```json
{
  "device_id": ["8694970512"],
  "map_coord_type": 2
}
```

**响应字段**：
```typescript
interface DeviceStatus {
  imei: string;
  // 位置
  lat: number;          // 高德纬度
  lng: number;          // 高德经度
  location: string;     // 地址文本
  altitude: number;     // 海拔（米）
  
  // 状态
  isOnline: boolean;    // 在线状态
  drivingStatus: boolean; // 行驶状态
  accStatus: boolean;   // ACC 点火
  
  // 速度和方向
  speed: number;        // km/h
  direction: number;    // 角度
  
  // 信号
  gpsSignal: number;    // GPS 卫星颗数
  beidouSignal: number; // 北斗卫星颗数
  gsmSignal: number;    // GSM 信号
  gpsFlag: number;      // 0=GPS, 2=基站，3=WiFi
  
  // 里程
  totalMileage: number; // 总里程（米）
  todayMileage: number; // 今日里程（米）
  
  // 电池和油量
  voltage: number;      // 电压
  oilLevel: number;     // 油量
  
  // 温湿度（模拟）
  temperature: number;  // 26°C
  humidity: number;     // 60%
  
  // 时间
  gpsTime: string;
  receiveTime: string;
  
  // 报警
  isAlarm: boolean;
  alarmType: string;
  alarmDesc: string;
}
```

---

### 3. 高德地图

**SDK**：`https://webapi.amap.com/maps?v=2.0&key={KEY}`

**使用方式**：
```typescript
import { loadAMapSdk, createMap, createMarker } from '@/lib/amap';

// 加载 SDK
await loadAMapSdk();

// 创建地图
const map = createMap(container, {
  zoom: 15,
  center: [lng, lat],
});

// 创建标记（猫咪图标）
const marker = createMarker([lng, lat], '宠物箱位置', {
  icon: '/icons/cat-marker.svg',
  size: [36, 36],
  anchor: [18, 36],
});
```

---

## 🚀 部署

### 部署到 Vercel

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录并部署**
   ```bash
   vercel login
   vercel
   ```

3. **配置环境变量**
   
   在 Vercel Dashboard → Project Settings → Environment Variables 添加：
   - `BAILIAN_API_KEY`
   - `NEXT_PUBLIC_AMAP_KEY`
   - `NEXT_PUBLIC_AMAP_SECURITY_CONFIG`
   - `NEXT_PUBLIC_MG_IMEI`
   - `NEXT_PUBLIC_MG_APP_KEY`

4. **绑定自定义域名**
   
   在 Vercel Dashboard → Domain 添加 `app.visipaws.com`

---

### 本地构建测试

```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

访问 http://localhost:3000

---

## 📱 PWA 支持

### 安装应用

**桌面端**：
1. 访问网站
2. 浏览器地址栏出现安装图标
3. 点击安装

**移动端**：
1. 使用 Chrome/Safari 访问
2. 点击分享按钮
3. 选择"添加到主屏幕"

### PWA 配置

编辑 `public/manifest.json`：
```json
{
  "name": "VisiPaws - 智能宠物监控平台",
  "short_name": "VisiPaws",
  "description": "Smart Pet Monitoring Platform with AI Analysis",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F5F7F6",
  "theme_color": "#26A69A",
  "icons": [...]
}
```

---

## 🧪 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# TypeScript 检查
npx tsc --noEmit
```

---

## 📝 更新日志

### v0.1.0 (2026-03-26)

**功能**：
- ✅ 完成浅色主题设计系统
- ✅ 实现模拟分析演示功能
- ✅ 集成阿里百炼 AI 分析
- ✅ 集成高德地图定位
- ✅ 集成IoT设备 SDK
- ✅ 实现历史记录管理
- ✅ 添加 AI 调试面板

**优化**：
- ✅ 首页最近分析简化为 2 条
- ✅ 数据页面移除截图标签
- ✅ 分析结果 Dialog 移动端优化
- ✅ 地图使用猫咪图标
- ✅ 设备状态自动刷新逻辑
- ✅ 温湿度模拟数据

**修复**：
- ✅ 修复图片 Base64 转换问题
- ✅ 修复 Dialog 关闭功能
- ✅ 修复 API 500 错误

---

## ⚠️ 注意事项

1. **高德地图 API Key**
   - 需要申请 Web 端（JS API）Key
   - 配置安全密钥（白名单域名）
   - 本地开发可使用 localhost

2. **阿里百炼 API Key**
   - 在阿里云百炼控制台申请
   - 使用 `qwen-vl-plus` 模型
   - API Key 保存在服务端，不要泄露

3. **麦谷车联设备**
   - 需要真实设备在线
   - IMEI 和 APP Key 由设备提供
   - 设备离线时使用最后已知位置

4. **模拟数据**
   - 温湿度：26°C / 60%（设备未接传感器）
   - 设备状态：离线时显示模拟数据
   - 地图：未配置 API Key 时显示深圳南山

5. **PWA**
   - 开发环境禁用 PWA
   - 生产环境自动启用
   - 需要 HTTPS（localhost 除外）

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 📧 联系方式

- **项目**：VisiPaws - 智能宠物监控平台
- **用途**：青少年科技比赛
- **版本**：v0.1.0
- **最后更新**：2026-03-26

---

<div align="center">

**VisiPaws** - Always See, Always Sure

</div>
