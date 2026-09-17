import React from 'react';
import { GenerationConfig } from '../types';
import { Cpu, X, Copy, Check, Code2, Film, Sparkles, ShieldCheck } from 'lucide-react';

interface PromptInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GenerationConfig;
  clipTitle?: string;
}

export const PromptInspectorModal: React.FC<PromptInspectorModalProps> = ({
  isOpen,
  onClose,
  config,
  clipTitle,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const structuredPayload = {
    model: 'google-omni-1.1-flash',
    task: 'fashion_affiliate_video_synthesis',
    constraints: {
      max_duration_seconds: 10.0,
      selected_duration_seconds: config.duration,
      aspect_ratio: config.ratio,
      target_fps: 30,
      total_frames: Math.round(config.duration * 30),
    },
    conditioning: {
      video_reference: {
        id: config.videoRef.id,
        motion_category: config.videoRef.motionType,
        tracking_mode: 'DensePose_Keypoint_Retargeting',
        preserve_motion_vectors: true,
      },
      character_identity: {
        id: config.actor.id,
        name: config.actor.name,
        ethnicity: config.actor.ethnicity,
        facial_identity_lock: true,
      },
      garment_conditioning: config.product === null
        ? {
            strategy: 'PRESERVE_ORIGINAL_REFERENCE_CLOTHING',
            note: 'Không có sản phẩm đầu vào: Mặc định giữ nguyên 100% trang phục của video ref',
            drape_replacement: false,
          }
        : {
            strategy: 'NEURAL_GARMENT_DRAPING',
            product_name: config.product.name,
            category: config.product.category,
            sale_price: config.product.salePrice,
            drape_replacement: true,
            preserve_fabric_physics: true,
          },
      environment_background: {
        style_id: config.backgroundStyle.id,
        name: config.backgroundStyle.name,
        is_default_industrial_penthouse: config.backgroundStyle.id === 'bg-industrial-penthouse',
        elements: ['clothes_racks', 'polished_concrete_wall', 'panoramic_glass_skyline'],
      },
      frame_chaining: {
        has_start_frame: config.enableStartFrame,
        start_frame_source: config.enableStartFrame ? 'custom_or_previous_end_frame' : 'none',
        extract_end_frame_enabled: true,
      },
      affiliate_overlay: config.affiliateOverlay,
    },
  };

  const jsonString = JSON.stringify(structuredPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#ffffff] border border-[#e8dfd2] rounded-3xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0eae0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#e0f2fe] border border-[#bae6fd] flex items-center justify-center text-[#0284c7]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#292524] font-display tracking-luxury-tight">
                Google Omni 1.1 Flash Payload Inspector
              </h3>
              <p className="text-xs text-[#78716c] font-content leading-relaxed">
                Cấu trúc Conditioning Tensors gửi đến model Omni {clipTitle ? `(${clipTitle})` : ''}
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

        {/* JSON Preview */}
        <div className="my-4 flex-1 overflow-y-auto bg-[#faf8f5] border border-[#e8dfd2] rounded-2xl p-4 font-mono text-xs text-[#334155] leading-relaxed">
          <pre>{jsonString}</pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#f0eae0]">
          <div className="flex items-center gap-2 text-xs text-[#78716c]">
            <Code2 className="w-4 h-4 text-[#ea580c]" />
            <span>Đầy đủ tham số theo đúng yêu cầu prompt kỹ thuật</span>
          </div>

          <button
            onClick={handleCopy}
            className="py-2 px-4 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã Sao Chép JSON' : 'Sao Chép JSON'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
