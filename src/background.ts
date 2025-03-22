// background.ts - Service Worker for Prompt Manager Extension

// 添加空导出使其成为模块
export {};

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // 初始化存储
    chrome.storage.local.set({
      folders: [],
      prompts: [],
      settings: {
        theme: 'light',
        language: 'zh'
      }
    });
  }
});

// 监听消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 处理来自popup或content script的消息
  if (message.type === 'GET_DATA') {
    chrome.storage.local.get(null, (data) => {
      sendResponse(data);
    });
    return true; // 保持消息通道开放
  }
});

// 错误处理和日志记录
const logError = (error: Error) => {
  console.error('[Prompt Manager Error]:', error);
  // 这里可以添加错误上报逻辑
};

// 全局错误处理
self.onerror = (message, source, lineno, colno, error) => {
  logError(error || new Error(message as string));
  return true;
};

// 未捕获的Promise错误处理
self.onunhandledrejection = (event) => {
  logError(event.reason);
}; 