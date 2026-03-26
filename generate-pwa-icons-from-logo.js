#!/usr/bin/env node
/**
 * 使用 logo.png 生成 PWA 图标
 * 使用方法：node generate-pwa-icons-from-logo.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, 'public/logo.png');
const iconsDir = path.join(__dirname, 'public/icons');

// 需要的图标尺寸
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  // 检查 logo 是否存在
  if (!fs.existsSync(logoPath)) {
    console.error('❌ logo.png 不存在！');
    process.exit(1);
  }

  // 创建图标目录
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
    console.log('✅ 创建图标目录:', iconsDir);
  }

  console.log('🔄 开始生成 PWA 图标...\n');

  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',  // 保持比例
          background: { r: 15, g: 23, b: 42, alpha: 1 } // #0F172A 背景
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ 生成：icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ 生成 icon-${size}x${size}.png 失败:`, error.message);
    }
  }

  console.log('\n✅ PWA 图标生成完成！');
  console.log('\n📍 图标位置:', iconsDir);
}

generateIcons();
