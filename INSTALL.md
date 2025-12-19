# 安装说明

## 前置要求

1. Node.js 18+ 和 npm
2. Google Chrome 浏览器

## 安装步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 准备图标文件

在 `assets` 目录下创建以下PNG图标文件：
- `icon-16.png` (16x16像素)
- `icon-48.png` (48x48像素)  
- `icon-128.png` (128x128像素)

**快速生成图标的方法：**

可以使用在线工具将 `assets/icon.svg` 转换为PNG，或使用以下命令（需要安装ImageMagick）：

```bash
# 使用ImageMagick转换
convert assets/icon.svg -resize 16x16 assets/icon-16.png
convert assets/icon.svg -resize 48x48 assets/icon-48.png
convert assets/icon.svg -resize 128x128 assets/icon-128.png
```

或者使用任何图片编辑软件创建128x128的PNG图片，然后调整大小。

### 3. 构建项目

```bash
npm run build
```

构建完成后，会在 `dist` 目录生成扩展程序文件。

### 4. 加载到Chrome

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"开关
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `dist` 目录

### 5. 使用

1. 访问 `https://live.douyin.com/` 观看CBA直播
2. 点击页面右侧的悬浮按钮（橙色圆形按钮）
3. 从下拉框选择当日比赛
4. 查看实时比分、球队对比和球员统计数据

## 开发模式

开发时可以使用：

```bash
npm run dev
```

然后使用 Vite 的热更新功能进行开发。注意：开发模式下需要手动重新加载扩展程序才能看到更改。

## 故障排除

### 图标不显示

确保 `assets` 目录下存在所有三个PNG图标文件，且文件名正确。

### 样式不生效

检查 `dist` 目录中是否包含 `src/content/style.css` 文件。如果缺失，检查构建配置。

### 数据加载失败

- 检查网络连接
- 确认接口地址是否正确
- 查看浏览器控制台的错误信息

### 扩展程序无法加载

- 确保 `dist` 目录包含 `manifest.json`
- 检查 `manifest.json` 中的路径是否正确
- 查看 Chrome 扩展程序页面的错误信息
