// 模拟直播间数据
const mockLiveRooms = [
  {
    id: 1,
    title: '今天教大家做经典川菜回锅肉！',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    streamer: {
      name: '美食探索家',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    viewers: '2.3k',
    likes: 856,
    isLive: true
  },
  {
    id: 2,
    title: '深夜游戏时光 - 王者荣耀上分之路',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    streamer: {
      name: '游戏大神',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    viewers: '1.8k',
    likes: 642,
    isLive: true
  },
  {
    id: 3,
    title: '吉他弹唱 - 民谣之夜',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    streamer: {
      name: '音乐诗人',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    viewers: '956',
    likes: 234,
    isLive: true
  },
  {
    id: 4,
    title: '健身教练带你燃脂训练',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    streamer: {
      name: '健身达人',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=100&h=100&fit=crop&crop=face'
    },
    viewers: '1.2k',
    likes: 445,
    isLive: true
  },
  {
    id: 5,
    title: '手工制作 - 折纸艺术分享',
    thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    streamer: {
      name: '手工艺人',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    viewers: '687',
    likes: 156,
    isLive: true
  },
  {
    id: 6,
    title: '旅行分享 - 云南大理游记',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    streamer: {
      name: '旅行者',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    },
    viewers: '834',
    likes: 298,
    isLive: true
  }
];

// 模拟聊天消息数据
const mockChatMessages = [
  {
    id: 1,
    user: {
      name: '美食探索家',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    content: '大家好！欢迎来到我的直播间！',
    timestamp: '19:30',
    isStreamer: true
  },
  {
    id: 2,
    user: {
      name: '观众123',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
    },
    content: '哇，看起来好香啊！',
    timestamp: '19:31',
    isStreamer: false
  },
  {
    id: 3,
    user: {
      name: '美食爱好者',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face'
    },
    content: '主播能教一下刀工吗？',
    timestamp: '19:32',
    isStreamer: false
  },
  {
    id: 4,
    user: {
      name: '观众456',
      avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=100&h=100&fit=crop&crop=face'
    },
    content: '点赞点赞！👍',
    timestamp: '19:33',
    isStreamer: false
  }
];
