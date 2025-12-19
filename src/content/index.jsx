import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../App';
import './style.css';

// 等待页面加载完成
function init() {
  // 检查是否已经初始化
  if (document.getElementById('cba-live-insight-root')) {
    return;
  }

  // 创建容器（不使用Shadow DOM，使用Tailwind prefix避免样式冲突）
  const container = document.createElement('div');
  container.id = 'cba-live-insight-root';
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  `;

  document.body.appendChild(container);

  // 挂载React应用
  const root = createRoot(container);
  root.render(<App />);
}

// 如果DOM已经加载完成，立即初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // 延迟一下确保页面完全加载
  setTimeout(init, 100);
}
