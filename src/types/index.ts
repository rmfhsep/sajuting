export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SajuReading {
  id: number;
  birthDate: string;
  birthTime: string;
  gender: string;
  result: SajuResult;
  createdAt: string;
}

export interface SajuResult {
  saju: string;
  elements: string;
  personality: string;
  fortune: string;
  advice: string;
}

export interface GwansangReading {
  id: number;
  imageUrl: string;
  result: GwansangResult;
  createdAt: string;
}

export interface GwansangResult {
  overall: string;
  eyes: string;
  nose: string;
  lips: string;
  forehead: string;
  fortune: string;
}
