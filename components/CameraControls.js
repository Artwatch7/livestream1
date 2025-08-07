function CameraControls({ 
  isEnabled, 
  onToggle, 
  onDeviceChange, 
  devices, 
  currentDevice, 
  error 
}) {
  try {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleToggle = async () => {
      setIsLoading(true);
      try {
        await onToggle();
      } finally {
        setIsLoading(false);
      }
    };

    const handleDeviceSelect = (event) => {
      const deviceId = event.target.value;
      if (deviceId !== currentDevice) {
        onDeviceChange(deviceId);
      }
    };

    return (
      <div className="camera-controls flex items-center gap-3 mb-4" data-name="camera-controls" data-file="components/CameraControls.js">
        {/* 摄像头开关按钮 */}
        <button 
          onClick={handleToggle}
          disabled={isLoading}
          className={`btn ${
            isEnabled 
              ? 'bg-[var(--success-color)] text-white' 
              : 'bg-gray-200 text-[var(--text-primary)]'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className={`${
            isEnabled ? 'icon-video' : 'icon-video-off'
          } text-lg mr-2`}></div>
          {isLoading ? '处理中...' : (isEnabled ? '关闭摄像头' : '开启摄像头')}
        </button>

        {/* 设备选择下拉菜单 */}
        {devices && devices.length > 1 && (
          <select 
            value={currentDevice || ''}
            onChange={handleDeviceSelect}
            disabled={!isEnabled || isLoading}
            className="input-field min-w-[150px]"
          >
            <option value="">选择摄像头</option>
            {devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        )}

        {/* 状态指示器 */}
        <div className="flex items-center gap-2">
          {isEnabled && (
            <div className="flex items-center text-sm text-[var(--success-color)]">
              <div className="w-2 h-2 bg-[var(--success-color)] rounded-full mr-1 animate-pulse"></div>
              摄像头已开启
            </div>
          )}
          
          {!isEnabled && !error && (
            <div className="flex items-center text-sm text-[var(--text-secondary)]">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
              摄像头已关闭
            </div>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="flex items-center text-sm text-[var(--warning-color)]">
            <div className="icon-alert-circle text-sm mr-1"></div>
            <span className="max-w-[200px] truncate" title={error}>
              {error}
            </span>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('CameraControls component error:', error);
    return (
      <div className="camera-controls-error text-[var(--warning-color)] text-sm">
        摄像头控制组件出错
      </div>
    );
  }
}