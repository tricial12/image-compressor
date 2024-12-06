# 图片压缩工具

一个基于 React 的在线图片压缩工具，支持多种压缩模式和格式转换。

## 在线使用

访问：https://你的用户名.github.io/image-compressor

## 本地运行

1. 克隆项目：
```bash
git clone https://github.com/你的用户名/image-compressor.git
cd image-compressor
```

2. 安装依赖：
```bash
npm install
```

3. 启动项目：
```bash
npm start
```

## 部署说明

### 方式一：部署到 GitHub Pages

1. 安装部署工具：
```bash
npm install --save-dev gh-pages
```

2. 修改 package.json：
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "homepage": "https://你的用户名.github.io/image-compressor"
}
```

3. 部署：
```bash
npm run deploy
```

### 方式二：导出静态文件

1. 构建项目：
```bash
npm run build
```

2. 将 build 文件夹中的文件部署到任何静态服务器

[其他内容保持不变...]