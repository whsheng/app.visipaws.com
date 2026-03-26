# PWA 配置说明

## ✅ 已完成的配置

### 1. 启用 PWA
`next.config.mjs`:
```javascript
const withPWAConfig = withPWA({
  dest: 'public',
  register: true,   // ✅ 启用 PWA 注册
  disable: false,   // ✅ 不禁用
});
```

### 2. manifest.json
位置：`/public/manifest.json`
- 应用名称：VisiPaws
- 主题色：#0F172A
- 显示模式：standalone（独立应用）

### 3. PWA 图标
位置：`/public/icons/`
- icon-192x192.svg
- icon-512x512.svg

### 4. Service Worker
自动生成：`/public/sw.js`
自动注册，无需手动配置

### 5. layout.tsx
已添加：
- `<link rel="apple-touch-icon">`
- apple-mobile-web-app-capable meta 标签

---

## 📱 如何测试 PWA

### 在 Chrome/Edge 浏览器中
1. 打开网站
2. 地址栏右侧会出现 **安装图标**（⊕ 或 📥）
3. 点击安装
4. 应用会出现在桌面/开始菜单

### 在 iOS Safari 中
1. 打开网站
2. 点击 **分享按钮**（方框 + 向上箭头）
3. 选择 **"添加到主屏幕"**
4. 应用图标会出现在主屏幕

### 在 Android Chrome 中
1. 打开网站
2. 点击 **菜单（三个点）**
3. 选择 **"安装应用"** 或 **"添加到主屏幕"**

---

## 🔍 验证 PWA 是否工作

### 1. 检查 manifest.json
访问：`https://your-domain.vercel.app/manifest.json`

应该看到：
```json
{
  "name": "VisiPaws - 智能宠物监控平台",
  "short_name": "VisiPaws",
  "start_url": "/",
  "display": "standalone",
  ...
}
```

### 2. 检查 Service Worker
访问：`https://your-domain.vercel.app/sw.js`

应该看到 Service Worker 代码

### 3. Chrome DevTools
1. 按 F12 打开开发者工具
2. 进入 **Application** 标签
3. 左侧选择 **Manifest**
4. 应该看到 manifest 内容且无错误

### 4. Lighthouse 测试
1. 按 F12 打开开发者工具
2. 进入 **Lighthouse** 标签
3. 选择 **Progressive Web App**
4. 点击 **分析页面加载**
5. 查看 PWA 评分

---

## 🚀 部署到 Vercel

### 1. 提交更改
```bash
git add .
git commit -m "feat: 启用 PWA 支持"
git push
```

### 2. 等待 Vercel 自动部署
约 1-2 分钟

### 3. 测试 PWA
访问您的 Vercel 域名，按照上述步骤测试

---

## 📋 PWA 功能清单

- [x] manifest.json
- [x] Service Worker
- [x] 图标文件
- [x] Apple Touch Icon
- [x] 主题色配置
- [x] 离线支持（由 next-pwa 自动处理）
- [x] 可安装性

---

## ⚠️ 注意事项

### 1. HTTPS 要求
PWA **必须**使用 HTTPS（Vercel 自动提供）

### 2. 缓存策略
next-pwa 默认缓存：
- 静态资源（JS、CSS、图片）
- 页面路由

### 3. 更新机制
- Service Worker 会在后台自动更新
- 用户刷新页面后应用新版本

### 4. iOS 限制
- iOS Safari 对 PWA 支持有限
- 部分功能可能不可用（如推送通知）

---

## 🛠️ 故障排查

### PWA 不工作？
1. 检查浏览器控制台是否有错误
2. 检查 manifest.json 是否可访问
3. 检查 Service Worker 是否注册成功
4. 使用 Lighthouse 测试

### 图标不显示？
1. 检查 `/icons/` 目录是否有图标文件
2. 检查 manifest.json 中的路径是否正确
3. 清除浏览器缓存

### 无法安装？
1. 确保使用 HTTPS
2. 检查是否首次访问（需要用户交互）
3. 检查浏览器是否支持 PWA
