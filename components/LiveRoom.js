function LiveRoom({ rooms, onJoinRoom, loading }) {
  try {
    if (loading) {
      return (
        <div className="mb-8" data-name="live-rooms" data-file="components/LiveRoom.js">
          <h2 className="text-2xl font-bold mb-6 text-center">热门直播间</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="bg-gray-300 w-full h-48 rounded-lg mb-4"></div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="mb-8" data-name="live-rooms" data-file="components/LiveRoom.js">
        <h2 className="text-2xl font-bold mb-6 text-center">热门直播间</h2>
        
        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <div className="icon-video text-6xl text-gray-400 mb-4"></div>
            <p className="text-xl text-[var(--text-secondary)]">暂无直播间</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.filter(room => room.isLive).map(room => (
            <div key={room.id} className="card hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => onJoinRoom(room.id)}>
              <div className="relative mb-4">
                <img 
                  src={room.thumbnail} 
                  alt={room.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-3 left-3 live-indicator">
                  <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                  直播中
                </div>
                <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  <div className="icon-users text-sm mr-1"></div>
                  {room.viewers}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <img 
                  src={room.streamer.avatar} 
                  alt={room.streamer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">{room.title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm mb-2">{room.streamer.name}</p>
                  <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                    <span className="flex items-center">
                      <div className="icon-eye text-sm mr-1"></div>
                      {room.viewers} 观看
                    </span>
                    <span className="flex items-center">
                      <div className="icon-heart text-sm mr-1"></div>
                      {room.likes} 点赞
                    </span>
                  </div>
                </div>
              </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('LiveRoom component error:', error);
    return null;
  }
}