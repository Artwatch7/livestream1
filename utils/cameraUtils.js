// 摄像头工具函数
// 提供摄像头访问、控制和设备管理功能

// 默认摄像头约束配置
const DEFAULT_CONSTRAINTS = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 }
  },
  audio: false  // 仅视频，音频可后续添加
};

// 基础摄像头约束（降级选项）
const BASIC_CONSTRAINTS = {
  video: {
    width: { ideal: 640 },
    height: { ideal: 480 },
    frameRate: { ideal: 15 }
  },
  audio: false
};

// 获取摄像头流
window.getCameraStream = async function(constraints = DEFAULT_CONSTRAINTS) {
  try {
    // 检查浏览器支持
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('BROWSER_NOT_SUPPORTED');
    }

    // 尝试获取摄像头流
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      // 如果高质量约束失败，尝试基础约束
      if (error.name === 'OverconstrainedError' || error.name === 'NotReadableError') {
        console.warn('High quality constraints failed, trying basic constraints:', error);
        stream = await navigator.mediaDevices.getUserMedia(BASIC_CONSTRAINTS);
      } else {
        throw error;
      }
    }

    return {
      success: true,
      stream: stream,
      error: null
    };
  } catch (error) {
    console.error('Failed to get camera stream:', error);
    
    let errorType = 'UNKNOWN_ERROR';
    let errorMessage = '获取摄像头失败';
    
    switch (error.name) {
      case 'NotAllowedError':
        errorType = 'PERMISSION_DENIED';
        errorMessage = '摄像头权限被拒绝，请允许访问摄像头';
        break;
      case 'NotFoundError':
        errorType = 'NO_CAMERA';
        errorMessage = '未找到摄像头设备';
        break;
      case 'NotReadableError':
        errorType = 'CAMERA_BUSY';
        errorMessage = '摄像头被其他应用占用';
        break;
      case 'OverconstrainedError':
        errorType = 'CONSTRAINTS_ERROR';
        errorMessage = '摄像头不支持请求的配置';
        break;
      case 'SecurityError':
        errorType = 'SECURITY_ERROR';
        errorMessage = '安全限制，请使用HTTPS访问';
        break;
      default:
        if (error.message === 'BROWSER_NOT_SUPPORTED') {
          errorType = 'BROWSER_NOT_SUPPORTED';
          errorMessage = '浏览器不支持摄像头功能';
        }
        break;
    }
    
    return {
      success: false,
      stream: null,
      error: {
        type: errorType,
        message: errorMessage,
        originalError: error
      }
    };
  }
};

// 停止摄像头流
window.stopCameraStream = function(stream) {
  try {
    if (stream && stream.getTracks) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to stop camera stream:', error);
    return false;
  }
};

// 获取可用摄像头设备列表
window.getCameraDevices = async function() {
  try {
    // 检查浏览器支持
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      throw new Error('BROWSER_NOT_SUPPORTED');
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    return {
      success: true,
      devices: videoDevices.map(device => ({
        deviceId: device.deviceId,
        label: device.label || `摄像头 ${device.deviceId.slice(0, 8)}`,
        groupId: device.groupId
      })),
      error: null
    };
  } catch (error) {
    console.error('Failed to get camera devices:', error);
    
    return {
      success: false,
      devices: [],
      error: {
        type: 'DEVICE_ENUMERATION_FAILED',
        message: '获取摄像头设备列表失败',
        originalError: error
      }
    };
  }
};

// 切换摄像头设备
window.switchCamera = async function(deviceId, constraints = DEFAULT_CONSTRAINTS) {
  try {
    const deviceConstraints = {
      ...constraints,
      video: {
        ...constraints.video,
        deviceId: { exact: deviceId }
      }
    };
    
    return await getCameraStream(deviceConstraints);
  } catch (error) {
    console.error('Failed to switch camera:', error);
    
    return {
      success: false,
      stream: null,
      error: {
        type: 'SWITCH_CAMERA_FAILED',
        message: '切换摄像头失败',
        originalError: error
      }
    };
  }
};

// 检查摄像头权限状态
window.checkCameraPermission = async function() {
  try {
    if (!navigator.permissions) {
      return {
        success: false,
        permission: 'unknown',
        error: 'PERMISSIONS_API_NOT_SUPPORTED'
      };
    }
    
    const permission = await navigator.permissions.query({ name: 'camera' });
    
    return {
      success: true,
      permission: permission.state, // 'granted', 'denied', 'prompt'
      error: null
    };
  } catch (error) {
    console.error('Failed to check camera permission:', error);
    
    return {
      success: false,
      permission: 'unknown',
      error: error.message
    };
  }
};

// 初始化摄像头工具
function initializeCameraUtils() {
  console.log('Camera utilities initialized');
}

// 页面加载时初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCameraUtils);
} else {
  initializeCameraUtils();
}