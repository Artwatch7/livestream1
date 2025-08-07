// 模拟Trickle数据库API
// 提供本地存储和数据操作功能

// 本地存储键名
const STORAGE_KEYS = {
  LIVE_ROOMS: 'trickle_live_rooms',
  NEXT_ID: 'trickle_next_id'
};

// 获取下一个可用ID
function getNextId() {
  const nextId = localStorage.getItem(STORAGE_KEYS.NEXT_ID) || '1';
  const id = parseInt(nextId);
  localStorage.setItem(STORAGE_KEYS.NEXT_ID, (id + 1).toString());
  return id.toString();
}

// 获取所有直播间数据
function getAllLiveRooms() {
  const stored = localStorage.getItem(STORAGE_KEYS.LIVE_ROOMS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse stored live rooms:', error);
    }
  }
  return {};
}

// 保存所有直播间数据
function saveAllLiveRooms(rooms) {
  try {
    localStorage.setItem(STORAGE_KEYS.LIVE_ROOMS, JSON.stringify(rooms));
    return true;
  } catch (error) {
    console.error('Failed to save live rooms:', error);
    return false;
  }
}

// 模拟trickleCreateObject函数
window.trickleCreateObject = async function(objectType, objectData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (objectType !== 'live_room') {
          reject(new Error(`Unsupported object type: ${objectType}`));
          return;
        }

        const objectId = getNextId();
        const rooms = getAllLiveRooms();
        
        const newRoom = {
          objectId: objectId,
          objectData: {
            ...objectData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        };

        rooms[objectId] = newRoom;
        
        if (saveAllLiveRooms(rooms)) {
          resolve(newRoom);
        } else {
          reject(new Error('Failed to save new room'));
        }
      } catch (error) {
        reject(error);
      }
    }, 100); // 模拟网络延迟
  });
};

// 模拟trickleUpdateObject函数
window.trickleUpdateObject = async function(objectType, objectId, updateData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (objectType !== 'live_room') {
          reject(new Error(`Unsupported object type: ${objectType}`));
          return;
        }

        const rooms = getAllLiveRooms();
        const room = rooms[objectId];
        
        if (!room) {
          reject(new Error(`Room with id ${objectId} not found`));
          return;
        }

        // 更新房间数据
        room.objectData = {
          ...room.objectData,
          ...updateData,
          updated_at: new Date().toISOString()
        };

        rooms[objectId] = room;
        
        if (saveAllLiveRooms(rooms)) {
          resolve(room);
        } else {
          reject(new Error('Failed to update room'));
        }
      } catch (error) {
        reject(error);
      }
    }, 50); // 模拟网络延迟
  });
};

// 模拟trickleListObjects函数
window.trickleListObjects = async function(objectType, options = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (objectType !== 'live_room') {
          reject(new Error(`Unsupported object type: ${objectType}`));
          return;
        }

        const rooms = getAllLiveRooms();
        const roomList = Object.values(rooms);
        
        // 应用过滤条件
        let filteredRooms = roomList;
        if (options.where) {
          filteredRooms = roomList.filter(room => {
            for (const [key, value] of Object.entries(options.where)) {
              if (room.objectData[key] !== value) {
                return false;
              }
            }
            return true;
          });
        }

        // 应用排序
        if (options.orderBy) {
          const [field, direction] = options.orderBy.split(' ');
          filteredRooms.sort((a, b) => {
            const aVal = a.objectData[field];
            const bVal = b.objectData[field];
            if (direction === 'DESC') {
              return bVal > aVal ? 1 : -1;
            }
            return aVal > bVal ? 1 : -1;
          });
        }

        // 应用限制
        if (options.limit) {
          filteredRooms = filteredRooms.slice(0, options.limit);
        }

        resolve({
          objects: filteredRooms,
          total: filteredRooms.length
        });
      } catch (error) {
        reject(error);
      }
    }, 150); // 模拟网络延迟
  });
};

// 初始化函数 - 确保基础数据存在
function initializeMockAPI() {
  // 如果没有存储的ID计数器，初始化为1000（避免与mockData中的ID冲突）
  if (!localStorage.getItem(STORAGE_KEYS.NEXT_ID)) {
    localStorage.setItem(STORAGE_KEYS.NEXT_ID, '1000');
  }
  
  console.log('Mock Trickle API initialized');
}

// 页面加载时初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMockAPI);
} else {
  initializeMockAPI();
}