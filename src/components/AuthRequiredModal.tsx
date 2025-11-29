'use client';

import { CloseOutlined, LoginOutlined, UserAddOutlined, HistoryOutlined, LockOutlined } from '@ant-design/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthRequiredModal({ isOpen, onClose }: AuthRequiredModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#2f3336] rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <CloseOutlined className="text-lg text-[#71767b]" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#da251d] to-[#ffcd00] rounded-full opacity-20 animate-pulse" />
            <div className="relative w-full h-full glass-vietnam rounded-full flex items-center justify-center">
              <LockOutlined className="text-4xl text-[#da251d]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-[#ffcd00] to-[#ff6b35] rounded-full flex items-center justify-center shadow-lg">
              <HistoryOutlined className="text-sm text-black" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gradient-vietnam mb-3">
            {t('Đăng nhập để tiếp tục', 'Sign in to continue')}
          </h2>

          {/* Description */}
          <p className="text-[#71767b] mb-8 leading-relaxed">
            {t(
              'Để xem dòng thời gian cá nhân và các bài đăng của bạn, vui lòng đăng nhập hoặc tạo tài khoản mới.',
              'To view your personal timeline and posts, please sign in or create a new account.'
            )}
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-3 w-full py-3.5 bg-gradient-to-r from-[#da251d] to-[#ff6b35] text-white rounded-full font-bold text-lg hover:opacity-90 hover:shadow-[0_0_30px_rgba(218,37,29,0.4)] transition-all active:scale-[0.98]"
            >
              <LoginOutlined className="text-xl" />
              {t('Đăng nhập', 'Sign In')}
            </Link>

            <Link
              href="/auth/register"
              className="flex items-center justify-center gap-3 w-full py-3.5 glass border border-[#2f3336] hover:border-[#da251d]/50 rounded-full font-bold text-lg hover:bg-white/5 transition-all active:scale-[0.98]"
            >
              <UserAddOutlined className="text-xl" />
              {t('Tạo tài khoản mới', 'Create Account')}
            </Link>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-xs text-[#71767b]">
            {t(
              'Bằng việc đăng ký, bạn đồng ý với Điều khoản và Chính sách bảo mật của chúng tôi.',
              'By signing up, you agree to our Terms and Privacy Policy.'
            )}
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#da251d]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#ffcd00]/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

export default AuthRequiredModal;

