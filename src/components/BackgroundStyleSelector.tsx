import React from 'react';
import { BackgroundStyle } from '../types';
import { PRESET_BACKGROUNDS } from '../data/presets';
import { Building2, Check, Sparkles } from 'lucide-react';

interface BackgroundStyleSelectorProps {
  selectedBg: BackgroundStyle;
  onSelectBg: (bg: BackgroundStyle) => void;
  customPromptText: string;
  onChangeCustomPrompt: (text: string) => void;
}

export const BackgroundStyleSelector: React.FC<BackgroundStyleSelectorProps> = ({
  selectedBg,
  onSelectBg,
  customPromptText,
  onChangeCustomPrompt,
}) => {
  return (
    <div className="bg-[#10121a]/80 rounded-2xl p-5 border border-white/[0.08] shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold tracking-luxury text-white font-display uppercase">
            4. Bối Cảnh Studio (Background Style)
          </h2>
        </div>
        <span className="text-[11px] font-medium font-label text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
          Mặc định: Industrial Penthouse
        </span>
      </div>

      <p className="text-xs text-slate-400 font-content leading-relaxed mb-4">
        Không gian chụp ảnh và quay phim thời trang cao cấp để tôn lên sự sang trọng của video Affiliate.
      </p>

      {/* Selected Background Highlight Badge */}
      <div className="mb-4 p-3 rounded-xl bg-black/30 border border-white/[0.06] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">{selectedBg.name}</span>
            {selectedBg.isDefault && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-400 text-black">
                MẶC ĐỊNH
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{selectedBg.description}</p>
        </div>
      </div>

      {/* Background Presets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        {PRESET_BACKGROUNDS.map((bg) => {
          const isSelected = selectedBg.id === bg.id;
          return (
            <button
              key={bg.id}
              onClick={() => onSelectBg(bg)}
              className={`group relative rounded-xl overflow-hidden border text-left transition-all ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                  : 'border-white/[0.08] hover:border-white/[0.2] opacity-80 hover:opacity-100'
              }`}
            >
              <div className="relative aspect-[4/5] w-full bg-slate-900">
                <img
                  src={bg.thumbnailUrl}
                  alt={bg.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                
                {/* Default indicator badge */}
                {bg.isDefault && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-amber-400 text-black text-[9px] font-bold">
                    MẶC ĐỊNH
                  </div>
                )}
                
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-black shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs font-semibold text-white truncate">{bg.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {bg.tags[1] || bg.tags[0]}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Optional Prompt Refinement */}
      <div className="bg-black/30 p-3 rounded-xl border border-white/[0.04]">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Ghi chú bối cảnh nâng cao (Tùy chọn cho Google Omni):</span>
        </div>
        <input
          type="text"
          value={customPromptText}
          onChange={(e) => onChangeCustomPrompt(e.target.value)}
          placeholder="VD: Thêm ánh nắng chiều chiếu xiên qua cửa kính, kệ quần áo gỗ sồi trưng bày blazer..."
          className="w-full bg-[#0a0c10] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
        />
      </div>
    </div>
  );
};
