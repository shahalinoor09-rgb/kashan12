
export type AdPlatform = 'Google Ads' | 'Facebook' | 'Instagram' | 'LinkedIn' | 'TikTok' | 'Email';
export type AdTone = 'Professional' | 'Friendly' | 'Bold' | 'Playful' | 'Luxury' | 'Persuasive';
export type CTAStyle = 'Soft' | 'Direct' | 'Urgent';

export interface AdParams {
  productName: string;
  description: string;
  targetAudience: string;
  platform: AdPlatform;
  tone: AdTone;
  ctaStyle: CTAStyle;
  creativity: number; // 0 to 1
}

export interface AdResult {
  id: string;
  timestamp: number;
  params: AdParams;
  copy: {
    headlines: string[];
    descriptions: string[];
    ctas: string[];
  };
}
