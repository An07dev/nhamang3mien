'use client';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

// 1. Lấy giá trị cookie theo tên
export function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : '';
}

// 2. Lấy cookie _fbp (Facebook Browser ID)
export function getFbp(): string {
  return getCookie('_fbp');
}

// 3. Lấy hoặc trích xuất cookie _fbc (Facebook Click ID)
export function getFbc(): string {
  const cookieFbc = getCookie('_fbc');
  if (cookieFbc) return cookieFbc;

  // Nếu cookie chưa được set nhưng trên URL có ?fbclid=...
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    if (fbclid) {
      return `fb.1.${Date.now()}.${fbclid}`;
    }
  }
  return '';
}

// 4. Sinh Event ID duy nhất dùng cho Deduplication giữa Pixel & CAPI
export function generateEventId(prefix: string = 'evt'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

// 5. Bắn sự kiện Meta Pixel an toàn (Client-side)
export function trackPixel(
  eventName: string,
  params: Record<string, any> = {},
  options?: { eventID?: string }
): void {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      if (options && options.eventID) {
        window.fbq('track', eventName, params, { eventID: options.eventID });
      } else {
        window.fbq('track', eventName, params);
      }
    } catch (err) {
      console.warn('[Meta Pixel] Lỗi khi bắn sự kiện:', err);
    }
  }
}

// 6. Bắn sự kiện tùy biến (Custom Event)
export function trackCustomPixel(
  customEventName: string,
  params: Record<string, any> = {},
  options?: { eventID?: string }
): void {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      if (options && options.eventID) {
        window.fbq('trackCustom', customEventName, params, { eventID: options.eventID });
      } else {
        window.fbq('trackCustom', customEventName, params);
      }
    } catch (err) {
      console.warn('[Meta Pixel] Lỗi khi bắn sự kiện custom:', err);
    }
  }
}

// 7. Gửi sự kiện CAPI ngầm (Server-side) từ Client
export async function sendCapiBackground(
  eventName: string,
  eventId: string,
  customData: Record<string, any> = {},
  userData: { phone?: string; name?: string; email?: string } = {}
): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const fbp = getFbp();
    const fbc = getFbc();

    fetch('/api/tracking/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        eventId,
        customData,
        userData,
        fbp,
        fbc,
        eventSourceUrl: window.location.href,
      }),
    }).catch(() => {});
  } catch (err) {
    // Không chặn luồng giao diện người dùng
  }
}

export interface TrackMetaOptions {
  eventID?: string;
  sendCapi?: boolean;
  userData?: {
    phone?: string;
    name?: string;
    email?: string;
  };
}

// 8. Bắn sự kiện đồng thời lên CẢ Pixel & CAPI (khử trùng lặp 100% bằng chung eventID)
export function trackMetaEvent(
  eventName: string,
  params: Record<string, any> = {},
  options?: TrackMetaOptions
): string {
  const eventId = options?.eventID || generateEventId(eventName.toLowerCase());

  // 1. Kích hoạt Pixel trên Trình duyệt
  trackPixel(eventName, params, { eventID: eventId });

  // 2. Kích hoạt Server CAPI nếu được bật (mặc định bật cho các sự kiện quan trọng)
  if (options?.sendCapi !== false) {
    sendCapiBackground(eventName, eventId, params, options?.userData);
  }

  return eventId;
}

// ==================== CÁC HÀM TIỆN ÍCH CHO TỪNG SỰ KIỆN CHUẨN META ====================

// A. Xem nội dung / chi tiết gói cước (ViewContent)
export function trackViewContent(
  pkg: {
    id?: string;
    name: string;
    category?: string;
    price?: number | string;
    speed?: string;
  },
  options?: TrackMetaOptions
): string {
  const numericPrice =
    typeof pkg.price === 'number'
      ? pkg.price
      : parseInt((pkg.price || '0').toString().replace(/\D/g, ''), 10) || 0;

  return trackMetaEvent(
    'ViewContent',
    {
      content_name: pkg.name,
      content_category: pkg.category || 'Gói Cước FPT',
      content_ids: [pkg.id || pkg.name],
      content_type: 'product',
      value: numericPrice,
      currency: 'VND',
      speed: pkg.speed,
    },
    { sendCapi: true, ...options }
  );
}

// B. Bắt đầu đăng ký / Click nút tư vấn hoặc mở form (InitiateCheckout)
export function trackInitiateCheckout(
  data: {
    packageName?: string;
    category?: string;
    price?: number | string;
    source?: string;
  },
  options?: TrackMetaOptions
): string {
  const numericPrice =
    typeof data.price === 'number'
      ? data.price
      : parseInt((data.price || '0').toString().replace(/\D/g, ''), 10) || 0;

  return trackMetaEvent(
    'InitiateCheckout',
    {
      content_name: data.packageName || 'Đăng Ký Tư Vấn FPT',
      content_category: data.category || 'Lắp Mạng FPT',
      value: numericPrice,
      currency: 'VND',
      source: data.source || 'Website CTA',
    },
    { sendCapi: true, ...options }
  );
}

// C. Khách hàng bấm gọi điện hoặc Zalo (Contact)
export function trackContact(
  data: {
    method: 'phone_call' | 'zalo_chat' | 'hotline_floating' | 'zalo_floating' | string;
    href?: string;
    phone?: string;
    url?: string;
  },
  options?: TrackMetaOptions
): string {
  return trackMetaEvent(
    'Contact',
    {
      method: data.method,
      href: data.href || data.phone || data.url || '',
    },
    { sendCapi: true, ...options }
  );
}

// D. Khách chọn khu vực / Tỉnh thành (FindLocation)
export function trackFindLocation(provinceName: string, options?: TrackMetaOptions): string {
  return trackMetaEvent(
    'FindLocation',
    {
      content_name: provinceName,
    },
    { sendCapi: true, ...options }
  );
}

// E. Khách chuyển tab danh mục / Lọc gói cước (Search)
export function trackSearchCategory(
  categoryName: string,
  categoryKey?: string,
  options?: TrackMetaOptions
): string {
  return trackMetaEvent(
    'Search',
    {
      search_string: categoryName,
      content_category: categoryKey || categoryName,
    },
    { sendCapi: true, ...options }
  );
}

// F. Khách thay đổi tùy chọn / kỳ thanh toán (CustomizeProduct)
export function trackCustomizeProduct(
  packageName: string,
  option: { name: string; value: string },
  options?: TrackMetaOptions
): string {
  return trackMetaEvent(
    'CustomizeProduct',
    {
      content_name: packageName,
      custom_name: option.name,
      custom_value: option.value,
    },
    { sendCapi: true, ...options }
  );
}

// G. Khách xem câu hỏi thường gặp FAQ (ViewFAQ)
export function trackViewFAQ(question: string, options?: TrackMetaOptions): string {
  return trackMetaEvent(
    'ViewFAQ',
    {
      content_name: question,
      question,
    },
    { sendCapi: true, ...options }
  );
}

// H. Khách xem trang (PageView)
export function trackPageView(
  pageTitle?: string,
  options?: TrackMetaOptions
): string {
  return trackMetaEvent(
    'PageView',
    {
      page_title: pageTitle || (typeof document !== 'undefined' ? document.title : ''),
    },
    { sendCapi: true, ...options }
  );
}
