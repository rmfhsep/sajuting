import { SajuResult, GwansangResult, SajuReading, GwansangReading } from '../types';

export let demoMode = false;
export const setDemoMode = (val: boolean) => { demoMode = val; };

export const DEMO_USER = { id: 0, email: 'demo@saju.app', name: '데모 사용자' };
export const DEMO_TOKEN = 'demo-access-token';

const SAJU_RESULT: SajuResult = {
  saju: '甲子年 丙子月 甲午日 — 목화(木火)가 왕성한 명조입니다. 창의력과 열정이 넘치며 리더십이 강한 사주입니다.',
  elements:
    '오행 분포: 목(木) 40%, 화(火) 30%, 토(土) 15%, 수(水) 10%, 금(金) 5%.\n목화가 왕성하여 에너지가 넘치고 창조적 성향이 강합니다. 금(金)이 다소 부족하여 때로는 결단력이 흔들릴 수 있습니다.',
  personality:
    '열정적이고 창의적인 성격으로 새로운 것을 즐깁니다. 사람들과 어울리기 좋아하며 자연스럽게 리더 역할을 맡게 됩니다. 직관적이고 행동력이 강하지만 때로는 충동적일 수 있으니 신중함을 기르는 것이 중요합니다.',
  fortune:
    '올해는 변화와 성장의 해입니다. 상반기에 직장 또는 사업에서 좋은 기회가 찾아오며 귀인을 만날 가능성이 높습니다. 하반기에는 재물운이 상승하니 적극적으로 기회를 잡으세요.',
  advice:
    '심장과 혈압 관리에 신경 쓰세요. 중요한 결정을 내릴 때 충동을 자제하고 신중하게 생각하는 습관이 필요합니다. 봄·여름에 활동을 늘리면 운이 더욱 상승합니다.',
};

const GWANSANG_RESULT: GwansangResult = {
  overall:
    '귀한 관상입니다. 이마가 넓고 광채가 있으며 이목구비가 조화롭게 배치되어 있습니다. 총명하고 덕망이 있어 주변 사람들에게 신뢰받는 인상으로, 중년 이후 크게 운이 열리는 상입니다.',
  eyes: '눈빛이 맑고 총기가 넘쳐 지혜와 통찰력이 뛰어납니다. 눈매가 부드러우면서도 의지가 있어 신뢰감을 주며, 관찰력이 탁월합니다.',
  nose: '코가 단정하고 콧대가 뚜렷합니다. 자존심이 강하고 독립적인 성향으로 재물복이 있는 관상입니다. 특히 40대 이후 경제적 풍요를 누릴 수 있습니다.',
  lips: '입술이 적당하고 인중이 선명합니다. 언변이 뛰어나고 설득력이 있어 대인관계가 원만하며, 먹고사는 걱정 없는 복록(福祿)의 상입니다.',
  forehead:
    '이마가 넓고 밝아 총명함과 관운(官運)이 있습니다. 초년운이 좋아 학업에서 성과를 거두었거나 거둘 것이며, 윗사람의 도움을 받는 복된 이마입니다.',
  fortune:
    '전반적으로 길한 관상으로 노력한 만큼 결실을 맺는 복된 인상입니다. 30대 후반부터 운이 상승하여 40~50대에 전성기를 맞이할 것입니다. 인복이 많아 좋은 동반자와 함께 성공적인 삶을 만들어갈 것입니다.',
};

const now = Date.now();

export const DEMO_SAJU_READINGS: SajuReading[] = [
  {
    id: 1,
    birthDate: '19900315',
    birthTime: '午(오)시 11-13시',
    gender: '남',
    result: SAJU_RESULT,
    createdAt: new Date(now - 86400000 * 3).toISOString(),
  },
  {
    id: 2,
    birthDate: '19920820',
    birthTime: '모름',
    gender: '여',
    result: {
      ...SAJU_RESULT,
      fortune: '올해 하반기에 큰 전환점이 찾아옵니다. 새로운 인연과 기회가 동시에 열리는 시기로, 두려워하지 말고 변화를 받아들이세요.',
    },
    createdAt: new Date(now - 86400000 * 10).toISOString(),
  },
];

export const DEMO_GWANSANG_READINGS: GwansangReading[] = [
  {
    id: 1,
    imageUrl: '',
    result: GWANSANG_RESULT,
    createdAt: new Date(now - 86400000).toISOString(),
  },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const demoSajuAnalyze = async () => {
  await delay(1800);
  return { data: { result: SAJU_RESULT } };
};

export const demoGwansangAnalyze = async () => {
  await delay(2000);
  return { data: { result: GWANSANG_RESULT } };
};

export const demoGetSajuHistory = async () => {
  await delay(300);
  return { data: { readings: DEMO_SAJU_READINGS } };
};

export const demoGetGwansangHistory = async () => {
  await delay(300);
  return { data: { readings: DEMO_GWANSANG_READINGS } };
};
