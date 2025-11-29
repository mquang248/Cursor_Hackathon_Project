'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import {
  CloseOutlined,
  PictureOutlined,
  SmileOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  FileTextOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

interface PhotoPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (content: string, photos: File[]) => void;
}

export default function PhotoPostModal({
  isOpen,
  onClose,
  onPost,
}: PhotoPostModalProps) {
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock user data
  const user = {
    name: 'Minh Việt',
    handle: '@MinhVit69491436',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MinhViet',
  };

  const handlePhotoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPhotos = [...photos, ...files].slice(0, 4); // Max 4 photos
    setPhotos(newPhotos);

    // Create previews
    const newPreviews = newPhotos.map((file) => URL.createObjectURL(file));
    setPhotoPreviews(newPreviews);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    
    // Revoke old URL
    URL.revokeObjectURL(photoPreviews[index]);
    
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  };

  const handlePost = () => {
    if (content.trim() || photos.length > 0) {
      onPost(content, photos);
      // Reset form
      setContent('');
      setPhotos([]);
      photoPreviews.forEach((url) => URL.revokeObjectURL(url));
      setPhotoPreviews([]);
      onClose();
    }
  };

  const handleClose = () => {
    // Clean up preview URLs
    photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    setContent('');
    setPhotos([]);
    setPhotoPreviews([]);
    onClose();
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const canPost = content.trim().length > 0 || photos.length > 0;
  const characterCount = content.length;
  const maxCharacters = 280;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-[600px] bg-black rounded-2xl shadow-2xl border border-[#2f3336] max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2f3336]">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[#16181c] rounded-full transition-colors"
            aria-label="Close"
          >
            <CloseOutlined style={{ fontSize: '20px' }} />
          </button>
          <button className="text-[#1d9bf0] hover:underline text-sm font-medium">
            <FileTextOutlined className="inline-block mr-1" style={{ fontSize: '16px' }} />
            Drafts
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex gap-3 p-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Text Input */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleTextareaChange}
                placeholder="What's happening?"
                className="w-full bg-transparent text-xl placeholder-[#71767b] resize-none focus:outline-none min-h-[120px]"
                rows={4}
                maxLength={maxCharacters}
              />

              {/* Photo Previews */}
              {photoPreviews.length > 0 && (
                <div
                  className={`mt-4 grid gap-2 ${
                    photoPreviews.length === 1
                      ? 'grid-cols-1'
                      : photoPreviews.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-2'
                  }`}
                >
                  {photoPreviews.map((preview, index) => (
                    <div
                      key={index}
                      className={`relative ${
                        photoPreviews.length === 1
                          ? 'aspect-video'
                          : photoPreviews.length === 3 && index === 0
                          ? 'row-span-2 aspect-square'
                          : 'aspect-square'
                      } rounded-2xl overflow-hidden border border-[#2f3336]`}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 left-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
                        aria-label="Remove photo"
                      >
                        <CloseCircleOutlined className="text-white" style={{ fontSize: '20px' }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Settings */}
              <div className="mt-4 flex items-center gap-2 text-[#1d9bf0] text-sm">
                <GlobalOutlined style={{ fontSize: '16px' }} />
                <span>Everyone can reply</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Action Icons */}
        <div className="px-4 py-3 border-t border-[#2f3336]">
          <div className="flex items-center justify-between">
            {/* Left Icons */}
            <div className="flex items-center gap-4">
              {/* Photo Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full transition-colors"
                aria-label="Add photos"
                disabled={photos.length >= 4}
              >
                <PictureOutlined style={{ fontSize: '20px' }} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoSelect}
                className="hidden"
              />

              {/* GIF (placeholder) */}
              <button
                className="p-2 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full transition-colors opacity-50 cursor-not-allowed"
                aria-label="Add GIF"
                disabled
              >
                <span className="text-xs font-bold">GIF</span>
              </button>

              {/* Poll (placeholder) */}
              <button
                className="p-2 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full transition-colors opacity-50 cursor-not-allowed"
                aria-label="Add poll"
                disabled
              >
                <span className="text-xs">📊</span>
              </button>

              {/* Emoji */}
              <button
                className="p-2 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full transition-colors opacity-50 cursor-not-allowed"
                aria-label="Add emoji"
                disabled
              >
                <SmileOutlined style={{ fontSize: '20px' }} />
              </button>

              {/* Schedule */}
              <button
                className="p-2 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full transition-colors opacity-50 cursor-not-allowed"
                aria-label="Schedule post"
                disabled
              >
                <CalendarOutlined style={{ fontSize: '20px' }} />
              </button>

              {/* Location */}
              <button
                className="p-2 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full transition-colors opacity-50 cursor-not-allowed"
                aria-label="Add location"
                disabled
              >
                <EnvironmentOutlined style={{ fontSize: '20px' }} />
              </button>
            </div>

            {/* Right - Character Count & Post Button */}
            <div className="flex items-center gap-4">
              {content.length > 0 && (
                <div
                  className={`text-sm ${
                    characterCount > maxCharacters * 0.9
                      ? characterCount >= maxCharacters
                        ? 'text-red-500'
                        : 'text-yellow-500'
                      : 'text-[#71767b]'
                  }`}
                >
                  {maxCharacters - characterCount}
                </div>
              )}
              <button
                onClick={handlePost}
                disabled={!canPost}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${
                  canPost
                    ? 'bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white'
                    : 'bg-[#1d9bf0]/50 text-white/50 cursor-not-allowed'
                }`}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

