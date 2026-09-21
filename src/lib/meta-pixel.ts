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

// 5. Bắn sự kiện Meta Pixel an toàn
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
