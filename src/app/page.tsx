'use client';

import { useState, FormEvent, useEffect } from 'react';
import {
  Home,
  Compass,
  Clock,
  Search,
  Sparkles,
  TrendingUp,
  Heart,
  Repeat2,
  MessageCircle,
  MoreHorizontal,
  BadgeCheck,
} from 'lucide-react';
import {
  FireOutlined,
  CrownOutlined,
  BulbOutlined,
  AlertOutlined,
  WarningOutlined,
  FlagOutlined,
  HistoryOutlined,
  StarOutlined,
  EditOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  LoadingOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { useFeedGenerator } from '@/hooks/useFeedGenerator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageToggleCompact } from '@/components/LanguageToggle';
import { ComposeModal } from '@/components/ComposeModal';
import { AuthRequiredModal } from '@/components/AuthRequiredModal';
import { EditPostModal } from '@/components/EditPostModal';
import { LearnMoreModal } from '@/components/LearnMoreModal';
import type { SocialPost } from '@/types';
import Link from 'next/link';

/**
 * Left Sidebar Navigation Component
 */
function LeftSidebar({ 
  onHomeClick, 
  onTimelineClick,
  activeTab 
}: { 
  onHomeClick?: () => void;
  onTimelineClick?: () => void;
  activeTab?: 'home' | 'timeline';
}) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { icon: Home, labelVi: 'Trang chủ', labelEn: 'Home', active: activeTab === 'home', onClick: onHomeClick, key: 'home' },
    { icon: Compass, labelVi: 'Khám phá', labelEn: 'Explore', active: false, onClick: undefined, key: 'explore' },
    { icon: Clock, labelVi: 'Dòng thời gian', labelEn: 'Timeline', active: activeTab === 'timeline', onClick: onTimelineClick, key: 'timeline' },
  ];

  return (
    <aside className="sticky top-0 h-screen w-[280px] px-3 py-4 flex flex-col border-r border-[#2f3336] overflow-y-auto scrollbar-hide">
      {/* Logo */}
      <div className="px-3 py-2 mb-4">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.jpg" 
            alt={t('Việt Sử Ký', 'VietChronicle')} 
            className="w-10 h-10 rounded-full object-cover border-2 border-[#da251d]/30"
          />
          <div>
            <span className="text-xl font-bold text-gradient-vietnam">
              {t('Việt Sử Ký', 'VietChronicle')}
            </span>
            <p className="text-[10px] text-[#71767b] flex items-center gap-1">
              {t('Ghi chép Lịch Sử', 'Historical Chronicle')}
              <FlagOutlined className="text-[#da251d]" />
            </p>
          </div>
        </div>
      </div>

{/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.labelEn}>
              <button
                onClick={item.onClick}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-full transition-colors hover:bg-[#16181c] ${
                  item.active ? 'font-bold' : 'font-normal'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-lg">{t(item.labelVi, item.labelEn)}</span>
              </button>
          </li>
          ))}
        </ul>
      </nav>

      {/* Language Toggle - Compact version for sidebar */}
      <div className="px-3 py-2">
        <LanguageToggleCompact />
      </div>

      {/* User Profile / Login Button */}
      <div className="px-3 py-3 mt-auto">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 p-3 rounded-full hover:bg-[#16181c] transition-colors"
            >
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/personas/svg?seed=${user.handle}`}
                alt={user.name}
                className="w-10 h-10 rounded-full bg-[#16181c]"
              />
              <div className="flex-1 text-left min-w-0">
                <p className="font-bold text-sm truncate">{user.name}</p>
                <p className="text-[#71767b] text-xs truncate">@{user.handle}</p>
              </div>
              <EllipsisOutlined className="text-[#71767b]" />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#16181c] border border-[#2f3336] rounded-xl shadow-xl overflow-hidden">
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1d1f23] transition-colors text-left text-red-400"
                >
                  <LogoutOutlined />
                  <span>{t('Đăng xuất', 'Log out')}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#da251d] to-[#ff6b35] text-white rounded-full font-bold hover:opacity-90 transition-all"
          >
            <LoginOutlined />
            {t('Đăng nhập', 'Sign In')}
          </Link>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 text-xs text-[#71767b]">
        <p>© 2024 {t('Việt Sử Ký', 'VietChronicle')}</p>
      </div>
    </aside>
  );
}

/**
 * Right Sidebar - Trending Topics Component
 */
function RightSidebar() {
  const { t } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(5);

  const trendingTopics = [
    { categoryVi: 'Đại thắng', categoryEn: 'Great Victory', title: 'Đống Đa - Quang Trung', time: '1789', hot: true },
    { categoryVi: 'Kháng chiến', categoryEn: 'Resistance', title: 'Chống Nguyên Mông', time: '1288', hot: true },
    { categoryVi: 'Thống nhất', categoryEn: 'Reunification', title: 'Giải phóng miền Nam', time: '1975', hot: true },
    { categoryVi: 'Dựng nước', categoryEn: 'Nation Building', title: 'Vua Hùng - Văn Lang', time: '2879 TCN', hot: true },
    { categoryVi: 'Khởi nghĩa', categoryEn: 'Uprising', title: 'Hai Bà Trưng', time: 'Năm 40', hot: true },
    { categoryVi: 'Chiến thắng', categoryEn: 'Victory', title: 'Bạch Đằng - Ngô Quyền', time: 'Năm 938', hot: false },
    { categoryVi: 'Tuyên ngôn', categoryEn: 'Declaration', title: 'Nam Quốc Sơn Hà', time: '1077', hot: false },
    { categoryVi: 'Khởi nghĩa', categoryEn: 'Uprising', title: 'Lam Sơn - Lê Lợi', time: '1418', hot: false },
    { categoryVi: 'Tuyên ngôn', categoryEn: 'Declaration', title: 'Bình Ngô Đại Cáo', time: '1428', hot: false },
    { categoryVi: 'Cải cách', categoryEn: 'Reform', title: 'Đổi Mới', time: '1986', hot: false },
  ];

  const displayedTopics = trendingTopics.slice(0, visibleCount);
  const hasMore = visibleCount < trendingTopics.length;
  const remainingCount = trendingTopics.length - visibleCount;

  const handleShowMore = () => {
    // Show 3 more items each time
    setVisibleCount(prev => Math.min(prev + 3, trendingTopics.length));
  };

  const handleShowLess = () => {
    setVisibleCount(5);
  };

  return (
    <aside className="sticky top-0 h-screen w-[350px] px-6 py-4 hidden lg:block overflow-y-auto scrollbar-none">
      {/* Trending Topics */}
      <div className="glass-strong rounded-2xl overflow-hidden">
        <h2 className="px-4 py-3 text-xl font-bold flex items-center gap-2">
          <FireOutlined className="text-[#ff6b35]" />
          {t('Xu hướng Lịch sử', 'Trending in History')}
        </h2>
        
        <div className={`divide-y divide-white/10 ${visibleCount > 5 ? 'max-h-[400px] overflow-y-auto scrollbar-none' : ''}`}>
          {displayedTopics.map((topic, index) => (
            <button
              key={topic.title}
              className="w-full px-4 py-2.5 text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-[#71767b] text-xs w-4">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#71767b]">{t(topic.categoryVi, topic.categoryEn)}</p>
                  <p className="font-bold text-sm truncate">{topic.title}</p>
                  <p className="text-[11px] text-[#da251d]">{topic.time}</p>
                </div>
                {topic.hot && (
                  <FireOutlined className="text-[#ff6b35] text-xs" />
                )}
              </div>
            </button>
          ))}
        </div>

        {hasMore ? (
          <button 
            onClick={handleShowMore}
            className="w-full px-4 py-3 text-[#da251d] hover:bg-white/5 transition-colors text-left"
          >
            {t(`Xem thêm (${remainingCount})`, `Show more (${remainingCount})`)}
          </button>
        ) : visibleCount > 5 ? (
          <button 
            onClick={handleShowLess}
            className="w-full px-4 py-3 text-[#da251d] hover:bg-white/5 transition-colors text-left"
          >
            {t('Thu gọn', 'Show less')}
          </button>
        ) : null}
      </div>

      {/* Historical Figures to Follow */}
      <div className="glass-strong rounded-2xl overflow-hidden mt-4">
        <h2 className="px-4 py-3 text-xl font-bold flex items-center gap-2">
          <CrownOutlined className="text-[#ffcd00]" />
          {t('Nhân vật lịch sử', 'Historical Figures')}
        </h2>
        
        <div className="divide-y divide-white/10">
          {[
            { name: 'Trần Hưng Đạo', handle: '@tranhungdao', titleVi: 'Đại tướng', titleEn: 'General', avatar: '/avatars/tranhungdao.jpeg' },
            { name: 'Quang Trung', handle: '@quangtrung', titleVi: 'Hoàng đế', titleEn: 'Emperor', avatar: '/avatars/quangtrung.jpg' },
            { name: 'Lê Lợi', handle: '@leloi_lamson', titleVi: 'Hoàng đế', titleEn: 'Emperor', avatar: '/avatars/leloi.jpg' },
          ].map((figure) => (
            <div
              key={figure.handle}
              className="px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={figure.avatar} 
                  alt={figure.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#da251d]/30"
                />
                <div>
                  <p className="font-bold flex items-center gap-1">
                    {figure.name}
                    <BadgeCheck className="w-4 h-4 text-[#da251d]" />
                  </p>
                  <p className="text-[#71767b] text-sm">{figure.handle}</p>
                  <p className="text-[#71767b] text-xs">{t(figure.titleVi, figure.titleEn)}</p>
                </div>
              </div>
              <button className="px-4 py-1.5 glass glass-hover rounded-full font-bold text-sm transition-all hover:shadow-[0_0_15px_rgba(218,37,29,0.3)]">
                {t('Theo dõi', 'Follow')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search suggestions */}
      <div className="mt-4 px-4 py-3 glass-strong rounded-2xl">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <BulbOutlined className="text-[#ffcd00]" />
          {t('Gợi ý tìm kiếm', 'Try searching')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Quang Trung', 'Điện Biên Phủ', 'Hai Bà Trưng', t('Văn hóa', 'Culture')].map((tag) => (
            <span key={tag} className="px-3 py-1 glass rounded-full text-sm text-[#71767b] hover:bg-white/10 cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom padding for scroll */}
      <div className="h-8" />
    </aside>
  );
}

/**
 * Simple Post Card Component
 */
function PostCard({ post, index, onEditClick, onPostDeleted, onLearnMoreClick }: { 
  post: SocialPost; 
  index: number;
  onEditClick?: (post: SocialPost) => void;
  onPostDeleted?: () => void;
  onLearnMoreClick?: (post: SocialPost) => void;
}) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Check if current user is the author
  const isOwnPost = user && post.author.handle === `@${user.handle}`;
  
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleDelete = async () => {
    if (!user || !isOwnPost) return;
    
    if (!confirm(t('Bạn có chắc muốn xóa bài viết này?', 'Are you sure you want to delete this post?'))) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts?postId=${post.id}&authorHandle=@${user.handle}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.success) {
        onPostDeleted?.();
      } else {
        alert(result.error || t('Xóa thất bại', 'Delete failed'));
      }
    } catch (error) {
      alert(t('Lỗi kết nối', 'Connection error'));
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  return (
    <article
      className="border-b border-[#2f3336] px-4 py-3 hover:bg-[#080808] transition-colors animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={post.author.avatarUrl}
            alt={post.author.name}
            className="w-10 h-10 rounded-full bg-[#16181c]"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-1 text-[15px]">
            <span className="font-bold hover:underline cursor-pointer truncate">
              {post.author.name}
            </span>
            {post.author.isVerified && (
              <BadgeCheck className="w-[18px] h-[18px] text-[#da251d] flex-shrink-0" />
            )}
            <span className="text-[#71767b] truncate">
              {post.author.handle}
            </span>
            <span className="text-[#71767b]">·</span>
            <span className="text-[#71767b] hover:underline cursor-pointer text-sm">
              {post.timestamp}
            </span>
            
            {/* More options menu */}
            <div className="relative ml-auto">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-[#da251d]/10 hover:text-[#da251d] rounded-full transition-colors"
              >
                <MoreHorizontal className="w-[18px] h-[18px]" />
              </button>
              
              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowMenu(false)} 
                  />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-[#16181c] border border-[#2f3336] rounded-xl shadow-xl overflow-hidden z-20">
                    {isOwnPost ? (
                      <>
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            onEditClick?.(post);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                        >
                          <EditOutlined className="text-[#1d9bf0]" />
                          <span>{t('Chỉnh sửa', 'Edit')}</span>
                        </button>
                        <button
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left text-red-400"
                        >
                          {isDeleting ? (
                            <LoadingOutlined className="animate-spin" />
                          ) : (
                            <DeleteOutlined />
                          )}
                          <span>{t('Xóa bài viết', 'Delete post')}</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setShowMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left text-[#71767b]"
                      >
                        <FlagOutlined />
                        <span>{t('Báo cáo', 'Report')}</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Post type badge */}
          {post.type === 'news' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 mb-2 text-xs font-bold bg-red-500/20 text-red-400 rounded glass">
              <AlertOutlined />
              {t('TIN NÓNG', 'BREAKING NEWS')}
            </span>
          )}
          {post.type === 'reply' && (
            <span className="inline-block text-[#71767b] text-sm mb-1">
              {t('Trả lời', 'Replying to')} <span className="text-[#da251d]">@lichsu_vn</span>
            </span>
          )}

          {/* Content */}
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {post.content.replace(/\[image:.*?\]/g, '').trim()}
          </p>

          {/* Image */}
          {post.imageUrl && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-[#2f3336]">
              <img 
                src={post.imageUrl} 
                alt="Post image"
                className="w-full max-h-[400px] object-cover hover:opacity-90 transition-opacity cursor-pointer"
                onClick={() => window.open(post.imageUrl, '_blank')}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between max-w-[425px] mt-3 -ml-2">
            <button className="flex items-center gap-1 group">
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                <MessageCircle className="w-[18px] h-[18px] text-[#71767b] group-hover:text-[#1d9bf0]" />
              </div>
              <span className="text-sm text-[#71767b] group-hover:text-[#1d9bf0]">
                {formatNumber(post.stats.replies)}
              </span>
            </button>

            <button className="flex items-center gap-1 group">
              <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                <Repeat2 className="w-[18px] h-[18px] text-[#71767b] group-hover:text-green-500" />
              </div>
              <span className="text-sm text-[#71767b] group-hover:text-green-500">
                {formatNumber(post.stats.retweets)}
              </span>
            </button>

            <button className="flex items-center gap-1 group">
              <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                <Heart className="w-[18px] h-[18px] text-[#71767b] group-hover:text-pink-500" />
              </div>
              <span className="text-sm text-[#71767b] group-hover:text-pink-500">
                {formatNumber(post.stats.likes)}
              </span>
            </button>

            <button className="flex items-center gap-1 group">
              <div className="p-2 rounded-full group-hover:bg-[#da251d]/10 transition-colors">
                <TrendingUp className="w-[18px] h-[18px] text-[#71767b] group-hover:text-[#da251d]" />
              </div>
            </button>
          </div>

          {/* Learn More Button */}
          <button
            onClick={() => onLearnMoreClick?.(post)}
            className="mt-3 flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-[#71767b] hover:text-[#da251d] hover:bg-[#da251d]/10 transition-all group"
          >
            <BookOutlined className="group-hover:text-[#ffcd00]" />
            <span>{t('Tìm hiểu thêm', 'Learn more')}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

/**
 * Loading Skeleton Component
 */
function LoadingSkeleton() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full glass-vietnam animate-liquid flex items-center justify-center">
          <HistoryOutlined className="text-3xl text-[#da251d]" />
        </div>
        <StarOutlined className="text-xl text-[#ffcd00] absolute -top-1 -right-1 animate-bounce" />
      </div>
      <p className="text-xl font-medium text-[#71767b] animate-pulse">
        {t('Đang tạo lịch sử...', 'Generating History...')}
      </p>
      <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-[#da251d] animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-[#ffcd00] animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-[#da251d] animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

/**
 * Error Display Component
 */
function ErrorDisplay({ message }: { message: string }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
      <div className="w-16 h-16 rounded-full glass flex items-center justify-center">
        <WarningOutlined className="text-3xl text-red-400" />
      </div>
      <p className="text-xl font-medium text-red-400">{t('Đã xảy ra lỗi', 'Something went wrong')}</p>
      <p className="text-[#71767b] max-w-sm">{message}</p>
    </div>
  );
}

/**
 * Empty State Component
 */
function EmptyState() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
      <div className="w-24 h-24 rounded-full glass-vietnam flex items-center justify-center animate-float">
        <FlagOutlined className="text-5xl text-[#da251d]" />
      </div>
      <h2 className="text-2xl font-bold text-gradient-vietnam">
        {t('Khám Phá Lịch Sử Việt Nam', 'Explore Vietnamese History')}
      </h2>
      <p className="text-[#71767b] max-w-sm">
        {t(
          'Nhập một chủ đề lịch sử ở trên để xem nó được tái hiện như mạng xã hội hiện đại.',
          'Enter a historical topic above to see it reimagined as a modern social media feed.'
        )}
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {['Quang Trung', 'Điện Biên Phủ', 'Hai Bà Trưng', '30/4/1975'].map((tag) => (
          <span key={tag} className="px-3 py-1 glass rounded-full text-sm border border-white/10 hover:border-[#da251d]/50 hover:bg-[#da251d]/10 cursor-pointer transition-all">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Timeline Empty State Component
 */
function TimelineEmptyState({ onComposeClick }: { onComposeClick: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#da251d] to-[#ffcd00] rounded-full opacity-20 animate-pulse" />
        <div className="relative w-full h-full glass-vietnam rounded-full flex items-center justify-center animate-float">
          <Clock className="w-12 h-12 text-[#da251d]" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gradient-vietnam">
        {t('Dòng thời gian của bạn', 'Your Timeline')}
      </h2>
      <p className="text-[#71767b] max-w-sm">
        {t(
          'Bạn chưa có bài đăng nào. Hãy chia sẻ kiến thức lịch sử đầu tiên của bạn!',
          "You don't have any posts yet. Share your first historical knowledge!"
        )}
      </p>
      <button
        onClick={onComposeClick}
        className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#da251d] to-[#ff6b35] text-white rounded-full font-bold hover:opacity-90 hover:shadow-[0_0_20px_rgba(218,37,29,0.4)] transition-all active:scale-95"
      >
        <EditOutlined className="text-lg" />
        {t('Viết bài đầu tiên', 'Write your first post')}
      </button>
    </div>
  );
}

/**
 * Main Feed Component
 */
function MainFeed({ mode = 'home', userHandle }: { mode?: 'home' | 'timeline'; userHandle?: string }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [learnMorePost, setLearnMorePost] = useState<SocialPost | null>(null);
  const [userPosts, setUserPosts] = useState<SocialPost[]>([]);
  const [isLoadingUserPosts, setIsLoadingUserPosts] = useState(false);
  const { state, generateFeed, loadAllPosts } = useFeedGenerator({ mockMode: false });

  const handleEditClick = (post: SocialPost) => {
    setEditingPost(post);
    setIsEditOpen(true);
  };

  const handleLearnMoreClick = (post: SocialPost) => {
    setLearnMorePost(post);
    setIsLearnMoreOpen(true);
  };

  const handlePostUpdated = () => {
    // Reload posts after editing
    if (mode === 'timeline') {
      loadUserPosts();
    } else {
      loadAllPosts();
    }
  };

  const handlePostDeleted = () => {
    // Reload posts after deleting
    if (mode === 'timeline') {
      loadUserPosts();
    } else {
      loadAllPosts();
    }
  };

  // Load posts based on mode
  useEffect(() => {
    if (mode === 'home') {
      loadAllPosts();
    } else if (mode === 'timeline' && userHandle) {
      loadUserPosts();
    }
  }, [mode, userHandle, loadAllPosts]);

  const loadUserPosts = async () => {
    if (!userHandle) return;
    
    setIsLoadingUserPosts(true);
    try {
      const response = await fetch(`/api/posts?authorHandle=@${userHandle}&sortBy=newest&limit=50`);
      const result = await response.json();
      
      if (result.success) {
        setUserPosts(result.data);
      }
    } catch (error) {
      console.error('Error loading user posts:', error);
    } finally {
      setIsLoadingUserPosts(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      generateFeed(searchQuery);
    }
  };

  const handlePostCreated = () => {
    // Reload posts after creating a new one
    if (mode === 'timeline') {
      loadUserPosts();
    } else {
      loadAllPosts();
    }
  };

  return (
    <main className="flex-1 max-w-2xl border-r border-[#2f3336] min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/80 border-b border-[#2f3336]">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {mode === 'timeline' ? (
              <>
                <Clock className="w-6 h-6 text-[#da251d]" />
                <div>
                  <h1 className="text-xl font-bold">{t('Dòng thời gian', 'My Timeline')}</h1>
                  {user && (
                    <p className="text-xs text-[#71767b]">@{user.handle}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <FlagOutlined className="text-2xl text-[#da251d]" />
                <h1 className="text-xl font-bold">{t('Trang chủ', 'Home')}</h1>
              </>
            )}
          </div>
          
          {/* Post Button */}
          <button 
            onClick={() => setIsComposeOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#da251d] to-[#ff6b35] text-white rounded-full font-bold text-sm hover:opacity-90 hover:shadow-[0_0_20px_rgba(218,37,29,0.4)] transition-all active:scale-95"
          >
            <EditOutlined className="text-lg" />
            {t('Đăng bài', 'Post')}
          </button>
        </div>

        {/* Compose Modal */}
        <ComposeModal 
          isOpen={isComposeOpen} 
          onClose={() => setIsComposeOpen(false)}
          onPostCreated={handlePostCreated}
        />

        {/* Edit Post Modal */}
        <EditPostModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setEditingPost(null);
          }}
          post={editingPost}
          onPostUpdated={handlePostUpdated}
        />

        {/* Learn More Modal */}
        <LearnMoreModal
          isOpen={isLearnMoreOpen}
          onClose={() => {
            setIsLearnMoreOpen(false);
            setLearnMorePost(null);
          }}
          post={learnMorePost}
        />

        {/* Search Input - Only show in home mode */}
        {mode === 'home' && (
          <form onSubmit={handleSubmit} className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71767b]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Tìm kiếm lịch sử Việt Nam...', 'Search Vietnamese history...')}
                className="w-full glass rounded-full py-3 pl-12 pr-32 text-[15px] placeholder-[#71767b] focus:outline-none focus:ring-2 focus:ring-[#da251d] transition-all"
              />
              <button
                type="submit"
                disabled={!searchQuery.trim() || state.status === 'loading'}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-[#da251d] to-[#ff6b35] text-white rounded-full font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_20px_rgba(218,37,29,0.4)]"
              >
                <Sparkles className="w-4 h-4 inline-block mr-1" />
                {t('Tạo', 'Generate')}
              </button>
            </div>
          </form>
        )}
      </header>

      {/* Feed Content */}
      <div>
        {/* Timeline Mode */}
        {mode === 'timeline' && (
          <>
            {isLoadingUserPosts && <LoadingSkeleton />}
            
            {!isLoadingUserPosts && userPosts.length === 0 && (
              <TimelineEmptyState onComposeClick={() => setIsComposeOpen(true)} />
            )}
            
            {!isLoadingUserPosts && userPosts.length > 0 && (
              <div>
                {/* Results header */}
                <div className="px-4 py-3 border-b border-[#2f3336]">
                  <p className="text-[#71767b] text-sm">
                    {t(
                      `Bạn có ${userPosts.length} bài viết`,
                      `You have ${userPosts.length} posts`
                    )}
                  </p>
                </div>
                
                {/* Posts */}
                {userPosts.map((post, index) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    index={index}
                    onEditClick={handleEditClick}
                    onPostDeleted={handlePostDeleted}
                    onLearnMoreClick={handleLearnMoreClick}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Home Mode */}
        {mode === 'home' && (
          <>
            {state.status === 'idle' && <EmptyState />}
            
            {state.status === 'loading' && <LoadingSkeleton />}
            
            {state.status === 'error' && (
              <ErrorDisplay message={state.error || t('Đã xảy ra lỗi không xác định', 'An unknown error occurred')} />
            )}
            
            {state.status === 'success' && (
              <div>
                {/* Results header */}
                <div className="px-4 py-3 border-b border-[#2f3336]">
                  <p className="text-[#71767b] text-sm">
                    {t(
                      `Hiển thị ${state.data.length} bài viết lịch sử`,
                      `Showing ${state.data.length} historical posts`
                    )}
                  </p>
                </div>
                
                {/* Posts */}
                {state.data.map((post, index) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    index={index}
                    onEditClick={handleEditClick}
                    onPostDeleted={handlePostDeleted}
                    onLearnMoreClick={handleLearnMoreClick}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

/**
 * Home Page
 */
export default function HomePage() {
  const { user } = useAuth();
  const [feedKey, setFeedKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'home' | 'timeline'>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleHomeClick = () => {
    setActiveTab('home');
    // Increment key to force MainFeed to remount and reload all posts
    setFeedKey(prev => prev + 1);
  };

  const handleTimelineClick = () => {
    if (!user) {
      // Show auth required modal if user is not logged in
      setShowAuthModal(true);
    } else {
      setActiveTab('timeline');
      setFeedKey(prev => prev + 1);
    }
  };

  return (
    <div className="flex justify-center min-h-screen">
      {/* Left Sidebar - Hidden on smaller screens */}
      <div className="hidden md:block">
        <LeftSidebar 
          onHomeClick={handleHomeClick} 
          onTimelineClick={handleTimelineClick}
          activeTab={activeTab}
        />
      </div>

      {/* Main Feed */}
      <MainFeed 
        key={feedKey} 
        mode={activeTab} 
        userHandle={user?.handle}
      />

      {/* Right Sidebar - Hidden on smaller screens */}
      <RightSidebar />

      {/* Auth Required Modal */}
      <AuthRequiredModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
