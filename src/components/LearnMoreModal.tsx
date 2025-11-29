'use client';

import { useState, useEffect, useRef } from 'react';
import {
  CloseOutlined,
  LoadingOutlined,
  BookOutlined,
  CalendarOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SocialPost } from '@/types';

interface LearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: SocialPost | null;
}

export function LearnMoreModal({ isOpen, onClose, post }: LearnMoreModalProps) {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && post) {
      fetchDetails();
    }
  }, [isOpen, post, language]);

  // Scroll to top when content loads
  useEffect(() => {
    if (content && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [content]);

  const fetchDetails = async () => {
    if (!post) return;

    setIsLoading(true);
    setError(null);
    setContent(null);

    try {
      const response = await fetch('/api/learn-more', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: (post as unknown as { topic?: string }).topic || post.author.name,
          content: post.content,
          authorName: post.author.name,
          timestamp: post.timestamp,
          language: language,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setContent(result.data.content);
      } else {
        setError(result.error || t('Không thể lấy thông tin chi tiết', 'Could not fetch details'));
      }
    } catch (err) {
      setError(t('Lỗi kết nối. Vui lòng thử lại.', 'Connection error. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop with strong blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] mx-4 bg-gradient-to-br from-[#0d0d0d] via-[#151515] to-[#1a1a1a] border border-[#2f3336]/80 rounded-3xl shadow-[0_0_60px_rgba(218,37,29,0.15),0_0_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-modal-appear">
        
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-[#2f3336] bg-gradient-to-r from-black/90 to-black/70">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#da251d] to-[#ffcd00] flex items-center justify-center shadow-lg shadow-[#da251d]/30">
              <BookOutlined className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gradient-vietnam">
                {t('Tìm hiểu thêm', 'Learn More')}
              </h2>
              <p className="text-xs text-[#71767b]">
                {t('Thông tin chi tiết từ AI', 'Detailed information from AI')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-white/10 rounded-full transition-all duration-200 hover:rotate-90"
          >
            <CloseOutlined className="text-lg text-[#71767b] hover:text-white" />
          </button>
        </div>

        {/* Post Info */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-[#2f3336] bg-[#16181c]/50">
          <div className="flex items-start gap-3">
            <img
              src={post.author.avatarUrl}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#da251d]/40 shadow-lg"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{post.author.name}</span>
                <span className="text-[#71767b] text-sm">{post.author.handle}</span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-[#71767b]">
                <span className="flex items-center gap-1">
                  <CalendarOutlined />
                  {post.timestamp}
                </span>
                {(post as unknown as { topic?: string }).topic && (
                  <span className="flex items-center gap-1">
                    <BulbOutlined />
                    {(post as unknown as { topic?: string }).topic}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content - Scrollable from top */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full glass-vietnam flex items-center justify-center">
                  <LoadingOutlined className="text-3xl text-[#da251d] animate-spin" />
                </div>
              </div>
              <p className="text-[#71767b] animate-pulse">
                {t('Đang tìm hiểu thông tin...', 'Fetching information...')}
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
              {error}
              <button
                onClick={fetchDetails}
                className="block mx-auto mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
              >
                {t('Thử lại', 'Retry')}
              </button>
            </div>
          )}

          {content && !isLoading && (
            <div className="prose prose-invert max-w-none">
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap text-gray-200">
                {content.split('\n').map((paragraph, index) => {
                  if (/^\d+\./.test(paragraph) || /^\*\*/.test(paragraph)) {
                    return (
                      <h3 key={index} className="text-[#da251d] font-bold mt-4 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#ffcd00] rounded-full" />
                        {paragraph.replace(/\*\*/g, '')}
                      </h3>
                    );
                  }
                  return paragraph ? (
                    <p key={index} className="mb-3 text-gray-300">
                      {paragraph}
                    </p>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-[#2f3336] bg-gradient-to-r from-black/90 to-black/70">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#71767b] flex items-center gap-1.5">
              <BulbOutlined className="text-[#ffcd00]" />
              {t('Nội dung được tạo bởi AI', 'Content generated by AI')}
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gradient-to-r from-[#da251d] to-[#ff6b35] text-white rounded-full font-bold text-sm hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg shadow-[#da251d]/30"
            >
              {t('Đóng', 'Close')}
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#da251d]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#ffcd00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#da251d]/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}

export default LearnMoreModal;
