// 这个文件主要用于开发时的预览
// 实际运行时，Content Script会直接使用App组件
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './content/style.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
