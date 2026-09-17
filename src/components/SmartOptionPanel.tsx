import React, { useState, useRef } from 'react';
import { 
  AspectRatio, 
  BackgroundStyle, 
  GenerationConfig, 
  ModelActor, 
  ProductItem, 
  VideoClipItem, 
  VideoRef 
} from '../types';
import { 
  PRESET_BACKGROUNDS, 
  PRESET_MODELS, 
  PRESET_PRODUCTS, 
  PRESET_VIDEO_REFS 
} from '../data/presets';
import { 
  Clock, Smartphone, Monitor, Square, LayoutTemplate, 
  Film, User, Shirt, Home, Image as ImageIcon, ShoppingBag, 
  Upload, Check, ShieldCheck, Sparkles, Copy, ChevronRight,
  ArrowRightCircle, RefreshCw, Layers, Plus, Trash2, Pencil, X
} from 'lucide-react';
import { Tooltip } from './Tooltip';

interface SmartOptionPanelProps {
  activeClip: VideoClipItem;
  clips: VideoClipItem[];
  onSelectClip: (id: string) => void;
  onUpdateActiveConfig: (updater: (prev: GenerationConfig) => GenerationConfig) => void;
  onApplyConfigToAll: () => void;
  onGenerateCurrentClip: () => void;
  isGeneratingCurrent: boolean;
  onChainEndFrameToNext: () => void;
  onAddNewClip: () => void;
  onDeleteClip: (id: string) => void;
}

