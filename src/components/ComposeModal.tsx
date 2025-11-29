'use client';

import { useState, FormEvent, useRef } from 'react';
import {
  CloseOutlined,
  GlobalOutlined,
  PictureOutlined,
  SmileOutlined,
  CalendarOutlined,
  SendOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

const historicalTopics = [
  'Dựng nước',
  'Hai Bà Trưng',
  'Bạch Đằng',
  'Nam Quốc Sơn Hà',
  'Chống Nguyên Mông',
  'Khởi nghĩa Lam Sơn',
  'Bình Ngô Đại Cáo',
  'Quang Trung',
  'Tuyên ngôn Độc lập',
  'Điện Biên Phủ',
  'Thống nhất 1975',
  'Đổi Mới',
  'Văn hóa',
  'Khác',
];

export function ComposeModal({ isOpen, onClose, onPostCreated }: ComposeModalProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const maxLength = 500;
  const remainingChars = maxLength - content.length;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(t('Ảnh quá lớn (tối đa 5MB)', 'Image too large (max 5MB)'));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      setImageFile(base64);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError(t('Vui lòng nhập nội dung', 'Please enter content'));
      return;
    }

    if (!user) {
      setError(t('Vui lòng đăng nhập để đăng bài', 'Please login to post'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let imageUrl = null;

      // Upload image if exists
      if (imageFile) {
        setIsUploading(true);
        try {
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageFile, folder: 'chronofeed/posts' }),
          });
          const uploadResult = await uploadRes.json();
          console.log('Upload result:', uploadResult);
          if (uploadResult.success) {
            imageUrl = uploadResult.data.url;
          } else {
            console.error('Upload failed:', uploadResult.error);
            setError(t('Lỗi upload ảnh: ' + (uploadResult.error || 'Unknown'), 'Image upload error'));
            setIsUploading(false);
            setIsLoading(false);
            return;
          }
        } catch (uploadErr) {
          console.error('Upload error:', uploadErr);
          setError(t('Lỗi upload ảnh', 'Image upload error'));
          setIsUploading(false);
          setIsLoading(false);
          return;
        }
        setIsUploading(false);
      }

      // Create post
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: `user-${Date.now()}`,
          topic: topic || 'Lịch sử Việt Nam',
          authorName: user.name,
          authorHandle: `@${user.handle}`,
          content: content,
          timestamp: timestamp || 'Vừa xong',
          type: 'post',
          imageUrl: imageUrl,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setContent('');
        setTopic('');
        setTimestamp('');
        setImagePreview(null);
        setImageFile(null);
        onClose();
        onPostCreated?.();
      } else {
        setError(result.error || t('Đăng bài thất bại', 'Failed to post'));
      }
    } catch (err) {
      setError(t('Lỗi kết nối server', 'Server connection error'));
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl mx-4 bg-black border border-[#2f3336] rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2f3336]">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <CloseOutlined className="text-lg" />
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isLoading || !user}
            className="px-5 py-1.5 bg-gradient-to-r from-[#da251d] to-[#ff6b35] text-white rounded-full font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <LoadingOutlined className="animate-spin" />
            ) : (
              <SendOutlined />
            )}
            {t('Đăng', 'Post')}
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {/* User info */}
          {user ? (
            <div className="flex gap-3 mb-4">
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/personas/svg?seed=${user.handle}`}
                alt={user.name}
                className="w-10 h-10 rounded-full bg-[#16181c]"
              />
              <div>
                <p className="font-bold text-sm">{user.name}</p>
                <p className="text-[#71767b] text-xs">@{user.handle}</p>
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-[#16181c] rounded-xl text-center">
              <p className="text-[#71767b] text-sm">
                {t('Vui lòng đăng nhập để đăng bài', 'Please login to post')}
              </p>
              <a href="/auth/login" className="text-[#da251d] text-sm hover:underline">
                {t('Đăng nhập', 'Login')}
              </a>
            </div>
          )}

          {/* Content textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
            placeholder={t('Chia sẻ về lịch sử Việt Nam...', 'Share about Vietnamese history...')}
            className="w-full bg-transparent text-white text-lg placeholder-[#71767b] resize-none focus:outline-none min-h-[120px]"
            disabled={!user}
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative mb-4 rounded-xl overflow-hidden">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full max-h-[300px] object-cover rounded-xl"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black/90 rounded-full transition-colors"
              >
                <DeleteOutlined className="text-white" />
              </button>
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <LoadingOutlined className="text-3xl text-white animate-spin" />
                </div>
              )}
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Topic selector */}
          <div className="mb-4">
            <label className="text-[#71767b] text-sm mb-2 block">
              {t('Chủ đề', 'Topic')}
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#16181c] border border-[#2f3336] rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#da251d]"
              disabled={!user}
            >
              <option value="">{t('Chọn chủ đề...', 'Select topic...')}</option>
              {historicalTopics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Timestamp input */}
          <div className="mb-4">
            <label className="text-[#71767b] text-sm mb-2 block flex items-center gap-2">
              <CalendarOutlined />
              {t('Thời điểm lịch sử (tùy chọn)', 'Historical time (optional)')}
            </label>
            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder={t('VD: Năm 1945, Thế kỷ 19...', 'E.g: Year 1945, 19th century...')}
              className="w-full bg-[#16181c] border border-[#2f3336] rounded-xl px-4 py-2 text-white text-sm placeholder-[#71767b] focus:outline-none focus:border-[#da251d]"
              disabled={!user}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#2f3336]">
          <div className="flex gap-1">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 hover:bg-[#da251d]/10 hover:text-[#da251d] rounded-full transition-colors ${imagePreview ? 'text-[#da251d]' : 'text-[#71767b]'}`}
              disabled={!user}
              title={t('Thêm ảnh', 'Add image')}
            >
              <PictureOutlined />
            </button>
            <button className="p-2 hover:bg-[#da251d]/10 hover:text-[#da251d] rounded-full transition-colors text-[#71767b]">
              <SmileOutlined />
            </button>
            <button className="p-2 hover:bg-[#da251d]/10 hover:text-[#da251d] rounded-full transition-colors text-[#71767b]">
              <GlobalOutlined />
            </button>
          </div>
          
          {/* Character count */}
          <div className={`text-sm ${remainingChars < 50 ? 'text-[#ff6b35]' : 'text-[#71767b]'}`}>
            {remainingChars}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComposeModal;

