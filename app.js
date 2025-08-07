class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-black"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [currentView, setCurrentView] = React.useState('home');
    const [userRole, setUserRole] = React.useState('viewer');
    const [isLive, setIsLive] = React.useState(false);
    const [liveRooms, setLiveRooms] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedRoom, setSelectedRoom] = React.useState(null);

    // 从数据库加载直播间数据
    React.useEffect(() => {
      loadLiveRooms();
    }, []);

    const loadLiveRooms = async () => {
      try {
        setLoading(true);
        const result = await trickleListObjects('live_room', {
          where: { is_live: true },
          orderBy: 'created_at DESC',
          limit: 20
        });
        const rooms = result.objects.map(item => ({
          id: item.objectId,
          title: item.objectData.title,
          thumbnail: item.objectData.thumbnail,
          streamer: {
            name: item.objectData.streamer_name,
            avatar: item.objectData.streamer_avatar
          },
          viewers: formatViewerCount(item.objectData.viewers),
          likes: item.objectData.likes,
          isLive: item.objectData.is_live,
          category: item.objectData.category,
          startTime: item.objectData.start_time
        }));
        setLiveRooms(rooms);
      } catch (error) {
        console.error('Failed to load live rooms:', error);
        // 如果数据库加载失败，使用备用数据
        setLiveRooms(mockLiveRooms);
      } finally {
        setLoading(false);
      }
    };

    const formatViewerCount = (count) => {
      if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k';
      }
      return count.toString();
    };

    const handleStartStreaming = async () => {
      try {
        // 创建新的直播间
        const newRoom = await trickleCreateObject('live_room', {
          title: '我的直播间',
          thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
          streamer_name: '新主播',
          streamer_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
          viewers: 0,
          likes: 0,
          is_live: true,
          category: '其他',
          start_time: new Date().toISOString()
        });

        setSelectedRoom({
          id: newRoom.objectId,
          title: newRoom.objectData.title,
          thumbnail: newRoom.objectData.thumbnail,
          streamer: {
            name: newRoom.objectData.streamer_name,
            avatar: newRoom.objectData.streamer_avatar
          },
          viewers: formatViewerCount(newRoom.objectData.viewers),
          likes: newRoom.objectData.likes,
          isLive: newRoom.objectData.is_live,
          category: newRoom.objectData.category
        });

        setUserRole('streamer');
        setCurrentView('streaming');
        setIsLive(true);
      } catch (error) {
        console.error('Failed to create live room:', error);
        // 降级到原有逻辑
        const fallbackRoom = {
          id: 'fallback-' + Date.now(),
          title: '我的直播间',
          thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
          streamer: {
            name: '新主播',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
          },
          viewers: '0',
          likes: 0,
          isLive: true,
          category: '其他'
        };
        
        setSelectedRoom(fallbackRoom);
        setUserRole('streamer');
        setCurrentView('streaming');
        setIsLive(true);
      }
    };



    const handleJoinRoom = (roomId) => {
      const room = liveRooms.find(r => r.id === roomId);
      setSelectedRoom(room);
      setCurrentView('viewing');
      setUserRole('viewer');
    };

    const handleBackToHome = async () => {
      if (isLive && selectedRoom && userRole === 'streamer') {
        try {
          // 结束直播时更新数据库
          await trickleUpdateObject('live_room', selectedRoom.id, {
            is_live: false
          });
        } catch (error) {
          console.error('Failed to update live status:', error);
        }
      }
      setCurrentView('home');
      setIsLive(false);
      setSelectedRoom(null);
      // 重新加载直播间列表
      loadLiveRooms();
    };

    const renderContent = () => {
      switch(currentView) {
        case 'streaming':
          return (
            <StreamerPanel 
              isLive={isLive}
              room={selectedRoom}
              onStopStreaming={handleBackToHome}
              onUpdateRoom={setSelectedRoom}
            />
          );
        case 'viewing':
          return (
            <ViewerPanel 
              room={selectedRoom}
              onBackToHome={handleBackToHome}
            />
          );
        default:
          return (
            <div className="max-w-6xl mx-auto px-4" data-name="home-content" data-file="app.js">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 text-shadow">欢迎来到直播小程序</h1>
                <p className="text-xl text-[var(--text-secondary)] mb-8">开始您的直播之旅，与观众实时互动</p>
                
                <div className="flex justify-center gap-4 mb-12">
                  <button 
                    onClick={handleStartStreaming}
                    className="btn btn-primary text-lg px-8 py-3"
                    disabled={loading}
                  >
                    <div className="icon-video text-xl mr-2"></div>
                    {loading ? '加载中...' : '开始直播'}
                  </button>
                </div>
              </div>

              <LiveRoom 
                rooms={liveRooms}
                onJoinRoom={handleJoinRoom}
                loading={loading}
              />
            </div>
          );
      }
    };

    return (
      <div className="min-h-screen" data-name="app" data-file="app.js">
        <Header 
          currentView={currentView}
          userRole={userRole}
          onBackToHome={handleBackToHome}
        />
        <main className="pt-20 pb-8">
          {renderContent()}
        </main>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);