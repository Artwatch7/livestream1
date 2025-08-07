function StreamerPanel({ isLive, room, onStopStreaming, onUpdateRoom }) {
  try {
    const [streamTitle, setStreamTitle] = React.useState(room?.title || '我的直播间');
    const [viewers, setViewers] = React.useState(0);
    const [likes, setLikes] = React.useState(0);
    const [messages, setMessages] = React.useState([]);
    
    // 摄像头相关状态
    const [cameraStream, setCameraStream] = React.useState(null);
    const [cameraEnabled, setCameraEnabled] = React.useState(false);
    const [cameraDevices, setCameraDevices] = React.useState([]);
    const [currentDevice, setCurrentDevice] = React.useState('');
    const [cameraError, setCameraError] = React.useState('');
    const videoRef = React.useRef(null);

    React.useEffect(() => {
      if (room) {
        setStreamTitle(room.title);
        setViewers(parseInt(room.viewers.replace('k', '000').replace('.', '')) || 0);
        setLikes(room.likes || 0);
      }
    }, [room]);

    React.useEffect(() => {
      if (isLive && room) {
        const interval = setInterval(async () => {
          const newViewers = viewers + Math.floor(Math.random() * 3);
          const newLikes = likes + Math.floor(Math.random() * 5);
          
          setViewers(newViewers);
          setLikes(newLikes);

          // 更新数据库中的数据
          try {
            await trickleUpdateObject('live_room', room.id, {
              viewers: newViewers,
              likes: newLikes
            });
            
            // 更新本地房间数据
            onUpdateRoom(prev => ({
              ...prev,
              viewers: newViewers >= 1000 ? (newViewers / 1000).toFixed(1) + 'k' : newViewers.toString(),
              likes: newLikes
            }));
          } catch (error) {
            console.error('Failed to update room stats:', error);
          }
        }, 5000);

        return () => clearInterval(interval);
      }
    }, [isLive, room, viewers, likes]);

    // 初始化摄像头设备列表
    React.useEffect(() => {
      const initCameraDevices = async () => {
        const result = await getCameraDevices();
        if (result.success) {
          setCameraDevices(result.devices);
          if (result.devices.length > 0) {
            setCurrentDevice(result.devices[0].deviceId);
          }
        } else {
          console.error('Failed to get camera devices:', result.error);
        }
      };
      
      initCameraDevices();
    }, []);

    // 组件卸载时释放摄像头资源
    React.useEffect(() => {
      return () => {
        if (cameraStream) {
          stopCameraStream(cameraStream);
        }
      };
    }, [cameraStream]);

    // 摄像头开关控制
    const handleCameraToggle = async () => {
      if (cameraEnabled) {
        // 关闭摄像头
        if (cameraStream) {
          stopCameraStream(cameraStream);
          setCameraStream(null);
        }
        setCameraEnabled(false);
        setCameraError('');
      } else {
        // 开启摄像头
        setCameraError('');
        const result = await getCameraStream();
        
        if (result.success) {
          setCameraStream(result.stream);
          setCameraEnabled(true);
          
          // 绑定到video元素
          if (videoRef.current) {
            videoRef.current.srcObject = result.stream;
          }
        } else {
          setCameraError(result.error.message);
          setCameraEnabled(false);
        }
      }
    };

    // 切换摄像头设备
    const handleDeviceChange = async (deviceId) => {
      if (!cameraEnabled) return;
      
      // 停止当前流
      if (cameraStream) {
        stopCameraStream(cameraStream);
      }
      
      // 使用新设备获取流
      const result = await switchCamera(deviceId);
      
      if (result.success) {
        setCameraStream(result.stream);
        setCurrentDevice(deviceId);
        setCameraError('');
        
        // 绑定到video元素
        if (videoRef.current) {
          videoRef.current.srcObject = result.stream;
        }
      } else {
        setCameraError(result.error.message);
        setCameraEnabled(false);
      }
    };

    const handleTitleChange = async (newTitle) => {
      setStreamTitle(newTitle);
      if (room) {
        try {
          await trickleUpdateObject('live_room', room.id, {
            title: newTitle
          });
          onUpdateRoom(prev => ({ ...prev, title: newTitle }));
        } catch (error) {
          console.error('Failed to update room title:', error);
        }
      }
    };

    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    return (
      <div className="max-w-6xl mx-auto px-4" data-name="streamer-panel" data-file="components/StreamerPanel.js">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card mb-6">
              {/* 摄像头控制组件 */}
              <CameraControls 
                isEnabled={cameraEnabled}
                onToggle={handleCameraToggle}
                onDeviceChange={handleDeviceChange}
                devices={cameraDevices}
                currentDevice={currentDevice}
                error={cameraError}
              />
              
              {/* 摄像头画面区域 */}
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-4 relative overflow-hidden">
                {cameraEnabled && cameraStream ? (
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-white">
                    <div className="icon-video text-6xl mb-4 text-gray-400"></div>
                    <p className="text-xl">
                      {cameraError ? '摄像头错误' : '摄像头画面'}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      {cameraError ? cameraError : '点击上方按钮开启摄像头'}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <input 
                  type="text"
                  value={streamTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="input-field flex-1 mr-4"
                  placeholder="输入直播标题"
                />
                <button 
                  onClick={onStopStreaming}
                  className="btn bg-[var(--warning-color)] text-white hover:opacity-90"
                >
                  <div className="icon-square text-lg mr-2"></div>
                  结束直播
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="card text-center">
                <div className="icon-users text-3xl text-[var(--primary-color)] mb-2"></div>
                <p className="text-2xl font-bold">{viewers}</p>
                <p className="text-sm text-[var(--text-secondary)]">观看人数</p>
              </div>
              <div className="card text-center">
                <div className="icon-heart text-3xl text-[var(--warning-color)] mb-2"></div>
                <p className="text-2xl font-bold">{likes}</p>
                <p className="text-sm text-[var(--text-secondary)]">获得点赞</p>
              </div>
              <div className="card text-center">
                <div className="icon-message-circle text-3xl text-[var(--secondary-color)] mb-2"></div>
                <p className="text-2xl font-bold">{messages.length}</p>
                <p className="text-sm text-[var(--text-secondary)]">聊天消息</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <ChatBox 
              messages={messages}
              onNewMessage={handleNewMessage}
              userRole="streamer"
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('StreamerPanel component error:', error);
    return null;
  }
}