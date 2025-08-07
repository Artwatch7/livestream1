function ViewerPanel({ room, onBackToHome }) {
  try {
    const [isLiked, setIsLiked] = React.useState(false);
    const [isFollowed, setIsFollowed] = React.useState(false);
    const [messages, setMessages] = React.useState(mockChatMessages);
    const [currentLikes, setCurrentLikes] = React.useState(room?.likes || 0);

    React.useEffect(() => {
      if (room) {
        setCurrentLikes(room.likes);
      }
    }, [room]);

    const handleLike = async () => {
      if (!room) return;
      
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      
      const newLikes = newLikedState ? currentLikes + 1 : currentLikes - 1;
      setCurrentLikes(newLikes);

      try {
        await trickleUpdateObject('live_room', room.id, {
          likes: newLikes
        });
      } catch (error) {
        console.error('Failed to update likes:', error);
        // 回滚状态
        setIsLiked(!newLikedState);
        setCurrentLikes(currentLikes);
      }
    };

    const handleFollow = () => {
      setIsFollowed(!isFollowed);
    };

    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    return (
      <div className="max-w-6xl mx-auto px-4" data-name="viewer-panel" data-file="components/ViewerPanel.js">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-4">
                <div className="text-center text-white">
                  <div className="icon-play text-6xl mb-4 text-gray-400"></div>
                  <p className="text-xl">直播画面</p>
                  <p className="text-sm text-gray-400 mt-2">主播正在直播中...</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={room?.streamer?.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"}
                    alt="主播头像"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{room?.streamer?.name || '主播'}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">1.2万 粉丝</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleLike}
                    className={`btn ${isLiked ? 'bg-[var(--warning-color)] text-white' : 'bg-gray-200 text-[var(--text-primary)]'}`}
                  >
                    <div className="icon-heart text-lg mr-2"></div>
                    {isLiked ? '已点赞' : '点赞'}
                  </button>
                  <button 
                    onClick={handleFollow}
                    className={`btn ${isFollowed ? 'bg-[var(--success-color)] text-white' : 'btn-primary'}`}
                  >
                    <div className="icon-plus text-lg mr-2"></div>
                    {isFollowed ? '已关注' : '关注'}
                  </button>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-2">{room?.title || '直播标题'}</h2>
              <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                <span className="flex items-center">
                  <div className="icon-users text-sm mr-1"></div>
                  {room?.viewers || '0'} 观看
                </span>
                <span className="flex items-center">
                  <div className="icon-heart text-sm mr-1"></div>
                  {currentLikes} 点赞
                </span>
                {room?.isLive && (
                  <span className="live-indicator">
                    <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                    直播中
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <ChatBox 
              messages={messages}
              onNewMessage={handleNewMessage}
              userRole="viewer"
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ViewerPanel component error:', error);
    return null;
  }
}