export const SmartOptionPanel: React.FC<SmartOptionPanelProps> = ({
  activeClip,
  clips,
  onSelectClip,
  onUpdateActiveConfig,
  onApplyConfigToAll,
  onGenerateCurrentClip,
  isGeneratingCurrent,
  onChainEndFrameToNext,
  onAddNewClip,
  onDeleteClip,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'motion' | 'product' | 'background' | 'startframe' | 'affiliate'>('settings');

  const customVideoInputRef = useRef<HTMLInputElement>(null);
  const customModelInputRef = useRef<HTMLInputElement>(null);
  const customProductInputRef = useRef<HTMLInputElement>(null);
  const startFrameInputRef = useRef<HTMLInputElement>(null);

  const config = activeClip.config;

  // Ratio definitions
  const RATIO_OPTIONS: { id: AspectRatio; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: '9:16', label: '9:16', icon: <Smartphone className="w-3.5 h-3.5" />, desc: 'TikTok / Reels' },
    { id: '3:4', label: '3:4', icon: <LayoutTemplate className="w-3.5 h-3.5" />, desc: 'Lookbook / Fashion' },
    { id: '16:9', label: '16:9', icon: <Monitor className="w-3.5 h-3.5" />, desc: 'YouTube' },
    { id: '1:1', label: '1:1', icon: <Square className="w-3.5 h-3.5" />, desc: 'Feed Post' },
    { id: '4:5', label: '4:5', icon: <LayoutTemplate className="w-3.5 h-3.5" />, desc: 'Facebook Ads' },
  ];

  // Product collection & naming states
  const [products, setProducts] = useState<ProductItem[]>(PRESET_PRODUCTS);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState<string>('');

  const handleSaveProductName = (productId: string) => {
    const trimmed = editingNameValue.trim();
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, name: trimmed } : p))
    );
    if (config.product?.id === productId) {
      onUpdateActiveConfig((prev) => ({
        ...prev,
        product: prev.product ? { ...prev.product, name: trimmed } : null,
      }));
    }
    setEditingProductId(null);
  };

  // Upload handlers
  const handleCustomVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newRef: VideoRef = {
        id: `custom-ref-${Date.now()}`,
        title: file.name.slice(0, 18),
        category: 'Tự Tải Lên',
        duration: 8.0,
        thumbnailUrl: config.videoRef.thumbnailUrl,
        description: `Video ref: ${file.name}`,
        motionType: 'catwalk',
        fps: 30,
      };
      onUpdateActiveConfig((prev) => ({ ...prev, videoRef: newRef }));
    }
  };

  const handleCustomModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const newActor: ModelActor = {
            id: `custom-actor-${Date.now()}`,
            name: file.name.replace(/\.[^/.]+$/, '').slice(0, 14),
            vibe: 'Khuôn mặt tải lên cá nhân',
            ethnicity: 'Custom Identity',
            height: '1m75',
            avatarUrl: ev.target.result as string,
          };
          onUpdateActiveConfig((prev) => ({ ...prev, actor: newActor }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const newProd: ProductItem = {
            id: `custom-prod-${Date.now()}`,
            name: '', // Không cần đặt tên mặc định theo yêu cầu
            category: 'Trang phục tùy chọn',
            originalPrice: 890000,
            salePrice: 450000,
            discountPercent: 49,
            affiliateCode: 'AFF-CUSTOM',
            uspTag: 'Trang phục tải lên',
            imageUrl: ev.target.result as string,
            description: 'Trang phục tải lên từ thiết bị',
          };
          setProducts((prev) => [newProd, ...prev]);
          onUpdateActiveConfig((prev) => ({ ...prev, product: newProd }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onUpdateActiveConfig((prev) => ({
            ...prev,
            enableStartFrame: true,
            startFrameImage: ev.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="w-full lg:w-[410px] xl:w-[440px] flex-shrink-0 bg-[#ffffff] border-r border-[#e7e2d9] flex flex-col h-full overflow-hidden">
      {/* 1. Top Clip Switcher Header */}
      <div className="p-3.5 border-b border-[#e7e2d9] bg-[#faf8f5]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c25e2e]" />
            <h2 className="text-xs font-semibold text-[#1c1917] tracking-luxury-tight font-display">
              Khung Điều Khiển Clip
            </h2>
          </div>
          <span className="text-[11px] font-medium text-[#78716c] bg-[#f2ede5] px-2 py-0.5 rounded-full border border-[#e5dfd5]">
            {clips.length} Video Clips
          </span>
        </div>

        {/* Clip chips horizontal selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {clips.map((clip, index) => {
            const isSelected = clip.id === activeClip.id;
            return (
              <button
                key={clip.id}
                onClick={() => onSelectClip(clip.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#1c1917] text-white shadow-xs'
                    : 'bg-[#ffffff] text-[#57534e] hover:bg-[#f5f1ea] border border-[#e5dfd5]'
                }`}
              >
                <span>Clip #{index + 1}</span>
                {clip.status === 'completed' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                {clip.status === 'generating' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
              </button>
            );
          })}
          <Tooltip content="Thêm clip mới vào Video Grid" position="bottom">
            <button
              onClick={onAddNewClip}
              className="flex items-center justify-center p-2 rounded-xl text-xs font-medium bg-[#ffffff] hover:bg-[#f5f1ea] text-[#78716c] border border-dashed border-[#d8d1c5] transition-all hover:scale-105 active:scale-95"
              aria-label="Thêm clip mới"
            >
              <Plus className="w-3.5 h-3.5 text-[#c25e2e]" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* 2. Segmented Navigation Tabs (Minimalist Icons with Hover Tooltips) */}
      <div className="flex items-center justify-between p-2 border-b border-[#e7e2d9] bg-[#f5f2eb]">
        {[
          { id: 'settings', label: 'Tỉ Lệ & Giây', desc: 'Tỉ lệ khung hình & Thời lượng (tối đa 10s)', icon: <Clock className="w-4 h-4" /> },
          { id: 'motion', label: 'Video & Model', desc: 'Video tham chiếu catwalk & Người mẫu AI', icon: <Film className="w-4 h-4" /> },
          { id: 'product', label: 'Trang Phục', desc: 'Trang phục (Giữ đồ gốc / Affiliate)', icon: <Shirt className="w-4 h-4" /> },
          { id: 'background', label: 'Bối Cảnh', desc: 'Bối cảnh thời trang (Industrial Penthouse...)', icon: <Home className="w-4 h-4" /> },
          { id: 'startframe', label: 'Start Frame', desc: 'Start Frame & Nối chuỗi khung hình', icon: <ImageIcon className="w-4 h-4" /> },
          { id: 'affiliate', label: 'Affiliate CTA', desc: 'Affiliate CTA, Giỏ hàng & Nút mua', icon: <ShoppingBag className="w-4 h-4" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Tooltip key={tab.id} content={tab.desc} position="bottom">
              <button
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 p-2 sm:px-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#ffffff] text-[#1c1917] shadow-xs border border-[#ded8cf]'
                    : 'text-[#6b645c] hover:text-[#1c1917] hover:bg-[#eae5dc]'
                }`}
                aria-label={tab.label}
              >
                <span className={isActive ? 'text-[#c25e2e]' : 'text-[#8c827a]'}>{tab.icon}</span>
                {isActive && <span className="hidden sm:inline font-semibold animate-in fade-in duration-150">{tab.label}</span>}
              </button>
            </Tooltip>
          );
        })}
      </div>

      {/* 3. Tab Content Area (Scrollable within single frame) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {/* TAB 1: SETTINGS (Duration & Ratio) */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Duration Slider - STRICTLY MAX 10s */}
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e1d7]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[#292524] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#c25e2e]" />
                  Độ dài video (Tối đa 10s)
                </span>
                <span className="text-xs font-semibold text-[#c25e2e] bg-[#f9ebe4] px-2.5 py-0.5 rounded-lg border border-[#f3d3c4]">
                  {config.duration.toFixed(1)}s
                </span>
              </div>

              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.5"
                value={config.duration}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateActiveConfig((prev) => ({ ...prev, duration: Math.min(10.0, Math.max(1.0, val)) }));
                }}
                className="w-full h-1.5 bg-[#e4ddd2] rounded-lg cursor-pointer accent-[#c25e2e]"
              />

              {/* Quick duration presets */}
              <div className="grid grid-cols-4 gap-2 mt-3.5">
                {[
                  { sec: 3.0, label: '3s', sub: 'Hook nhanh' },
                  { sec: 5.0, label: '5s', sub: 'Story ngắn' },
                  { sec: 8.0, label: '8s', sub: 'Affiliate đẹp' },
                  { sec: 10.0, label: '10s', sub: 'Tối đa 10s' },
                ].map((item) => (
                  <button
                    key={item.sec}
                    onClick={() => onUpdateActiveConfig((prev) => ({ ...prev, duration: item.sec }))}
                    className={`py-2 px-1 rounded-xl text-center border transition-all ${
                      config.duration === item.sec
                        ? 'bg-[#1c1917] text-white border-[#1c1917] shadow-xs'
                        : 'bg-[#ffffff] text-[#57534e] border-[#e7e1d7] hover:bg-[#f5ede3]'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-[#8c827a] leading-normal">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e1d7]">
              <label className="text-xs font-medium text-[#292524] block mb-3">
                Tỉ lệ khung hình (Aspect Ratio)
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {RATIO_OPTIONS.map((opt) => {
                  const isSelected = config.ratio === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onUpdateActiveConfig((prev) => ({ ...prev, ratio: opt.id }))}
                      className={`p-3 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-[#ffffff] border-[#c25e2e] text-[#1c1917] ring-1 ring-[#c25e2e]'
                          : 'bg-[#ffffff] border-[#e7e1d7] text-[#57534e] hover:bg-[#f7f4ee]'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#faf0eb] text-[#c25e2e]' : 'bg-[#f4efe8] text-[#78716c]'}`}>
                        {opt.icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#1c1917]">{opt.label}</div>
                        <div className="text-[11px] text-[#78716c] leading-relaxed mt-0.5">{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MOTION & MODEL */}
        {activeTab === 'motion' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Video Ref section */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-medium text-[#292524] flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-[#78716c]" />
                  Video mẫu tham chiếu (DensePose Clone)
                </span>
                <input
                  type="file"
                  ref={customVideoInputRef}
                  onChange={handleCustomVideoUpload}
                  accept="video/*"
                  className="hidden"
                />
                <button
                  onClick={() => customVideoInputRef.current?.click()}
                  className="text-xs font-medium text-[#c25e2e] hover:text-[#a94f24] bg-[#fbf5ee] px-2.5 py-1 rounded-lg border border-[#eddccc] flex items-center gap-1 transition-colors"
                >
                  <Upload className="w-3 h-3" /> Tải Video
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_VIDEO_REFS.map((ref) => {
                  const isSelected = config.videoRef.id === ref.id;
                  return (
                    <button
                      key={ref.id}
                      onClick={() => onUpdateActiveConfig((prev) => ({ ...prev, videoRef: ref }))}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#ffffff] border-[#c25e2e] ring-1 ring-[#c25e2e] shadow-xs'
                          : 'bg-[#ffffff] border-[#e7e1d7] text-[#57534e] hover:bg-[#faf7f2]'
                      }`}
                    >
                      <img
                        src={ref.thumbnailUrl}
                        alt={ref.title}
                        className="w-full h-18 object-cover rounded-lg mb-2 border border-[#eae4da]"
                      />
                      <div className="text-xs font-semibold text-[#1c1917] truncate">{ref.title}</div>
                      <div className="text-[11px] text-[#78716c] leading-normal">{ref.category}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model Actor section */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-medium text-[#292524] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#78716c]" />
                  Gương mặt & nhân vật (Actor)
                </span>
                <input
                  type="file"
                  ref={customModelInputRef}
                  onChange={handleCustomModelUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => customModelInputRef.current?.click()}
                  className="text-xs font-medium text-[#c25e2e] hover:text-[#a94f24] bg-[#fbf5ee] px-2.5 py-1 rounded-lg border border-[#eddccc] flex items-center gap-1 transition-colors"
                >
                  <Upload className="w-3 h-3" /> Tải Ảnh Mặt
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {PRESET_MODELS.map((model) => {
                  const isSelected = config.actor.id === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => onUpdateActiveConfig((prev) => ({ ...prev, actor: model }))}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-[#ffffff] border-[#c25e2e] ring-1 ring-[#c25e2e] shadow-xs'
                          : 'bg-[#ffffff] border-[#e7e1d7] text-[#57534e] hover:bg-[#faf7f2]'
                      }`}
                    >
                      <img
                        src={model.avatarUrl}
                        alt={model.name}
                        className="w-12 h-12 rounded-full mx-auto object-cover border border-[#e5ded4] mb-1.5"
                      />
                      <div className="text-xs font-semibold text-[#1c1917] truncate">{model.name}</div>
                      <div className="text-[11px] text-[#78716c] leading-tight">{model.height}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCT & PRESERVE ORIGINAL GARMENT */}
        {activeTab === 'product' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* CRITICAL USER REQUIREMENT:
                "nếu ko có input ref sản phẩm thì mặc định giữ nguyên sản phẩm quần áo của video ref" */}
            <div className="p-4 rounded-2xl bg-[#f5f9f5] border border-[#d6e7d6]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#2e7d32] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-[#1b5e20]">
                      Giữ nguyên trang phục video ref
                    </div>
                    <p className="text-xs text-[#386b3b] leading-relaxed mt-0.5">
                      {config.product === null 
                        ? 'Đang bật: Không thay đổi trang phục của video ref gốc.'
                        : 'Đang tắt: Đang phủ sản phẩm thời trang được chọn bên dưới.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onUpdateActiveConfig((prev) => ({ ...prev, product: null }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex-shrink-0 ${
                    config.product === null
                      ? 'bg-[#2e7d32] text-white shadow-xs'
                      : 'bg-[#ffffff] text-[#2e7d32] border border-[#b2d8b2] hover:bg-[#eaf4ea]'
                  }`}
                >
                  {config.product === null ? '✓ Đang Giữ Gốc' : 'Chọn Giữ Gốc'}
                </button>
              </div>
            </div>

            {/* Custom product upload */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-semibold text-[#292524]">
                  Ảnh trang phục phủ (AI Draping):
                </span>
                <p className="text-[11px] text-[#78716c] mt-0.5">
                  Không cần đặt tên. Di chuột để thấy icon đặt tên nếu cần.
                </p>
              </div>
              <input
                type="file"
                ref={customProductInputRef}
                onChange={handleCustomProductUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => customProductInputRef.current?.click()}
                className="text-xs font-medium text-[#c25e2e] hover:text-[#a94f24] bg-[#fbf5ee] px-2.5 py-1.5 rounded-xl border border-[#eddccc] flex items-center gap-1.5 transition-colors flex-shrink-0"
              >
                <Upload className="w-3.5 h-3.5" /> Tải Ảnh Đồ
              </button>
            </div>

            {/* Product image gallery grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {products.map((prod) => {
                const isSelected = config.product?.id === prod.id;
                const isEditingThis = editingProductId === prod.id;

                return (
                  <div
                    key={prod.id}
                    onClick={() => {
                      if (!isEditingThis) {
                        onUpdateActiveConfig((prev) => ({ ...prev, product: prod }));
                      }
                    }}
                    className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#c25e2e] ring-2 ring-[#c25e2e]/30 shadow-sm bg-[#ffffff]'
                        : 'border-[#e7e1d7] hover:border-[#c25e2e]/40 hover:shadow-xs bg-[#faf8f5]'
                    }`}
                  >
                    <img
                      src={prod.imageUrl}
                      alt={prod.name || 'Ảnh sản phẩm'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#c25e2e] text-white flex items-center justify-center shadow-xs z-10">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                    )}

                    {/* ICON ĐẶT TÊN NẾU CẦN - BÌNH THƯỜNG THÌ ẨN */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isEditingThis) {
                            handleSaveProductName(prod.id);
                          } else {
                            setEditingProductId(prod.id);
                            setEditingNameValue(prod.name || '');
                          }
                        }}
                        title={prod.name ? `Đổi tên (Hiện tại: ${prod.name})` : "Đặt tên cho ảnh nếu cần"}
                        className={`p-1.5 rounded-lg bg-black/65 hover:bg-black/85 text-white backdrop-blur-xs transition-all ${
                          isEditingThis
                            ? 'opacity-100 ring-1 ring-white/50'
                            : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Popover / Overlay to name if needed */}
                    {isEditingThis ? (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-x-2 bottom-2 p-2 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-[#eddccc] z-30 animate-in fade-in zoom-in-95 duration-150"
                      >
                        <div className="text-[10px] font-semibold text-[#78716c] mb-1">
                          Đặt tên (không bắt buộc):
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            autoFocus
                            value={editingNameValue}
                            onChange={(e) => setEditingNameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveProductName(prod.id);
                              } else if (e.key === 'Escape') {
                                setEditingProductId(null);
                              }
                            }}
                            placeholder="Nhập tên..."
                            className="flex-1 min-w-0 px-2 py-1 text-xs rounded-lg border border-[#e7e1d7] bg-white text-[#1c1917] focus:outline-none focus:border-[#c25e2e]"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveProductName(prod.id)}
                            className="p-1 rounded-lg bg-[#c25e2e] text-white hover:bg-[#a94f24] transition-colors"
                            title="Lưu tên"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingProductId(null)}
                            className="p-1 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                            title="Đóng"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* TÊN SẢN PHẨM: BÌNH THƯỜNG THÌ ẨN (Chỉ hiện khi hover nếu đã có tên) */
                      prod.name ? (
                        <div className="absolute inset-x-2 bottom-2 py-1 px-2 rounded-lg bg-black/75 backdrop-blur-xs text-[11px] text-white text-center font-medium truncate opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {prod.name}
                        </div>
                      ) : null
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: BACKGROUND STYLE (DEFAULT INDUSTRIAL PENTHOUSE) */}
        {activeTab === 'background' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <p className="text-xs text-[#78716c] leading-relaxed">
              Chọn phong cách không gian ánh sáng. Mặc định là <strong>Industrial Penthouse có kệ quần áo</strong>.
            </p>

            {PRESET_BACKGROUNDS.map((bg) => {
              const isSelected = config.backgroundStyle.id === bg.id;
              return (
                <button
                  key={bg.id}
                  onClick={() => onUpdateActiveConfig((prev) => ({ ...prev, backgroundStyle: bg }))}
                  className={`w-full p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#ffffff] border-[#c25e2e] ring-1 ring-[#c25e2e] shadow-xs'
                      : 'bg-[#ffffff] border-[#e7e1d7] hover:bg-[#faf7f2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={bg.thumbnailUrl}
                      alt={bg.name}
                      className="w-16 h-16 object-cover rounded-xl border border-[#eae3d9] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-semibold text-[#1c1917] truncate">{bg.name}</h4>
                        {bg.isDefault && (
                          <span className="text-[10px] font-medium bg-[#f5ede3] text-[#7c4d28] border border-[#e6d8c7] px-2 py-0.5 rounded-full">
                            Mặc Định
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#78716c] leading-relaxed mt-1 line-clamp-2">
                        {bg.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* TAB 5: START FRAME OPTIONAL */}
        {activeTab === 'startframe' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* CRITICAL REQUIREMENT: "có thêm nút start frame optional" */}
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e1d7]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#78716c]" />
                  <div>
                    <div className="text-xs font-semibold text-[#1c1917]">
                      Khung hình mở đầu (Start Frame Optional)
                    </div>
                    <div className="text-xs text-[#78716c] leading-relaxed">
                      Khởi tạo chuyển động video từ 1 khung hình có sẵn
                    </div>
                  </div>
                </div>

                {/* Toggle on/off */}
                <button
                  onClick={() => onUpdateActiveConfig((prev) => ({
                    ...prev,
                    enableStartFrame: !prev.enableStartFrame,
                  }))}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    config.enableStartFrame ? 'bg-[#c25e2e]' : 'bg-[#d6cfc4]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      config.enableStartFrame ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {config.enableStartFrame && (
                <div className="mt-3.5 pt-3.5 border-t border-[#e7e1d7] space-y-3">
                  <input
                    type="file"
                    ref={startFrameInputRef}
                    onChange={handleStartFrameUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {config.startFrameImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-[#e7e1d7]">
                      <img
                        src={config.startFrameImage}
                        alt="Start Frame"
                        className="w-full h-36 object-contain bg-white"
                      />
                      <button
                        onClick={() => onUpdateActiveConfig((prev) => ({ ...prev, startFrameImage: null }))}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white text-[11px] font-medium px-2 py-1 rounded-lg"
                      >
                        Gỡ ảnh
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => startFrameInputRef.current?.click()}
                        className="w-full py-2.5 rounded-xl border border-dashed border-[#c25e2e] bg-white text-xs font-medium text-[#c25e2e] flex items-center justify-center gap-1.5 hover:bg-[#faf5ee] transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" /> Tải ảnh Start Frame từ thiết bị
                      </button>

                      <button
                        onClick={onChainEndFrameToNext}
                        className="w-full py-2 rounded-xl bg-[#faf8f5] hover:bg-[#f2ede4] text-xs font-medium text-[#57534e] flex items-center justify-center gap-1.5 border border-[#e5ded3] transition-colors"
                      >
                        <ArrowRightCircle className="w-3.5 h-3.5 text-[#c25e2e]" />
                        Lấy End Frame từ Clip trước đó
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: AFFILIATE CTA & OVERLAYS */}
        {activeTab === 'affiliate' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e1d7] space-y-3">
              <div>
                <label className="text-xs font-medium text-[#292524] block mb-1.5">
                  Nội dung CTA Banner kích thích mua sắm
                </label>
                <input
                  type="text"
                  value={config.affiliateOverlay.ctaText}
                  onChange={(e) => {
                    const text = e.target.value;
                    onUpdateActiveConfig((prev) => ({
                      ...prev,
                      affiliateOverlay: { ...prev.affiliateOverlay, ctaText: text },
                    }));
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#ded8cf] text-[#1c1917] focus:outline-none focus:border-[#c25e2e]"
                />
              </div>

              {/* Platform selector */}
              <div>
                <label className="text-xs font-medium text-[#292524] block mb-1.5">
                  Nền tảng gắn giỏ hàng
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['tiktok', 'shopee', 'reels'] as const).map((plat) => (
                    <button
                      key={plat}
                      onClick={() => onUpdateActiveConfig((prev) => ({
                        ...prev,
                        affiliateOverlay: { ...prev.affiliateOverlay, cartPlatform: plat },
                      }))}
                      className={`py-2 rounded-xl text-xs font-medium uppercase border transition-all ${
                        config.affiliateOverlay.cartPlatform === plat
                          ? 'bg-[#1c1917] text-white border-[#1c1917]'
                          : 'bg-white text-[#57534e] border-[#ded8cf] hover:bg-[#faf7f2]'
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Actions Panel */}
      <div className="p-3.5 border-t border-[#e7e2d9] bg-[#faf8f5] space-y-2">
        <button
          onClick={onGenerateCurrentClip}
          disabled={isGeneratingCurrent}
          className="w-full py-2.5 rounded-xl bg-[#c25e2e] hover:bg-[#a94f24] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 active:scale-[0.99]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isGeneratingCurrent ? 'Omni Đang Render Clip...' : `Render Clip #${clips.findIndex(c => c.id === activeClip.id) + 1} (Omni 1.1 Flash)`}</span>
        </button>

        <div className="flex items-center gap-2">
          <Tooltip content="Áp dụng thời lượng, tỉ lệ, bối cảnh cho tất cả clip trong grid" position="top" className="flex-1">
            <button
              onClick={onApplyConfigToAll}
              className="w-full py-2 px-2.5 rounded-xl bg-[#ffffff] hover:bg-[#f5ede3] text-[#57534e] text-xs font-medium border border-[#e5ded3] flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#78716c]" />
              <span>Áp dụng tất cả</span>
            </button>
          </Tooltip>

          {clips.length > 1 && (
            <Tooltip content="Xóa clip này khỏi grid" position="top">
              <button
                onClick={() => onDeleteClip(activeClip.id)}
                className="p-2 rounded-xl bg-[#ffffff] hover:bg-[#fee2e2] text-[#b91c1c] border border-[#e5ded3] hover:border-[#fecaca] transition-all hover:scale-105 active:scale-95"
                aria-label="Xóa clip"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </aside>
  );
};
