'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  LoadingOutlined,
  UserAddOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useLanguage();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError(t('Mật khẩu xác nhận không khớp', 'Passwords do not match'));
      return;
    }

    if (password.length < 6) {
      setError(t('Mật khẩu phải có ít nhất 6 ký tự', 'Password must be at least 6 characters'));
      return;
    }

    setIsLoading(true);

    const result = await register({ email, password, name, handle });
    
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Đăng ký thất bại');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#da251d]/20 to-[#ffcd00]/20 flex items-center justify-center">
            <HistoryOutlined className="text-3xl text-[#da251d]" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#da251d] to-[#ffcd00] bg-clip-text text-transparent">
            ChronoFeed
          </h1>
          <p className="text-[#71767b] mt-2">
            {t('Tạo tài khoản mới', 'Create a new account')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <UserOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71767b]" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('Họ và tên', 'Full name')}
              required
              className="w-full bg-[#16181c] border border-[#2f3336] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#71767b] focus:outline-none focus:border-[#da251d] transition-colors"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <MailOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71767b]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full bg-[#16181c] border border-[#2f3336] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#71767b] focus:outline-none focus:border-[#da251d] transition-colors"
            />
          </div>

          {/* Handle */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71767b]">@</span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="username"
              required
              className="w-full bg-[#16181c] border border-[#2f3336] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#71767b] focus:outline-none focus:border-[#da251d] transition-colors"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <LockOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71767b]" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('Mật khẩu', 'Password')}
              required
              minLength={6}
              className="w-full bg-[#16181c] border border-[#2f3336] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#71767b] focus:outline-none focus:border-[#da251d] transition-colors"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <LockOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71767b]" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('Xác nhận mật khẩu', 'Confirm password')}
              required
              className="w-full bg-[#16181c] border border-[#2f3336] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#71767b] focus:outline-none focus:border-[#da251d] transition-colors"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#da251d] to-[#ff6b35] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <LoadingOutlined className="animate-spin" />
            ) : (
              <UserAddOutlined />
            )}
            {t('Đăng ký', 'Sign Up')}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center mt-6 text-[#71767b]">
          {t('Đã có tài khoản?', 'Already have an account?')}{' '}
          <Link href="/auth/login" className="text-[#da251d] hover:underline">
            {t('Đăng nhập', 'Sign In')}
          </Link>
        </p>

        {/* Back to home */}
        <p className="text-center mt-4">
          <Link href="/" className="text-[#71767b] hover:text-white text-sm">
            ← {t('Quay về trang chủ', 'Back to home')}
          </Link>
        </p>
      </div>
    </div>
  );
}

