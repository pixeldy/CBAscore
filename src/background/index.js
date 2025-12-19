/**
 * Background Service Worker
 * 用于处理跨域API请求，避免CORS问题
 */

console.log('Background Service Worker 已启动');

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background: 收到消息', request.type);

  // 处理获取比赛列表请求
  if (request.type === 'FETCH_MATCH_LIST') {
    fetchMatchList()
      .then((data) => {
        console.log('Background: 比赛列表获取成功');
        sendResponse({ success: true, data });
      })
      .catch((error) => {
        console.error('Background: 比赛列表获取失败', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // 保持消息通道开放以支持异步响应
  }

  // 处理获取比赛统计数据请求
  if (request.type === 'FETCH_MATCH_STATS') {
    fetchMatchStats(request.matchId)
      .then((data) => {
        console.log('Background: 统计数据获取成功');
        sendResponse({ success: true, data });
      })
      .catch((error) => {
        console.error('Background: 统计数据获取失败', error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  // 未知消息类型
  console.warn('Background: 未知消息类型', request.type);
  return false;
});

/**
 * 获取比赛列表
 */
async function fetchMatchList() {
  const url =
    'https://vms-sc.miguvideo.com/vms-match/v6/staticcache/basic/match-list/normal-match-list/0/2221401/default/1/miguvideo';

  console.log('Background: 开始获取比赛列表', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.miguvideo.com/',
      },
    });

    console.log('Background: 收到响应', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Background: 解析数据成功', data.code);

    if (data.code !== 200) {
      throw new Error(data.message || '获取比赛列表失败');
    }

    return data;
  } catch (error) {
    console.error('Background: Failed to fetch match list:', error);
    throw error;
  }
}

/**
 * 获取比赛统计数据
 */
async function fetchMatchStats(matchId) {
  if (!matchId) {
    throw new Error('Match ID is required');
  }

  const url = `https://v0-sc.miguvideo.com/vms-livedata/live-stream/v1/tech-statistic/${matchId}`;

  console.log('Background: 开始获取统计数据', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.miguvideo.com/',
      },
    });

    console.log('Background: 收到响应', response.status, response.statusText);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('比赛数据未找到，可能比赛尚未开始');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Background: 解析数据成功', data.code);

    if (data.code !== 200) {
      throw new Error(data.message || '获取统计数据失败');
    }

    return data;
  } catch (error) {
    console.error('Background: Failed to fetch match stats:', error);
    throw error;
  }
}
