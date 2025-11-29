'use client';

import { useState, useCallback } from 'react';
import type { FeedState, SocialPost } from '@/types';

/**
 * Configuration for the feed generator hook
 */
interface UseFeedGeneratorConfig {
  mockMode?: boolean;
  mockDelay?: number;
}

/**
 * Return type for the useFeedGenerator hook
 */
interface UseFeedGeneratorReturn {
  state: FeedState;
  generateFeed: (topic: string) => Promise<void>;
  loadAllPosts: () => Promise<void>;
  resetFeed: () => void;
}

/**
 * Mock Vietnamese historical data generator
 * Creates realistic-looking historical social media posts about Vietnam
 */
const generateMockPosts = (topic: string): SocialPost[] => {
  const mockData: Record<string, SocialPost[]> = {
    default: [
      {
        id: '1',
        author: {
          name: 'Vua Hùng Vương',
          handle: '@hungvuong',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=hungvuong',
          isVerified: true,
        },
        content: '🏔️ Vừa dựng nước Văn Lang xong! Con cháu nhớ giữ gìn bờ cõi. Ngày Giỗ Tổ đừng quên về nguồn nha.\n\n🇻🇳 Just founded Van Lang nation! Descendants, remember to protect our homeland. Don\'t forget Ancestral Death Anniversary.\n\n#VănLang #HùngVương #GiỗTổ',
        timestamp: 'Khoảng 2879 TCN',
        stats: { likes: 1000000, retweets: 500000, replies: 250000 },
        type: 'post',
      },
      {
        id: '2',
        author: {
          name: 'Hai Bà Trưng',
          handle: '@haibatrung',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=haibatrung',
          isVerified: true,
        },
        content: '⚔️ Giặc đến nhà, đàn bà cũng đánh! Vừa đuổi quân Đông Hán ra khỏi bờ cõi. Chị em phụ nữ Việt Nam mạnh mẽ lắm! 💪\n\n🇻🇳 When enemies invade, even women fight! Just drove the Eastern Han army out. Vietnamese women are strong!\n\n#HaiBàTrưng #NữTướng #ĐộcLập',
        timestamp: 'Năm 40',
        stats: { likes: 890000, retweets: 456000, replies: 234000 },
        type: 'post',
      },
      {
        id: '3',
        author: {
          name: 'Ngô Quyền',
          handle: '@ngoquyen938',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=ngoquyen',
          isVerified: true,
        },
        content: '🌊 Trận Bạch Đằng thắng lớn! Cắm cọc nhọn dưới sông, thủy triều rút - thuyền giặc tan tành. 1000 năm Bắc thuộc kết thúc!\n\n🇻🇳 Great victory at Bach Dang! Planted sharp stakes in river, tide receded - enemy ships destroyed. 1000 years of Chinese rule ended!\n\n#BạchĐằng #NgôQuyền #ĐộcLập938',
        timestamp: 'Năm 938',
        stats: { likes: 938000, retweets: 470000, replies: 280000 },
        type: 'news',
      },
      {
        id: '4',
        author: {
          name: 'Lý Thường Kiệt',
          handle: '@lythuongkiet',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=lythuongkiet',
          isVerified: true,
        },
        content: '📜 "Nam quốc sơn hà Nam đế cư\nTiệt nhiên định phận tại thiên thư"\n\nBản Tuyên ngôn Độc lập đầu tiên! Nước Nam là của người Nam! 🇻🇳\n\n🇬🇧 "Over the Southern mountains and rivers, the Southern Emperor resides" - Vietnam\'s first Declaration of Independence!\n\n#NamQuốcSơnHà #ĐộcLập',
        timestamp: 'Năm 1077',
        stats: { likes: 1077000, retweets: 540000, replies: 320000 },
        type: 'post',
      },
      {
        id: '5',
        author: {
          name: 'Trần Hưng Đạo',
          handle: '@tranhungdao',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=tranhungdao',
          isVerified: true,
        },
        content: '⚔️ "Ta thà làm quỷ nước Nam còn hơn làm vương đất Bắc!"\n\n3 lần đánh bại quân Nguyên Mông. Hịch tướng sĩ đã viết xong! Ai chưa đọc thì đọc đi! 📖\n\n🇬🇧 "I\'d rather be a demon in Vietnam than a king in the North!" Defeated Mongol army 3 times!\n\n#TrầnHưngĐạo #HịchTướngSĩ #ChốngNguyên',
        timestamp: 'Năm 1288',
        stats: { likes: 1288000, retweets: 645000, replies: 400000 },
        type: 'post',
      },
    ],
    'lê lợi': [
      {
        id: 'll1',
        author: {
          name: 'Lê Lợi',
          handle: '@leloi_lamson',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=leloi',
          isVerified: true,
        },
        content: '⚔️ Khởi nghĩa Lam Sơn bắt đầu! 10 năm kháng chiến chống quân Minh. Gian khổ nhưng quyết tâm giành độc lập!\n\n🇬🇧 Lam Son uprising begins! 10 years of resistance against Ming Dynasty. Hardship but determined for independence!\n\n#LamSơn #KhángChiến #LêLợi',
        timestamp: 'Năm 1418',
        stats: { likes: 567000, retweets: 234000, replies: 123000 },
        type: 'post',
      },
      {
        id: 'll2',
        author: {
          name: 'Nguyễn Trãi',
          handle: '@nguyentrai',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=nguyentrai',
          isVerified: true,
        },
        content: '📜 Vừa viết xong Bình Ngô Đại Cáo! Đây là bản Tuyên ngôn Độc lập hùng tráng nhất!\n\n"Việc nhân nghĩa cốt ở yên dân\nQuân điếu phạt trước lo trừ bạo"\n\n🇬🇧 Just finished the Great Proclamation of Victory! Vietnam\'s greatest Declaration of Independence!\n\n#BìnhNgôĐạiCáo #NguyễnTrãi',
        timestamp: 'Năm 1428',
        stats: { likes: 1428000, retweets: 715000, replies: 450000 },
        type: 'news',
      },
    ],
    'quang trung': [
      {
        id: 'qt1',
        author: {
          name: 'Quang Trung - Nguyễn Huệ',
          handle: '@quangtrung',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=quangtrung',
          isVerified: true,
        },
        content: '🔥 THẦN TỐC! Hành quân từ Phú Xuân ra Thăng Long chỉ trong 5 ngày! 29 vạn quân Thanh tan tành!\n\nTết Kỷ Dậu 1789 - Đại thắng Đống Đa! 🎆\n\n🇬🇧 LIGHTNING SPEED! Marched from Phu Xuan to Thang Long in just 5 days! 290,000 Qing soldiers defeated!\n\n#ĐốngĐa #QuangTrung #TâySơn',
        timestamp: 'Tết Kỷ Dậu, 1789',
        stats: { likes: 1789000, retweets: 895000, replies: 560000 },
        type: 'news',
      },
      {
        id: 'qt2',
        author: {
          name: 'Báo Lịch Sử VN',
          handle: '@lichsuvn_news',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=lichsuvn',
          isVerified: true,
        },
        content: '🚨 NÓNG: Vua Quang Trung đã tiến vào Thăng Long! Quân Thanh thua tan tác tại gò Đống Đa. Tướng Sầm Nghi Đống tử trận!\n\n🇬🇧 BREAKING: Emperor Quang Trung has entered Thang Long! Qing army utterly defeated at Dong Da. General Sam Nghi Dong killed in battle!\n\n#ĐạiThắng #MùngXuân1789',
        timestamp: 'Mùng 5 Tết, 1789',
        stats: { likes: 2340000, retweets: 1200000, replies: 780000 },
        type: 'news',
      },
    ],
    'điện biên phủ': [
      {
        id: 'dbp1',
        author: {
          name: 'Đại tướng Võ Nguyên Giáp',
          handle: '@vonguyengiap',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=giap',
          isVerified: true,
        },
        content: '🎖️ Chiến dịch Điện Biên Phủ kết thúc! 56 ngày đêm - Pháp đầu hàng!\n\n"Quyết chiến, quyết thắng!"\n\n🇬🇧 Dien Bien Phu Campaign ended! 56 days and nights - France surrendered! "Determined to fight, determined to win!"\n\n#ĐiệnBiênPhủ #7Tháng5 #ChiếnThắng1954',
        timestamp: '7 tháng 5, 1954',
        stats: { likes: 1954000, retweets: 980000, replies: 670000 },
        type: 'news',
      },
      {
        id: 'dbp2',
        author: {
          name: 'Chủ tịch Hồ Chí Minh',
          handle: '@hochiminh',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=hochiminh',
          isVerified: true,
        },
        content: '🇻🇳 "Không có gì quý hơn độc lập, tự do!"\n\nChiến thắng Điện Biên Phủ đã chấm dứt ách thống trị của thực dân Pháp. Đất nước ta đang bước vào kỷ nguyên mới!\n\n🇬🇧 "Nothing is more precious than independence and freedom!" Victory at Dien Bien Phu ended French colonial rule.\n\n#ĐộcLập #TựDo #HồChíMinh',
        timestamp: 'Năm 1954',
        stats: { likes: 2500000, retweets: 1250000, replies: 890000 },
        type: 'post',
      },
    ],
    'thống nhất': [
      {
        id: 'tn1',
        author: {
          name: 'Báo Lịch Sử VN',
          handle: '@lichsuvn_news',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=lichsuvn',
          isVerified: true,
        },
        content: '🚨 LỊCH SỬ: Xe tăng tiến vào Dinh Độc Lập! Miền Nam hoàn toàn giải phóng! Đất nước thống nhất sau 21 năm chia cắt!\n\n🇬🇧 HISTORIC: Tanks enter Independence Palace! South Vietnam completely liberated! Country reunified after 21 years of division!\n\n#30Tháng4 #ThốngNhất #GiảiPhóng1975',
        timestamp: '30 tháng 4, 1975',
        stats: { likes: 1975000, retweets: 990000, replies: 750000 },
        type: 'news',
      },
      {
        id: 'tn2',
        author: {
          name: 'Nhân Dân Việt Nam',
          handle: '@nhandanvn',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=nhandan',
          isVerified: true,
        },
        content: '🎉 Hòa bình! Độc lập! Thống nhất!\n\nSau bao năm chiến tranh, đất nước ta cuối cùng đã được hòa bình. Bắc - Nam sum họp một nhà! 🇻🇳\n\n🇬🇧 Peace! Independence! Reunification! After years of war, our country is finally at peace. North and South reunited!\n\n#ViệtNam #HòaBình #ThốngNhất',
        timestamp: '30 tháng 4, 1975',
        stats: { likes: 3000000, retweets: 1500000, replies: 1000000 },
        type: 'post',
      },
    ],
    'đổi mới': [
      {
        id: 'dm1',
        author: {
          name: 'Đảng Cộng sản VN',
          handle: '@dcs_vietnam',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=dcsvn',
          isVerified: true,
        },
        content: '📈 Chính sách Đổi Mới chính thức bắt đầu! Chuyển đổi sang kinh tế thị trường định hướng XHCN.\n\n🇬🇧 Doi Moi policy officially begins! Transition to socialist-oriented market economy.\n\n#ĐổiMới #1986 #KinhTế',
        timestamp: 'Năm 1986',
        stats: { likes: 1986000, retweets: 895000, replies: 567000 },
        type: 'news',
      },
    ],
    'văn hóa': [
      {
        id: 'vh1',
        author: {
          name: 'UNESCO Vietnam',
          handle: '@unesco_vn',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=unesco',
          isVerified: true,
        },
        content: '🏛️ Vịnh Hạ Long được công nhận là Di sản Thiên nhiên Thế giới!\n\nVẻ đẹp hùng vĩ của hàng ngàn hòn đảo đá vôi đã chinh phục thế giới! 🌊\n\n🇬🇧 Ha Long Bay recognized as World Natural Heritage! The magnificent beauty of thousands of limestone islands has conquered the world!\n\n#HạLong #UNESCO #DiSản',
        timestamp: 'Năm 1994',
        stats: { likes: 2340000, retweets: 1200000, replies: 890000 },
        type: 'news',
      },
      {
        id: 'vh2',
        author: {
          name: 'Áo Dài Việt Nam',
          handle: '@aodai_vn',
          avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=aodai',
          isVerified: true,
        },
        content: '👗 Áo dài - biểu tượng văn hóa Việt Nam! Từ thời chúa Nguyễn Phúc Khoát đến nay vẫn luôn kiêu sa, thanh lịch.\n\n🇬🇧 Ao Dai - Vietnam\'s cultural symbol! From Lord Nguyen Phuc Khoat\'s era to now, always elegant and graceful.\n\n#ÁoDài #VănHóaViệt #TruyềnThống',
        timestamp: 'Thế kỷ 18 - Nay',
        stats: { likes: 1800000, retweets: 900000, replies: 560000 },
        type: 'post',
      },
    ],
  };

  // Find matching topic or return default
  const lowerTopic = topic.toLowerCase();
  
  // Check for keyword matches
  if (lowerTopic.includes('lê lợi') || lowerTopic.includes('le loi') || lowerTopic.includes('lam sơn') || lowerTopic.includes('nguyễn trãi')) {
    return mockData['lê lợi'];
  }
  if (lowerTopic.includes('quang trung') || lowerTopic.includes('tây sơn') || lowerTopic.includes('đống đa') || lowerTopic.includes('nguyễn huệ')) {
    return mockData['quang trung'];
  }
  if (lowerTopic.includes('điện biên') || lowerTopic.includes('dien bien') || lowerTopic.includes('võ nguyên giáp') || lowerTopic.includes('1954')) {
    return mockData['điện biên phủ'];
  }
  if (lowerTopic.includes('thống nhất') || lowerTopic.includes('30/4') || lowerTopic.includes('1975') || lowerTopic.includes('giải phóng')) {
    return mockData['thống nhất'];
  }
  if (lowerTopic.includes('đổi mới') || lowerTopic.includes('doi moi') || lowerTopic.includes('1986')) {
    return mockData['đổi mới'];
  }
  if (lowerTopic.includes('văn hóa') || lowerTopic.includes('hạ long') || lowerTopic.includes('áo dài') || lowerTopic.includes('unesco') || lowerTopic.includes('culture')) {
    return mockData['văn hóa'];
  }

  return mockData.default;
};

