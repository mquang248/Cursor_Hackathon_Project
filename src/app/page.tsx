'use client';

import { useState, FormEvent } from 'react';
import {
  HomeOutlined,
  CompassOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  RiseOutlined,
  HeartOutlined,
  SwapOutlined,
  MessageOutlined,
  MoreOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useFeedGenerator } from '@/hooks/useFeedGenerator';
import type { SocialPost } from '@/types';
import PhotoPostModal from '@/components/PhotoPostModal';

/**
 * Left Sidebar Navigation Component
 */
function LeftSidebar({ onPostClick }: { onPostClick: () => void }) {
  const navItems = [
    { icon: HomeOutlined, label: 'Home', active: true },
    { icon: CompassOutlined, label: 'Explore', active: false },
    { icon: ClockCircleOutlined, label: 'Timeline', active: false },
  ];

  return (
    <aside className="sticky top-0 h-screen w-[275px] px-3 py-4 flex flex-col border-r border-[#2f3336]">
      {/* Logo */}
      <div className="px-3 py-2 mb-4">
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="w-8 h-8 text-[#1d9bf0]" style={{ fontSize: '32px' }} />
          <span className="text-xl font-bold bg-gradient-to-r from-[#1d9bf0] to-purple-500 bg-clip-text text-transparent">
            ChronoFeed
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-full transition-colors hover:bg-[#16181c] ${
                  item.active ? 'font-bold' : 'font-normal'
                }`}
              >
                <item.icon style={{ fontSize: '24px' }} />
                <span className="text-xl">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Post Button */}
      <div className="px-3 py-2">
        <button
          onClick={onPostClick}
          className="w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-3 px-4 rounded-full transition-colors text-lg"
        >
          Post
        </button>
      </div>

      {/* Footer */}
      <div className="px-3 py-4 text-sm text-[#71767b]">
        <p>© 2024 ChronoFeed</p>
        <p>Hackathon Project</p>
      </div>
    </aside>
  );
}

/**
 * Right Sidebar - Trending Topics Component
 */
function RightSidebar() {
  const trendingTopics = [
    { category: 'Ancient History', title: 'Roman Empire', posts: '45.2K' },
    { category: 'World Wars', title: 'D-Day Anniversary', posts: '128K' },
    { category: 'Space', title: 'Moon Landing 1969', posts: '89.3K' },
    { category: 'Revolution', title: 'French Revolution', posts: '34.1K' },
    { category: 'Renaissance', title: 'Leonardo da Vinci', posts: '22.8K' },
  ];

  return (
    <aside className="sticky top-0 h-screen w-[350px] px-6 py-4 hidden lg:block">
      {/* Trending Topics */}
      <div className="bg-[#16181c] rounded-2xl overflow-hidden">
        <h2 className="px-4 py-3 text-xl font-bold">Trending in History</h2>
        
        <div className="divide-y divide-[#2f3336]">
          {trendingTopics.map((topic) => (
            <button
              key={topic.title}
              className="w-full px-4 py-3 text-left hover:bg-[#1d1f23] transition-colors"
            >
              <p className="text-[13px] text-[#71767b]">{topic.category}</p>
              <p className="font-bold">{topic.title}</p>
              <p className="text-[13px] text-[#71767b]">{topic.posts} posts</p>
            </button>
          ))}
        </div>

        <button className="w-full px-4 py-3 text-[#1d9bf0] hover:bg-[#1d1f23] transition-colors text-left">
          Show more
        </button>
      </div>

      {/* Who to follow - Historical Figures */}
      <div className="bg-[#16181c] rounded-2xl overflow-hidden mt-4">
        <h2 className="px-4 py-3 text-xl font-bold">Figures to Follow</h2>
        
        <div className="divide-y divide-[#2f3336]">
          {[
            { name: 'Cleopatra', handle: '@queenofnile' },
            { name: 'Napoleon', handle: '@emperor_nap' },
            { name: 'Einstein', handle: '@relativity' },
          ].map((figure) => (
            <div
              key={figure.handle}
              className="px-4 py-3 flex items-center justify-between hover:bg-[#1d1f23] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1d9bf0] to-purple-500" />
                <div>
                  <p className="font-bold flex items-center gap-1">
                    {figure.name}
                    <CheckCircleOutlined className="text-[#1d9bf0]" style={{ fontSize: '16px' }} />
                  </p>
                  <p className="text-[#71767b] text-sm">{figure.handle}</p>
                </div>
              </div>
              <button className="px-4 py-1.5 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

/**
 * Simple Post Card Component (Placeholder for Member 2)
 */
function PostCard({ post, index }: { post: SocialPost; index: number }) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
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
              <CheckCircleOutlined className="text-[#1d9bf0] flex-shrink-0" style={{ fontSize: '18px' }} />
            )}
            <span className="text-[#71767b] truncate">
              {post.author.handle}
            </span>
            <span className="text-[#71767b]">·</span>
            <span className="text-[#71767b] hover:underline cursor-pointer">
              {post.timestamp}
            </span>
            <button className="ml-auto p-2 hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] rounded-full transition-colors">
              <MoreOutlined style={{ fontSize: '18px' }} />
            </button>
          </div>

          {/* Post type badge */}
          {post.type === 'news' && (
            <span className="inline-block px-2 py-0.5 mb-2 text-xs font-bold bg-red-500/20 text-red-400 rounded">
              BREAKING NEWS
            </span>
          )}
          {post.type === 'reply' && (
            <span className="inline-block text-[#71767b] text-sm mb-1">
              Replying to <span className="text-[#1d9bf0]">@historical_figure</span>
            </span>
          )}

          {/* Content */}
          <p className="text-[15px] leading-normal whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {/* Actions */}
          <div className="flex justify-between max-w-[425px] mt-3 -ml-2">
            <button className="flex items-center gap-1 group">
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                <MessageOutlined className="text-[#71767b] group-hover:text-[#1d9bf0]" style={{ fontSize: '18px' }} />
              </div>
              <span className="text-sm text-[#71767b] group-hover:text-[#1d9bf0]">
                {formatNumber(post.stats.replies)}
              </span>
            </button>

            <button className="flex items-center gap-1 group">
              <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                <SwapOutlined className="text-[#71767b] group-hover:text-green-500" style={{ fontSize: '18px' }} />
              </div>
              <span className="text-sm text-[#71767b] group-hover:text-green-500">
                {formatNumber(post.stats.retweets)}
              </span>
            </button>

            <button className="flex items-center gap-1 group">
              <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                <HeartOutlined className="text-[#71767b] group-hover:text-pink-500" style={{ fontSize: '18px' }} />
              </div>
              <span className="text-sm text-[#71767b] group-hover:text-pink-500">
                {formatNumber(post.stats.likes)}
              </span>
            </button>

            <button className="flex items-center gap-1 group">
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                <RiseOutlined className="text-[#71767b] group-hover:text-[#1d9bf0]" style={{ fontSize: '18px' }} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Loading Skeleton Component
 */
function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative">
        <ClockCircleOutlined className="text-[#1d9bf0] animate-pulse-glow" style={{ fontSize: '48px' }} />
        <ThunderboltOutlined className="text-purple-500 absolute -top-1 -right-1 animate-bounce" style={{ fontSize: '20px' }} />
      </div>
      <p className="text-xl font-medium text-[#71767b] animate-pulse">
        Generating History...
      </p>
      <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-[#1d9bf0] animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-[#1d9bf0] animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-[#1d9bf0] animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

/**
 * Error Display Component
 */
function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
        <span className="text-3xl">⚠️</span>
      </div>
      <p className="text-xl font-medium text-red-400">Something went wrong</p>
      <p className="text-[#71767b] max-w-sm">{message}</p>
    </div>
  );
}

/**
 * Empty State Component
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1d9bf0]/20 to-purple-500/20 flex items-center justify-center">
        <ClockCircleOutlined className="text-[#1d9bf0]" style={{ fontSize: '40px' }} />
      </div>
      <h2 className="text-2xl font-bold">Travel Through Time</h2>
      <p className="text-[#71767b] max-w-sm">
        Enter a historical topic above to see it reimagined as a social media feed. 
        Try &quot;Roman Empire&quot;, &quot;Space Race&quot;, or &quot;French Revolution&quot;.
      </p>
    </div>
  );
}

/**
 * Main Feed Component
 */
function MainFeed() {
  const [searchQuery, setSearchQuery] = useState('');
  const { state, generateFeed } = useFeedGenerator({ mockMode: true });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      generateFeed(searchQuery);
    }
  };

  return (
    <main className="flex-1 max-w-2xl border-r border-[#2f3336] min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/80 border-b border-[#2f3336]">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold">Home</h1>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="px-4 pb-3">
          <div className="relative">
            <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71767b]" style={{ fontSize: '20px' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search historical topics..."
              className="w-full bg-[#202327] rounded-full py-3 pl-12 pr-4 text-[15px] placeholder-[#71767b] focus:outline-none focus:ring-2 focus:ring-[#1d9bf0] focus:bg-black transition-colors"
            />
            <button
              type="submit"
              disabled={!searchQuery.trim() || state.status === 'loading'}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#1d9bf0] text-white rounded-full font-bold text-sm hover:bg-[#1a8cd8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ThunderboltOutlined className="inline-block mr-1" style={{ fontSize: '16px' }} />
              Generate
            </button>
          </div>
        </form>
      </header>

      {/* Feed Content */}
      <div>
        {state.status === 'idle' && <EmptyState />}
        
        {state.status === 'loading' && <LoadingSkeleton />}
        
        {state.status === 'error' && (
          <ErrorDisplay message={state.error || 'An unknown error occurred'} />
        )}
        
        {state.status === 'success' && (
          <div>
            {/* Results header */}
            <div className="px-4 py-3 border-b border-[#2f3336]">
              <p className="text-[#71767b] text-sm">
                Showing {state.data.length} historical posts
              </p>
            </div>
            
            {/* Posts */}
            {state.data.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

/**
 * Home Page
 */
export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePost = (content: string, photos: File[]) => {
    console.log('Posting:', { content, photos });
    // Here you would typically send the post to your backend
    // For now, we'll just log it
    alert(`Post created!\nContent: ${content || '(no text)'}\nPhotos: ${photos.length}`);
  };

  return (
    <>
      <div className="flex justify-center min-h-screen">
        {/* Left Sidebar - Hidden on smaller screens */}
        <div className="hidden md:block">
          <LeftSidebar onPostClick={() => setIsModalOpen(true)} />
        </div>

        {/* Main Feed */}
        <MainFeed />

        {/* Right Sidebar - Hidden on smaller screens */}
        <RightSidebar />
      </div>

      {/* Floating Post Button for Mobile */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
        aria-label="Create post"
      >
        <ThunderboltOutlined style={{ fontSize: '24px' }} />
      </button>

      {/* Photo Post Modal */}
      <PhotoPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPost={handlePost}
      />
    </>
  );
}
