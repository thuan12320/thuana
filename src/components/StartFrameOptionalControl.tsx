import React, { useRef } from 'react';
import { Image as ImageIcon, Upload, X, Check, ArrowRight, Layers } from 'lucide-react';

interface StartFrameOptionalControlProps {
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  startFrameImage: string | null;
  onSetStartFrameImage: (imgUrl: string | null) => void;
  lastExtractedEndFrame: string | null;
}

export const StartFrameOptionalControl: React.FC<StartFrameOptionalControlProps> = ({
  enabled,
  onToggleEnabled,
  startFrameImage,
  onSetStartFrameImage,
  lastExtractedEndFrame,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSetStartFrameImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#10121a]/80 rounded-2xl p-5 border border-white/[0.08] shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-luxury text-white font-display uppercase">
                5. Khung Hình Bắt Đầu (Start Frame)
              </h2>
              <span className="text-[10px] uppercase font-bold font-label px-2 py-0.5 rounded bg-white/[0.08] text-slate-300">
                Optional
              </span>
            </div>
            <p className="text-xs text-slate-400 font-content leading-relaxed mt-0.5">
              Cố định hình ảnh khởi đầu để xâu chuỗi nhiều video affiliate 10s mượt mà.
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggleEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
        </label>
      </div>

      {/* Expanded configuration when enabled */}
      {enabled && (
        <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Start Frame Preview Box */}
            <div className="w-24 h-32 rounded-xl bg-black/50 border border-white/[0.1] overflow-hidden flex items-center justify-center shrink-0 relative">
              {startFrameImage ? (
                <>
                  <img
                    src={startFrameImage}
                    alt="Start Frame"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onSetStartFrameImage(null)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-600 transition-all"
                    title="Xóa Start Frame"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="text-center p-2 text-slate-500 text-[10px]">
                  <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-40" />
                  <span>Chưa chọn ảnh</span>
                </div>
              )}
            </div>

            {/* Actions for Start Frame */}
            <div className="flex-1 space-y-2 w-full">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] text-xs text-slate-300 border border-white/[0.08] transition-all hover:text-white"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Tải ảnh Start Frame từ máy tính</span>
              </button>

              {/* One-click button to use last extracted end frame */}
              {lastExtractedEndFrame && (
                <button
                  onClick={() => onSetStartFrameImage(lastExtractedEndFrame)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/30 text-xs font-medium transition-all"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Dùng End Frame vừa trích xuất của clip trước</span>
                </button>
              )}

              <p className="text-[11px] text-slate-400 leading-tight">
                Mẹo: Dùng <strong>End Frame</strong> của clip 1 làm <strong>Start Frame</strong> của clip 2 để nối các video 10s thành 1 chuỗi review dài 20s-30s liên tục không bị giật khung hình!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
