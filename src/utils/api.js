/**
 * API请求工具函数
 * 通过background service worker发送请求，避免CORS问题
 */

const REQUEST_TIMEOUT = 30000; // 30秒超时（包含消息传递时间和网络请求时间）

/**
 * 通过chrome.runtime.sendMessage发送请求到background
 */
function sendMessageToBackground(type, data = {}) {
  return new Promise((resolve, reject) => {
    // 检查chrome.runtime是否可用
    if (!chrome.runtime || !chrome.runtime.sendMessage) {
      reject(new Error('Chrome runtime 不可用'));
      return;
    }

    console.log('API: 发送消息到background', type, data);

    const timeoutId = setTimeout(() => {
      console.error('API: 请求超时', type);
      reject(new Error('请求超时，请检查网络连接或稍后重试'));
    }, REQUEST_TIMEOUT);

    try {
      chrome.runtime.sendMessage({ type, ...data }, (response) => {
        clearTimeout(timeoutId);

        // 检查chrome.runtime.lastError
        if (chrome.runtime.lastError) {
          console.error('API: Chrome runtime 错误', chrome.runtime.lastError.message);
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        // 检查响应
        if (!response) {
          console.error('API: 未收到响应', type);
          reject(new Error('未收到响应，background service worker 可能未启动'));
          return;
        }

        console.log('API: 收到响应', type, response.success ? '成功' : '失败');

        if (response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response.error || '请求失败'));
        }
      });
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('API: 发送消息时出错', error);
      reject(error);
    }
  });
}

/**
 * 获取比赛列表
 */
export async function fetchMatchList() {
  try {
    const data = await sendMessageToBackground('FETCH_MATCH_LIST');
    return data;
  } catch (error) {
    console.error('Failed to fetch match list:', error);
    throw error;
  }
}

/**
 * 获取比赛统计数据
 */
export async function fetchMatchStats(matchId) {
  if (!matchId) {
    throw new Error('Match ID is required');
  }

  try {
    const data = await sendMessageToBackground('FETCH_MATCH_STATS', { matchId });
    return data;
  } catch (error) {
    console.error('Failed to fetch match stats:', error);
    throw error;
  }
}
