import React from 'react';
import { HelpCircle, X, CheckCircle2, Sparkles, Camera, ShieldCheck, Film, Layers, Grid } from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#ffffff] border border-[#e8dfd2] rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0eae0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#b45309]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#292524] font-display tracking-luxury-tight">
                Hướng Dẫn Sử Dụng Lumière Omni Pastel Studio
              </h3>
              <p className="text-xs text-[#78716c] font-content leading-relaxed">
                Quản lý & tạo video Affiliate thời trang đa clip với Google Omni 1.1 Flash
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

        {/* Content Body */}
        <div className="my-4 flex-1 overflow-y-auto space-y-4 pr-1 text-xs leading-relaxed text-[#57534e] font-content">
          {/* Pastel highlight box */}
          <div className="p-3.5 rounded-2xl bg-[#fff7ed] border border-[#fed7aa]">
            <h4 className="font-bold text-[#c2410c] text-sm flex items-center gap-1.5 mb-1 font-display tracking-luxury-tight">
              <Sparkles className="w-4 h-4" /> Giao diện Video Grid Đồng Thời & Gói Gọn 1 Khung Hình
            </h4>
            <p className="text-[#9a3412] leading-relaxed">
              Studio được bố trí thông minh trong 1 khung hình duy nhất: Bên trái là <strong>Khung điều khiển chi tiết</strong> linh hoạt cho từng clip (hoặc áp dụng tất cả); bên phải là <strong>Video Grid</strong> để bạn xem, phát, quản lý và render cùng lúc nhiều video!
            </p>
          </div>

          {/* Features Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#292524] text-xs uppercase tracking-luxury font-label">
              Quy trình thao tác & các tính năng cốt lõi:
            </h4>

            <div className="p-3 rounded-2xl bg-[#faf8f5] border border-[#ede5d8] space-y-1">
              <div className="flex items-center gap-2 text-[#292524] font-bold">
                <span className="w-5 h-5 rounded-full bg-[#fed7aa] text-[#b45309] flex items-center justify-center text-[10px] font-black">1</span>
                <span>Video Grid Đa Clip (Quản lý đồng thời):</span>
              </div>
              <p className="text-[#78716c] pl-7">
                Dễ dàng bấm <strong>"+ Thêm Video"</strong> để tạo thêm clip trong grid. Chuyển đổi giữa 2 Cột, 3 Cột hoặc 4 Cột. Bấm <strong>"⚡ Tạo Tất Cả"</strong> để Google Omni 1.1 Flash render đồng loạt toàn bộ các clip.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#faf8f5] border border-[#ede5d8] space-y-1">
              <div className="flex items-center gap-2 text-[#292524] font-bold">
                <span className="w-5 h-5 rounded-full bg-[#fed7aa] text-[#b45309] flex items-center justify-center text-[10px] font-black">2</span>
                <span>Độ dài video tối đa 10s & Tỉ lệ (Ratio):</span>
              </div>
              <p className="text-[#78716c] pl-7">
                Khung điều chỉnh độ dài thanh trượt từ 1.0s đến 10.0s tối đa. Tùy chọn tỉ lệ 9:16 (TikTok/Reels/Shopee), 16:9, 1:1 hoặc 4:5.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#faf8f5] border border-[#ede5d8] space-y-1">
              <div className="flex items-center gap-2 text-[#292524] font-bold">
                <span className="w-5 h-5 rounded-full bg-[#fed7aa] text-[#b45309] flex items-center justify-center text-[10px] font-black">3</span>
                <span>Quy tắc giữ nguyên trang phục gốc:</span>
              </div>
              <p className="text-[#78716c] pl-7">
                Nếu không chọn sản phẩm quần áo phụ kiện mới, hệ thống tự động khóa và <strong>bảo tồn 100% trang phục gốc</strong> từ Video Ref (thể hiện bằng huy hiệu xanh <em>"Giữ Đồ Gốc"</em> trên góc video).
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#faf8f5] border border-[#ede5d8] space-y-1">
              <div className="flex items-center gap-2 text-[#292524] font-bold">
                <span className="w-5 h-5 rounded-full bg-[#fed7aa] text-[#b45309] flex items-center justify-center text-[10px] font-black">4</span>
                <span>Bối cảnh Industrial Penthouse có kệ quần áo:</span>
              </div>
              <p className="text-[#78716c] pl-7">
                Nút chọn background style được cấu hình mặc định là <strong>Industrial Penthouse style</strong> có kệ quần áo thép đen, thanh gỗ sồi treo trang phục và kính panorama nhìn ra thành phố.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#faf8f5] border border-[#ede5d8] space-y-1">
              <div className="flex items-center gap-2 text-[#292524] font-bold">
                <span className="w-5 h-5 rounded-full bg-[#fed7aa] text-[#b45309] flex items-center justify-center text-[10px] font-black">5</span>
                <span>Nút nhỏ "Extract End Frame" trên góc video:</span>
              </div>
              <p className="text-[#78716c] pl-7">
                Trên góc trên bên phải mỗi video card trong grid luôn có nút nhỏ <strong>"Extract End Frame"</strong>. Bấm nút này để trích xuất ảnh frame cuối, tải PNG hoặc bấm <strong>"Nối làm Start Frame"</strong> cho clip kế tiếp để tạo thành chuỗi video storyboard bán hàng hoàn hảo!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#f0eae0] flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-xs transition-colors"
          >
            Đã hiểu, bắt đầu sáng tạo!
          </button>
        </div>
      </div>
    </div>
  );
};
