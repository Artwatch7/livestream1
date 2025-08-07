function CompatibilityAlert({ show, onClose, browserInfo, errorType }) {
  try {
    if (!show) return null;

    const getAlertContent = () => {
      if (errorType === 'BROWSER_NOT_SUPPORTED') {
        return {
          title: '浏览器不支持',
          message: '您的浏览器不支持摄像头功能，请使用Chrome、Firefox、Safari或Edge浏览器。',
          type: 'error'
        };
      }

      if (browserInfo?.isIOS && browserInfo?.isSafari) {
        return {
          title: 'iOS Safari 提示',
          message: '为了获得最佳体验，建议在Safari中开启摄像头权限，或使用Chrome浏览器。',
          type: 'warning'
        };
      }

      if (browserInfo?.isMobile) {
        return {
          title: '移动端优化',
          message: '已为您的移动设备优化视频质量，如遇问题请尝试刷新页面。',
          type: 'info'
        };
      }

      return {
        title: '兼容性提示',
        message: '检测到可能的兼容性问题，已自动调整设置以确保最佳体验。',
        type: 'info'
      };
    };

    const { title, message, type } = getAlertContent();

    const getTypeStyles = () => {
      switch (type) {
        case 'error':
          return 'bg-red-50 border-red-200 text-red-800';
        case 'warning':
          return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        case 'info':
        default:
          return 'bg-blue-50 border-blue-200 text-blue-800';
      }
    };

    const getIconClass = () => {
      switch (type) {
        case 'error':
          return 'icon-alert-circle text-red-500';
        case 'warning':
          return 'icon-alert-triangle text-yellow-500';
        case 'info':
        default:
          return 'icon-info text-blue-500';
      }
    };

    return (
      <div className={`fixed top-4 right-4 max-w-sm p-4 rounded-lg border ${getTypeStyles()} shadow-lg z-50`} data-name="compatibility-alert" data-file="components/CompatibilityAlert.js">
        <div className="flex items-start gap-3">
          <div className={`${getIconClass()} text-lg mt-0.5 flex-shrink-0`}></div>
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1">{title}</h4>
            <p className="text-sm opacity-90">{message}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <div className="icon-x text-sm"></div>
          </button>
        </div>
        
        {/* 调试信息 (仅开发环境) */}
        {process?.env?.NODE_ENV === 'development' && browserInfo && (
          <div className="mt-3 pt-3 border-t border-current opacity-50">
            <details className="text-xs">
              <summary className="cursor-pointer">浏览器信息</summary>
              <div className="mt-1 space-y-1">
                <div>移动端: {browserInfo.isMobile ? '是' : '否'}</div>
                <div>iOS: {browserInfo.isIOS ? '是' : '否'}</div>
                <div>Safari: {browserInfo.isSafari ? '是' : '否'}</div>
                <div>Chrome: {browserInfo.isChrome ? '是' : '否'}</div>
              </div>
            </details>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('CompatibilityAlert component error:', error);
    return null;
  }
}