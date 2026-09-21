import crypto from 'crypto';
import { connectDB } from './mongodb';
import Setting from '@/models/Setting';
import { DEFAULT_TRACKING_CONFIG, TrackingConfig } from './tracking-config';

// 1. Hàm băm SHA-256 chuẩn Meta
export function hashSha256(value: string): string {
  if (!value) return '';
  return crypto
    .createHash('sha256')
    .update(value.trim().toLowerCase())
    .digest('hex');
}

// 2. Chuẩn hóa số điện thoại theo chuẩn quốc tế E.164 (Việt Nam: 84...) và băm SHA-256
export function normalizeAndHashPhone(phone: string): string {
  if (!phone) return '';
  // Bỏ toàn bộ ký tự không phải số
  let clean = phone.replace(/[^\d]/g, '');

  // Nếu bắt đầu bằng 0, thay thế bằng mã quốc gia 84
  if (clean.startsWith('0')) {
    clean = '84' + clean.slice(1);
  } else if (!clean.startsWith('84') && clean.length >= 9) {
    clean = '84' + clean;
  }

  return hashSha256(clean);
}

// 3. Chuẩn hóa họ tên và băm SHA-256
export function normalizeAndHashName(name: string): string {
  if (!name) return '';
  // Xóa khoảng trắng thừa và băm chữ thường
  const clean = name.trim().toLowerCase();
  return hashSha256(clean);
}

// 4. Lấy cấu hình Tracking từ MongoDB
export async function getTrackingConfig(): Promise<TrackingConfig> {
  try {
    await connectDB();
    const doc = await Setting.findOne({ key: 'tracking_config' }).lean();
    if (doc && doc.value) {
      return {
        ...DEFAULT_TRACKING_CONFIG,
        ...(doc.value as Partial<TrackingConfig>),
      };
    }
  } catch (error) {
    console.error('Lỗi khi tải cấu hình tracking:', error);
  }
  return DEFAULT_TRACKING_CONFIG;
}

// 5. Interface sự kiện CAPI
export interface CapiEventParams {
  eventName: 'Lead' | 'Contact' | 'CompleteRegistration' | 'Purchase' | 'ViewContent' | string;
  eventId?: string;
  eventTime?: number;
  eventSourceUrl?: string;
  userData: {
    phone?: string;
    name?: string;
    email?: string;
    clientIp?: string;
    userAgent?: string;
    fbp?: string;
    fbc?: string;
  };
  customData?: Record<string, unknown>;
  overrideTestCode?: string;
}

export interface CapiResponse {
  success: boolean;
  eventsReceived?: number;
  fbtraceId?: string;
  error?: string;
  skipped?: boolean;
}

// 6. Hàm bắn sự kiện lên Meta Conversions API
export async function sendMetaCapiEvent(params: CapiEventParams): Promise<CapiResponse> {
  try {
    const config = await getTrackingConfig();

    // Nếu tracking chưa được kích hoạt hoặc thiếu thông tin cần thiết
    if (!config.isEnabled) {
      return { success: false, skipped: true, error: 'Tracking CAPI đang tắt trong cấu hình' };
    }

    if (!config.pixelId || !config.capiToken) {
      return { success: false, skipped: true, error: 'Chưa cấu hình Pixel ID hoặc CAPI Access Token' };
    }

    const {
      eventName,
      eventId,
      eventTime = Math.floor(Date.now() / 1000),
      eventSourceUrl = 'https://fpt3mien.com/',
      userData,
      customData = {},
      overrideTestCode,
    } = params;

    // Chuẩn bị thông tin user data theo định dạng Meta
    const metaUserData: Record<string, unknown> = {};

    if (userData.phone) {
      const hashedPhone = normalizeAndHashPhone(userData.phone);
      if (hashedPhone) metaUserData.ph = [hashedPhone];
    }

    if (userData.name) {
      const hashedName = normalizeAndHashName(userData.name);
      if (hashedName) metaUserData.fn = [hashedName];
    }

    if (userData.email) {
      const hashedEmail = hashSha256(userData.email);
      if (hashedEmail) metaUserData.em = [hashedEmail];
    }

    if (userData.clientIp) {
      metaUserData.client_ip_address = userData.clientIp;
    }

    if (userData.userAgent) {
      metaUserData.client_user_agent = userData.userAgent;
    }

    if (userData.fbp) {
      metaUserData.fbp = userData.fbp;
    }

    if (userData.fbc) {
      metaUserData.fbc = userData.fbc;
    }

    const eventPayload: Record<string, unknown> = {
      event_name: eventName,
      event_time: eventTime,
      action_source: 'website',
      event_source_url: eventSourceUrl,
      user_data: metaUserData,
      custom_data: customData,
    };

    if (eventId) {
      eventPayload.event_id = eventId;
    }

    const requestBody: Record<string, unknown> = {
      data: [eventPayload],
    };

    // Thêm test_event_code nếu có (từ tham số trực tiếp hoặc từ cấu hình trong Admin)
    const activeTestCode = (overrideTestCode || config.testEventCode || '').trim();
    if (activeTestCode) {
      requestBody.test_event_code = activeTestCode;
    }

    const metaUrl = `https://graph.facebook.com/v19.0/${config.pixelId}/events?access_token=${encodeURIComponent(
      config.capiToken
    )}`;

    const response = await fetch(metaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        result?.error?.message ||
        `Lỗi Meta CAPI HTTP ${response.status}: ${response.statusText}`;
      console.error('[Meta CAPI Error]:', result);
      return {
        success: false,
        error: errorMessage,
        fbtraceId: result?.error?.fbtrace_id,
      };
    }

    return {
      success: true,
      eventsReceived: result.events_received ?? 1,
      fbtraceId: result.fbtrace_id,
    };
  } catch (error: any) {
    console.error('[Meta CAPI System Exception]:', error);
    return {
      success: false,
      error: error.message || 'Lỗi không xác định khi gọi Meta CAPI',
    };
  }
}
