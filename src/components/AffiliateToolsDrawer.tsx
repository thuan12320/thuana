import React, { useState } from 'react';
import { GenerationConfig } from '../types';
import { ShoppingBag, Copy, Check, Hash, Sparkles, Send } from 'lucide-react';

interface AffiliateToolsDrawerProps {
  config: GenerationConfig;
  onUpdateCtaText: (text: string) => void;
  onUpdatePlatform: (platform: 'tiktok' | 'shopee' | 'reels') => void;
}

export const AffiliateToolsDrawer: React.FC<AffiliateToolsDrawerProps> = ({
  config,
  onUpdateCtaText,
  onUpdatePlatform,
}) => {
  const [copiedCaption, setCopiedCaption] = useState(false);

  const CTA_SUGGESTIONS = [
    'Mua tại giỏ hàng góc dưới 👇',
    '⚡ Flash Sale 50% - Mua ngay trong giỏ hàng!',
    'Hàng chính hãng sẵn kho · Freeship hôm nay 🎁',
    'Bấm link góc trái để nhận voucher giảm 50k ✨',
  ];

  const generatedCaption = `${config.product ? `[REVIEW] ${config.product.name} đang sale cực sốc chỉ ${config.product.salePrice.toLocaleString('vi-VN')}₫!` : `[OOTD] Set đồ thời trang cao cấp cực sang chảnh phong cách Industrial Penthouse!`}\n\nChất vải siêu xịn, form dáng chuẩn từng đường kim mũi chỉ. Mọi người tranh thủ múc ngay kẻo hết size nha 👇\n\n#affiliate #thoitrang #reviewquanao #ootd #penthousefashion #tiktokshop #shopeevideo`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  return (
    <div className="bg-[#10121a]/80 rounded-2xl p-5 border border-white/[0.08] shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold tracking-wide text-white font-display uppercase">
            6. Công Cụ Affiliate & Kịch Bản Đăng Kênh
          </h2>
        </div>
        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
          Affiliate Ready
        </span>
      </div>

      {/* Platform & CTA selector */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Nền tảng đăng video Affiliate:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['tiktok', 'shopee', 'reels'] as const).map((plat) => {
              const isSelected = config.affiliateOverlay.cartPlatform === plat;
              return (
                <button
                  key={plat}
                  onClick={() => onUpdatePlatform(plat)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize border transition-all ${
                    isSelected
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                      : 'bg-black/20 text-slate-400 border-white/[0.06] hover:bg-white/[0.03]'
                  }`}
                >
                  {plat === 'tiktok' ? 'TikTok Shop' : plat === 'shopee' ? 'Shopee Video' : 'Insta Reels'}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA text customizer */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Nút CTA trong video:
          </label>
          <input
            type="text"
            value={config.affiliateOverlay.ctaText}
            onChange={(e) => onUpdateCtaText(e.target.value)}
            className="w-full bg-[#0a0c10] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400/50"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {CTA_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => onUpdateCtaText(sug)}
                className="text-[10px] px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 border border-white/[0.05] transition-all"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Auto-generated Caption Box */}
      <div className="bg-black/40 rounded-xl p-3 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-amber-400" />
            <span>Caption & Hashtags Chuẩn SEO:</span>
          </span>
          <button
            onClick={handleCopyCaption}
            className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200"
          >
            {copiedCaption ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedCaption ? 'Đã sao chép' : 'Sao chép caption'}</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-400 whitespace-pre-line font-mono line-clamp-3">
          {generatedCaption}
        </p>
      </div>
    </div>
  );
};
