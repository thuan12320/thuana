import React from 'react';
import { Download, ArrowRight, X, Copy, Check, Sparkles, Layers } from 'lucide-react';

interface EndFrameModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  onSetAsStartFrame: () => void;
  clipTitle?: string;
}

export const EndFrameModal: React.FC<EndFrameModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onSetAsStartFrame,
  clipTitle,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `lumiere-end-frame-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#ffffff] border border-[#e8dfd2] rounded-3xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0eae0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fff7ed] border border-[#fed7aa] flex items-center justify-center text-[#ea580c]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#292524] font-display tracking-luxury-tight">
                Trích Xuất End Frame Thành Công
              </h3>
              <p className="text-xs text-[#78716c] font-content leading-relaxed">
                Khung hình cuối cùng của video {clipTitle ? `(${clipTitle})` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#f5efe6] text-[#78716c] hover:text-[#292524] transition-colors font-label"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Preview Container */}
        <div className="my-5 relative rounded-2xl overflow-hidden bg-[#faf8f5] border border-[#e8dfd2] p-2 flex items-center justify-center max-h-[380px]">
          <img
            src={imageUrl}
            alt="Extracted End Frame"
            className="max-h-[360px] w-auto object-contain rounded-xl shadow-md"
          />
          <span className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-mono">
            30 FPS End Frame Tensor
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          {/* Apply as start frame button */}
          <button
            onClick={() => {
              onSetAsStartFrame();
              onClose();
            }}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#ea580c] to-[#c2410c] hover:from-[#c2410c] hover:to-[#9a3412] text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>Nối Làm Start Frame Cho Clip Kế Tiếp</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none py-2.5 px-3 rounded-xl bg-[#faf8f5] hover:bg-[#f5ede2] text-[#44403c] text-xs font-semibold border border-[#e8dfd2] flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#78716c]" />}
              <span>{copied ? 'Đã Sao Chép' : 'Sao Chép'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none py-2.5 px-3 rounded-xl bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#15803d] text-xs font-semibold border border-[#bbf7d0] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Tải PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
