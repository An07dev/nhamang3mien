import crypto from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'nhamang3mien_default_secret_key_change_in_production';
export const ADMIN_COOKIE_NAME = 'admin_session';

export interface SessionPayload {
  username: string;
  exp: number;
}

// Tạo chữ ký HMAC-SHA256
function sign(data: string): string {
  return crypto.createHmac('sha256', ADMIN_SECRET).update(data).digest('base64url');
}

// Tạo session token an toàn
export function createSessionToken(username: string): string {
  const payload: SessionPayload = {
    username,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 ngày
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = sign(payloadB64);
  return `${payloadB64}.${signature}`;
}

// Xác thực session token
export function verifySessionToken(token?: string | null): { valid: boolean; username?: string } {
  if (!token) return { valid: false };

  try {
    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false };

    const [payloadB64, signature] = parts;
    const expectedSignature = sign(payloadB64);

    // So sánh thời gian an toàn (chống timing attack)
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return { valid: false };
    }

    const jsonStr = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload: SessionPayload = JSON.parse(jsonStr);

    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false }; // Hết hạn
    }

    return { valid: true, username: payload.username };
  } catch {
    return { valid: false };
  }
}

// Kiểm tra quyền quản trị viên từ Cookies của Server Component / Route Handler
export async function getAdminSession(): Promise<{ authenticated: boolean; username?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    const { valid, username } = verifySessionToken(token);
    return { authenticated: valid, username };
  } catch {
    return { authenticated: false };
  }
}
