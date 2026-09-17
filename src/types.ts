export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5' | '3:4';

export interface VideoRef {
  id: string;
  title: string;
  category: string;
  duration: number; // in seconds
  thumbnailUrl: string;
  description: string;
  motionType: 'catwalk' | 'mirror_ootd' | 'studio_spin' | 'street_walk';
  fps: number;
}

export interface ModelActor {
  id: string;
  name: string;
  avatarUrl: string;
  vibe: string;
  ethnicity: string;
  height: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  affiliateCode: string;
  uspTag: string;
  imageUrl: string;
  description: string;
}

export interface BackgroundStyle {
  id: string;
  name: string;
  description: string;
  isDefault?: boolean;
  thumbnailUrl: string;
  tags: string[];
}

export interface GenerationConfig {
  duration: number; // 1.0 to 10.0 seconds
  ratio: AspectRatio;
  videoRef: VideoRef;
  actor: ModelActor;
  product: ProductItem | null; // null means keep reference video garment!
  backgroundStyle: BackgroundStyle;
  enableStartFrame: boolean;
  startFrameImage: string | null;
  affiliateOverlay: {
    showCtaBanner: boolean;
    ctaText: string;
    showPriceTag: boolean;
    showDiscountBadge: boolean;
    cartPlatform: 'tiktok' | 'shopee' | 'reels';
  };
}

export interface GenerationProgress {
  stepIndex: number;
  stepName: string;
  progress: number;
  subtext: string;
}

export interface VideoClipItem {
  id: string;
  title: string;
  config: GenerationConfig;
  status: 'idle' | 'generating' | 'completed' | 'error';
  progress: number;
  generationStep: string;
  videoDataUrl?: string;
  endFrameUrl?: string;
  createdAt: number;
}

export interface GeneratedVideoResult {
  id: string;
  videoUrl: string;
  endFrameUrl: string;
  duration: number;
  ratio: AspectRatio;
  config: GenerationConfig;
  createdAt: string;
}

export type NanoBananaResolution = '1K' | '2K' | '4K';

export interface NanoBananaImageItem {
  id: string;
  title: string;
  prompt: string;
  negativePrompt?: string;
  ratio: AspectRatio;
  resolution: NanoBananaResolution;
  stylePreset: string;
  imageUrl: string;
  createdAt: number;
  model: 'gemini-3-pro-image';
}

export type ActiveStudioSection = 'video-grid' | 'nanobanana-image';
