export interface PixelPreset {
  id: string;
  name: string;
  pixelId: string;
  capiToken: string;
  testEventCode?: string;
  createdAt: string;
}

export interface TrackingConfig {
  pixelId: string;
  capiToken: string;
  testEventCode: string;
  isEnabled: boolean;
  presets?: PixelPreset[];
}

export const DEFAULT_TRACKING_CONFIG: TrackingConfig = {
  pixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || '',
  capiToken: process.env.FB_CAPI_ACCESS_TOKEN || '',
  testEventCode: process.env.FB_TEST_EVENT_CODE || '',
  isEnabled: process.env.NEXT_PUBLIC_FB_TRACKING_ENABLED === 'true' || false,
  presets: [],
};

export interface PublicTrackingConfig {
  pixelId: string;
  isEnabled: boolean;
}
