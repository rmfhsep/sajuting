import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function analyzeSaju(birthDate: string, birthTime: string, gender: string) {
  const year = birthDate.slice(0, 4);
  const month = birthDate.slice(4, 6);
  const day = birthDate.slice(6, 8);

  const prompt = `당신은 한국의 전통 사주명리학 전문가입니다. 아래 정보를 바탕으로 사주팔자를 분석해주세요.

생년월일: ${year}년 ${month}월 ${day}일
태어난 시: ${birthTime}
성별: ${gender}성

다음 JSON 형식으로 응답해주세요 (JSON 외 다른 텍스트 없이):
{
  "saju": "사주팔자 천간지지 설명 (3-4문장)",
  "elements": "오행 분석 - 목화토금수 비율과 특성 (3-4문장)",
  "personality": "성격과 기질 분석 (4-5문장)",
  "fortune": "전반적인 운세와 인생의 흐름 (4-5문장)",
  "advice": "이 사주를 가진 분께 드리는 조언 (3-4문장)"
}`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid response format');

  return JSON.parse(jsonMatch[0]);
}
