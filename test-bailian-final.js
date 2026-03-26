#!/usr/bin/env node
/**
 * 阿里百炼 API 测试脚本
 * 使用方法：node test-bailian-final.js [图片 URL 或 Base64]
 */

const fs = require('fs');
const path = require('path');

// 读取.env.local
const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

const BAILIAN_API_KEY = envVars.BAILIAN_API_KEY;
const BAILIAN_API_URL = envVars.BAILIAN_API_URL || 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';

// const BAILIAN_API_KEY = 'sk-8b139cd0a0304e71b288f7768b58cddf';
// const BAILIAN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';


// 获取命令行参数
const imageInput = process.argv[2] || '';

// 确定图片内容
let imageContent;
if (imageInput.startsWith('http')) {
  imageContent = imageInput;
  console.log('🖼️  使用图片 URL:', imageInput);
} else if (imageInput.startsWith('data:')) {
  imageContent = imageInput;
  console.log('🖼️  使用 Base64 图片');
} else if (imageInput) {
  imageContent = `data:image/jpeg;base64,${imageInput}`;
  console.log('🖼️  使用 Base64 图片');
} else {
  console.log('⚠️  未提供图片，请使用: node test-bailian-final.js <图片 URL 或 Base64>');
  console.log('');
  console.log('示例:');
  console.log('  node test-bailian-final.js https://example.com/image.jpg');
  console.log('  node test-bailian-final.js /9j/4AAQSkZJRg...');
  process.exit(1);
}

const TEST_PROMPT = '请分析这张图片，描述你看到的内容。';

async function test() {
  console.log('\n📋 配置:');
  console.log('   API Key:', BAILIAN_API_KEY ? `${BAILIAN_API_KEY.substring(0, 10)}...` : '❌');
  console.log('   API URL:', BAILIAN_API_URL);
  console.log('');

  const requestBody = {
    model: 'qwen3-vl-plus',
    input: {
      messages: [{
        role: 'user',
        content: [{ image: imageContent }, { text: TEST_PROMPT }]
      }]
    }
  };

  console.log('📤 发送请求...');
  const start = Date.now();

  try {
    const response = await fetch(BAILIAN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BAILIAN_API_KEY}`
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(30000)
    });

    const duration = Date.now() - start;
    console.log(`\n📥 响应 (耗时：${duration}ms)`);
    console.log('   状态码:', response.status);
    console.log('   状态:', response.statusText);
    console.log('');

    const data = await response.json();

    if (response.ok) {
      console.log('✅ 成功！\n');
      const content = data.output?.choices?.[0]?.message?.content;
      const text = Array.isArray(content) ? content.map(c => c.text).join('') : content;
      console.log('📝 AI 响应:');
      console.log(text);
    } else {
      console.log('❌ 失败！\n');
      console.log('完整响应:', JSON.stringify(data, null, 2));
      
      if (data.error?.code === 'InvalidApiKey') {
        console.log('\n💡 API Key 无效！请在 Cherry Studio 中检查正确的 API Key。');
      }
    }
  } catch (error) {
    console.log('\n❌ 错误:', error.message);
  }
}

test();
