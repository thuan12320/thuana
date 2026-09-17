import React, { useRef } from 'react';
import { ModelActor, ProductItem } from '../types';
import { PRESET_MODELS, PRESET_PRODUCTS } from '../data/presets';
import { User, Shirt, Upload, Check, ShieldCheck, Sparkles, X, Tag } from 'lucide-react';

interface ActorAndProductInputProps {
  selectedActor: ModelActor;
  onSelectActor: (actor: ModelActor) => void;
  onUploadActorImage: (file: File) => void;
  selectedProduct: ProductItem | null;
  onSelectProduct: (product: ProductItem | null) => void;
  onUploadProductImage: (file: File) => void;
}

export const ActorAndProductInput: React.FC<ActorAndProductInputProps> = ({
  selectedActor,
  onSelectActor,
  onUploadActorImage,
  selectedProduct,
  onSelectProduct,
  onUploadProductImage,
}) => {
  const actorFileRef = useRef<HTMLInputElement>(null);
  const productFileRef = useRef<HTMLInputElement>(null);

  const handleActorUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUploadActorImage(file);
  };

  const handleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUploadProductImage(file);
  };

  return (
    <div className="space-y-4">
      {/* 2. Character / Model Selection */}
      <div className="bg-[#10121a]/80 rounded-2xl p-5 border border-white/[0.08] shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold tracking-luxury text-white font-display uppercase">
              2. Input Image Nhân Vật (Model)
            </h2>
          </div>
          <div>
            <input
              type="file"
              ref={actorFileRef}
              onChange={handleActorUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => actorFileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] text-xs text-slate-300 border border-white/[0.08] transition-all hover:text-white"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Tải ảnh Model</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-3">
          Khuôn mặt và vóc dáng của nhân vật sẽ được cố định khuôn mặt (Identity Lock) và đưa vào video.
        </p>

        {/* Model Presets Grid */}
        <div className="grid grid-cols-3 gap-3">
          {PRESET_MODELS.map((actor) => {
            const isSelected = selectedActor.id === actor.id;
            return (
              <button
                key={actor.id}
                onClick={() => onSelectActor(actor)}
                className={`relative p-2.5 rounded-xl border text-left transition-all flex flex-col sm:flex-row items-center sm:items-start gap-2.5 ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-400/15 to-transparent border-amber-400/50 ring-2 ring-amber-400/20'
                    : 'bg-black/20 hover:bg-white/[0.03] border-white/[0.06] opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={actor.avatarUrl}
                  alt={actor.name}
                  className="w-12 h-14 rounded-lg object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">{actor.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-amber-300/80 font-mono block">{actor.height}</span>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 hidden sm:block">{actor.vibe}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Product / Clothing Input & Crucial Rule Fallback */}
      <div className="bg-[#10121a]/80 rounded-2xl p-5 border border-white/[0.08] shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shirt className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold tracking-luxury text-white font-display uppercase">
              3. Sản Phẩm Quần Áo / Phụ Kiện Chính
            </h2>
          </div>
          <div>
            <input
              type="file"
              ref={productFileRef}
              onChange={handleProductUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => productFileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] text-xs text-slate-300 border border-white/[0.08] transition-all hover:text-white"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Tải ảnh Quần Áo</span>
            </button>
          </div>
        </div>

        {/* RULE BANNER - CRITICAL USER REQUIREMENT:
            "nếu ko có input ref sản phẩm thì mặc định giữ nguyên sản phẩm quần áo của video ref" */}
        <div className="mb-4">
          {selectedProduct === null ? (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-3 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                    Chế Độ: Giữ Nguyên Trang Phục Gốc Của Video Ref
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                    Active
                  </span>
                </div>
                <p className="text-xs text-emerald-300/80 mt-1 leading-relaxed">
                  Vì bạn <strong>chưa chọn sản phẩm mới</strong>, hệ thống tuân thủ quy tắc: <em>Mặc định giữ nguyên 100% chất liệu vải, màu sắc, hoạ tiết và chuyển động trang phục gốc của Video Ref</em>.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white">Chế Độ: Neural Garment Draping (Thay đồ AI)</span>
                  <p className="text-slate-300 text-[11px]">
                    Sản phẩm: <strong className="text-amber-300">{selectedProduct.name}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectProduct(null)}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-white/[0.08] hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 transition-all"
                title="Bỏ chọn để giữ nguyên trang phục gốc"
              >
                <X className="w-3 h-3" />
                <span>Giữ đồ gốc Video Ref</span>
              </button>
            </div>
          )}
        </div>

        {/* Option to Explicitly Select "Keep Original Garment" */}
        <div className="mb-3">
          <button
            onClick={() => onSelectProduct(null)}
            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              selectedProduct === null
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Không thêm sản phẩm (Giữ nguyên trang phục gốc Video Ref)</span>
            {selectedProduct === null && <Check className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* Preset Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESET_PRODUCTS.map((prod) => {
            const isSelected = selectedProduct?.id === prod.id;
            return (
              <button
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className={`group relative aspect-[3/4] w-full rounded-xl overflow-hidden border text-left transition-all ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                    : 'bg-black/20 hover:bg-white/[0.03] border-white/[0.08]'
                }`}
              >
                <img
                  src={prod.imageUrl}
                  alt={prod.name || 'Ảnh sản phẩm'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {isSelected && (
                  <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold z-10 shadow-xs">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                )}
                {prod.name && (
                  <div className="absolute inset-x-1.5 bottom-1.5 py-1 px-1.5 rounded-md bg-black/75 backdrop-blur-xs text-[10px] text-white text-center font-medium truncate opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {prod.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
