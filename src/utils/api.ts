export const QR_CODE_URL = "https://my.trainmore.nl/nox/v1/customerqrcode/";
export const CHECKIN_HISTORY_URL =
  "https://my.trainmore.nl/nox/v1/studios/checkin/history/report";
export const LOGIN_URL = "https://my.trainmore.nl/login";
export const REGISTER_URL = "https://my.trainmore.nl/v2/public/register";

export const FACILITY_GROUP =
  "BRANDEDAPPTMBTYDONOTDELETE-A475E445911448AA852F4B86D904D3E2";
export const HEADERS = {
  "x-public-facility-group": FACILITY_GROUP,
  "x-nox-client-type": "APP_V5",
  "x-nox-client-version": "3.68.0",
  "Content-Type": "application/json",
} as const;

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface ApiRequest {
  access_token: string;
}

export interface QRResponse {
  expiry_date: string;
  content: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  language?: string;
}

export interface GymVisitResponse {
  checkin_time: string;
  checkout_time: string;
  studio_name: string;
  duration_minutes: number;
  is_averaged: boolean;
}

export interface GymVisit {
  checkin_time: Date;
  checkout_time: Date;
  studio_name: string;
  duration_minutes: number;
  is_averaged: boolean;
}

export interface RawGymVisitData {
  date: string;
  checkinTime: string;
  checkoutTime: string | null;
  studioName: string;
}

export interface GymVisitData {
  date: string;
  checkinTime: string;
  checkoutTime: string;
  studioName: string;
}

export function getErrorMessage(text: string): string | null {
  try {
    const parsed = JSON.parse(text);
    const data = Array.isArray(parsed) ? parsed[0] : parsed;
    return data?.errorMessage || null;
  } catch {
    return null;
  }
}

export function createErrorResponse(
  message: string,
  status: number = 500
): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}
