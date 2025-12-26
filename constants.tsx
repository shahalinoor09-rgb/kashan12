
import React from 'react';
import { 
  Chrome, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Music2, 
  Mail,
  Briefcase,
  Smile,
  Zap,
  Gamepad2,
  Crown,
  Target
} from 'lucide-react';
import { AdPlatform, AdTone, CTAStyle } from './types';

export const PLATFORMS: { value: AdPlatform; icon: React.ReactNode }[] = [
  { value: 'Google Ads', icon: <Chrome className="w-4 h-4" /> },
  { value: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
  { value: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
  { value: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
  { value: 'TikTok', icon: <Music2 className="w-4 h-4" /> },
  { value: 'Email', icon: <Mail className="w-4 h-4" /> },
];

export const TONES: { value: AdTone; icon: React.ReactNode }[] = [
  { value: 'Professional', icon: <Briefcase className="w-4 h-4" /> },
  { value: 'Friendly', icon: <Smile className="w-4 h-4" /> },
  { value: 'Bold', icon: <Zap className="w-4 h-4" /> },
  { value: 'Playful', icon: <Gamepad2 className="w-4 h-4" /> },
  { value: 'Luxury', icon: <Crown className="w-4 h-4" /> },
  { value: 'Persuasive', icon: <Target className="w-4 h-4" /> },
];

export const CTA_STYLES: CTAStyle[] = ['Soft', 'Direct', 'Urgent'];
