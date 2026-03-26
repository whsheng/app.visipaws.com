// 阿里百炼 API 封装
const BAILIAN_API_KEY = process.env.BAILIAN_API_KEY || '';
// 默认使用海外 endpoint（优化 Vercel 部署性能）
const BAILIAN_API_URL = process.env.BAILIAN_API_URL || 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';

export interface BailianResponse {
  output?: {
    choices?: Array<{
      message?: {
        content?: Array<{
          text?: string;
        }>;
      };
    }>;
  };
  error?: {
    message: string;
  };
}

// 解析 AI 响应文本（支持 JSON 格式）
export function parseAIResponse(text: string) {
  const result = {
    petStatus: 'unknown' as 'normal' | 'stress' | 'unknown',
    abnormalities: [] as string[],
    suggestions: [] as string[],
    rawResponse: text,
  };

  // 尝试解析 JSON 格式
  try {
    // 提取 JSON 部分（可能包含在代码块中）
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      const parsed = JSON.parse(jsonStr);
      
      // 解析状态
      if (parsed.status) {
        const status = parsed.status.toLowerCase();
        if (status.includes('平静') || status.includes('calm')) {
          result.petStatus = 'normal';
        } else if (status.includes('应激') || status.includes('stressed')) {
          result.petStatus = 'stress';
        } else {
          result.petStatus = 'unknown'; // 警觉或其他状态
        }
      }
      
      // 解析理由作为异常情况
      if (parsed.reason) {
        result.abnormalities.push(parsed.reason);
      }
      
      // 解析建议
      if (parsed.suggestion) {
        result.suggestions.push(parsed.suggestion);
      }
      
      return result;
    }
  } catch (e) {
    // JSON 解析失败，使用原有逻辑
    console.warn('JSON parse failed, using fallback:', e);
  }

  // 备用解析逻辑（非 JSON 格式）
  // 尝试解析状态
  if (text.includes('正常') || text.includes('normal') || text.includes('健康') || text.includes('平静') || text.includes('calm')) {
    result.petStatus = 'normal';
  } else if (text.includes('应激') || text.includes('stress') || text.includes('异常') || text.includes('abnormal')) {
    result.petStatus = 'stress';
  }

  // 尝试提取异常和建议（基于常见格式）
  const lines = text.split('\n').filter(line => line.trim());

  let inAbnormalSection = false;
  let inSuggestionSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // 检测异常部分
    if (trimmed.includes('异常') || trimmed.includes('问题') || trimmed.includes('abnormal') || trimmed.includes('reason')) {
      inAbnormalSection = true;
      inSuggestionSection = false;
      continue;
    }

    // 检测建议部分
    if (trimmed.includes('建议') || trimmed.includes('suggestion') || trimmed.includes('recommend')) {
      inAbnormalSection = false;
      inSuggestionSection = true;
      continue;
    }

    // 收集内容
    if (trimmed.startsWith('-') || trimmed.startsWith('•') || /^\d+\./.test(trimmed)) {
      const content = trimmed.replace(/^[-•\d.\s]+/, '').trim();
      if (content && inAbnormalSection) {
        result.abnormalities.push(content);
      } else if (content && inSuggestionSection) {
        result.suggestions.push(content);
      }
    }
  }

  // 如果没有结构化解析出内容，将整段作为原始响应
  if (result.abnormalities.length === 0 && result.suggestions.length === 0) {
    // 尝试从文本中提取列表项
    const listItems = text.match(/[-•]\s*(.+)/g);
    if (listItems) {
      result.abnormalities = listItems.map(item => item.replace(/^[-•]\s*/, ''));
    }
  }

  return result;
}

// 调用阿里百炼 API
export async function callBailianAPI(
  imageBase64: string,
  prompt?: string
): Promise<BailianResponse> {
  const defaultPrompt = `角色定位：
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

  const requestBody = {
    model: 'qwen3-vl-plus',
    input: {
      messages: [
        {
          role: 'user',
          content: [
            {
              image: imageBase64,
            },
            {
              text: prompt || defaultPrompt,
            },
          ],
        },
      ],
    },
  };

  const response = await fetch(BAILIAN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BAILIAN_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(30000), // 30 秒超时
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}
