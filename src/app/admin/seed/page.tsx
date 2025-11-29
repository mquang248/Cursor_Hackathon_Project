'use client';

import { useState } from 'react';
import {
  DatabaseOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  ReloadOutlined,
  HomeOutlined,
  FileTextOutlined,
  FolderOutlined,
} from '@ant-design/icons';

export default function SeedPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState<{ count: number; topics: string[] } | null>(null);

  const seedDatabase = async () => {
    setStatus('loading');
    setMessage('Đang đẩy dữ liệu vào MongoDB...');

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server trả về lỗi. Vui lòng kiểm tra console và restart server.');
      }

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setStats(result.data);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Đã xảy ra lỗi');
      console.error('Seed error:', error);
    }
  };

  const checkStatus = async () => {
    setStatus('loading');
    setMessage('Đang kiểm tra database...');

    try {
      const response = await fetch('/api/seed');
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server trả về lỗi. Vui lòng restart server (npm run dev)');
      }

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setMessage(result.data.message);
        setStats({ count: result.data.totalPosts, topics: result.data.topics });
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Đã xảy ra lỗi');
      console.error('Check status error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#da251d]/20 to-[#ffcd00]/20 flex items-center justify-center">
            <DatabaseOutlined className="text-4xl text-[#da251d]" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#da251d] to-[#ffcd00] bg-clip-text text-transparent">
            Database Seed
          </h1>
          <p className="text-[#71767b] mt-2">
            Đẩy dữ liệu lịch sử Việt Nam vào MongoDB
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={seedDatabase}
            disabled={status === 'loading'}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#da251d] to-[#ff6b35] rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {status === 'loading' ? (
              <LoadingOutlined className="text-xl animate-spin" />
            ) : (
              <DatabaseOutlined className="text-xl" />
            )}
            Seed Database
          </button>

          <button
            onClick={checkStatus}
            disabled={status === 'loading'}
            className="w-full py-4 px-6 bg-[#16181c] border border-[#2f3336] rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#1d1f23] disabled:opacity-50 transition-all"
          >
            <ReloadOutlined className={`text-xl ${status === 'loading' ? 'animate-spin' : ''}`} />
            Kiểm tra trạng thái
          </button>
        </div>

        {/* Status */}
        {status !== 'idle' && (
          <div className={`mt-6 p-4 rounded-xl ${
            status === 'success' ? 'bg-green-500/10 border border-green-500/20' :
            status === 'error' ? 'bg-red-500/10 border border-red-500/20' :
            'bg-blue-500/10 border border-blue-500/20'
          }`}>
            <div className="flex items-start gap-3">
              {status === 'success' && <CheckCircleOutlined className="text-xl text-green-500 flex-shrink-0" />}
              {status === 'error' && <CloseCircleOutlined className="text-xl text-red-500 flex-shrink-0" />}
              {status === 'loading' && <LoadingOutlined className="text-xl text-blue-500 flex-shrink-0 animate-spin" />}
              
              <div>
                <p className={`font-medium ${
                  status === 'success' ? 'text-green-400' :
                  status === 'error' ? 'text-red-400' :
                  'text-blue-400'
                }`}>
                  {message}
                </p>
                
                {stats && (
                  <div className="mt-3 space-y-2">
                    <p className="text-[#71767b] flex items-center gap-2">
                      <FileTextOutlined />
                      Số bài viết: <span className="text-white font-bold">{stats.count}</span>
                    </p>
                    <div>
                      <p className="text-[#71767b] mb-1 flex items-center gap-2">
                        <FolderOutlined />
                        Chủ đề:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {stats.topics.map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-1 bg-[#2f3336] rounded-full text-xs"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-[#16181c] rounded-xl border border-[#2f3336]">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <FileTextOutlined />
            Hướng dẫn / Instructions:
          </h3>
          <ol className="text-[#71767b] text-sm space-y-1 list-decimal list-inside">
            <li>Đảm bảo server đang chạy (npm run dev)</li>
            <li>Nhấn &quot;Seed Database&quot; để đẩy dữ liệu</li>
            <li>Đợi kết nối MongoDB hoàn tất</li>
            <li>Nếu lỗi, restart server và thử lại</li>
          </ol>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-[#da251d] hover:underline inline-flex items-center gap-2"
          >
            <HomeOutlined />
            Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
