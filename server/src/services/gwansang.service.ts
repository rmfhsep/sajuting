import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function analyzeGwansang(imagePath: string) {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  const ext = path.extname(imagePath).toLowerCase();
  const mediaType = ext === '.png' ? 'image/png' : 'image/jpeg';

  const prompt = `당신은 한국의 전통 관상학 전문가입니다. 이 얼굴 사진을 보고 관상을 분석해주세요.

다음 JSON 형식으로 응답해주세요 (JSON 외 다른 텍스트 없이):
{
  "overall": "전체적인 관상 분석 및 인상 (4-5문장)",
  "eyes": "눈의 관상 분석 (2-3문장)",
  "nose": "코의 관상 분석 (2-3문장)",
  "lips": "입의 관상 분석 (2-3문장)",
  "forehead": "이마의 관상 분석 (2-3문장)",
  "fortune": "관상으로 보는 운세와 특성 (4-5문장)"
}`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Image } },
          { type: 'text', text: prompt },
        ],
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid response format');

  return JSON.parse(jsonMatch[0]);
}