/**
 * Custom hook for generating Vietnamese historical social media feeds
 * 
 * @param config - Configuration options for the hook
 * @returns Feed state and control functions
 * 
 * @example
 * ```tsx
 * const { state, generateFeed, resetFeed } = useFeedGenerator({ mockMode: true });
 * 
 * // Generate feed for a topic
 * await generateFeed('Điện Biên Phủ');
 * 
 * // Access the state
 * if (state.status === 'success') {
 *   console.log(state.data);
 * }
 * ```
 */
export function useFeedGenerator(config: UseFeedGeneratorConfig = {}): UseFeedGeneratorReturn {
  const { mockMode = true, mockDelay = 1500 } = config;

  const [state, setState] = useState<FeedState>({
    status: 'idle',
    data: [],
    error: null,
  });

  /**
   * Generate feed posts for a given topic
   */
  const generateFeed = useCallback(async (topic: string): Promise<void> => {
    if (!topic.trim()) {
      setState({
        status: 'error',
        data: [],
        error: 'Vui lòng nhập chủ đề để khám phá / Please enter a topic to explore',
      });
      return;
    }

    // Set loading state
    setState({
      status: 'loading',
      data: [],
      error: null,
    });

    try {
      if (mockMode) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, mockDelay));
        
        const mockPosts = generateMockPosts(topic);
        
        setState({
          status: 'success',
          data: mockPosts,
          error: null,
        });
      } else {
        // Fetch from database API
        const response = await fetch(`/api/posts?search=${encodeURIComponent(topic)}&limit=20`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data.length > 0) {
          setState({
            status: 'success',
            data: result.data,
            error: null,
          });
        } else {
          // Fallback to mock data if no results from database
          const mockPosts = generateMockPosts(topic);
          setState({
            status: 'success',
            data: mockPosts,
            error: null,
          });
        }
      }
    } catch (error) {
      setState({
        status: 'error',
        data: [],
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi / An unexpected error occurred',
      });
    }
  }, [mockMode, mockDelay]);

  /**
   * Load all posts from database (no search filter)
   */
  const loadAllPosts = useCallback(async (): Promise<void> => {
    setState({
      status: 'loading',
      data: [],
      error: null,
    });

    try {
      const response = await fetch('/api/posts?limit=50&sortBy=likes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data.length > 0) {
        setState({
          status: 'success',
          data: result.data,
          error: null,
        });
      } else {
        // No posts in database, show empty state
        setState({
          status: 'idle',
          data: [],
          error: null,
        });
      }
    } catch (error) {
      console.error('Load posts error:', error);
      // Fallback to default mock data
      const mockPosts = generateMockPosts('default');
      setState({
        status: 'success',
        data: mockPosts,
        error: null,
      });
    }
  }, []);

  /**
   * Reset the feed to initial state
   */
  const resetFeed = useCallback((): void => {
    setState({
      status: 'idle',
      data: [],
      error: null,
    });
  }, []);

  return {
    state,
    generateFeed,
    loadAllPosts,
    resetFeed,
  };
}

export default useFeedGenerator;
