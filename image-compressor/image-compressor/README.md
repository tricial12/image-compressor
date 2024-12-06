# 图片压缩工具

一个基于 React 的在线图片压缩工具，支持多种压缩模式和格式转换。

## 功能特点

- ������������
���������������
������������������
�����������������������
��������������
���������
����������
�����������������������
������������
��������������������
�����������
������������
������������
���������������
������������
����������
�����������

bash
git clone https://github.com/yourusername/image-compressor.git
cd image-compressor


2. 安装依赖：
bash
npm install


## 使用说明

### 基本使用
1. 打开网页后，点击或拖拽图片到上传区域
2. 选择压缩模式：
   - 自动压缩
   - 自定义尺寸
   - 自定义像素密度
3. 根据需要调整参数
4. 查看压缩效果
5. 下载压缩后的图片

### 压缩模式详解

#### 自动压缩
- 使用质量滑块控制压缩程度（10%-100%）
- 自动维持适当的图片尺寸
- 适合快速压缩

#### 自定义尺寸
- 手动输入目标宽度和高度
- 可选择是否保持宽高比
- 适合需要特定尺寸的场景

#### 自定义像素密度
- 预设 DPI 选项：
  - 网页 (72 DPI)
  - 打印 (150 DPI)
  - 高清 (300 DPI)
  - 超清 (600 DPI)
- 支持手动输入 DPI 值

## 技术实现

- 前端框架：React
- 样式方案：@emotion/styled
- 图片压缩：browser-image-compression
- 开发环境：Create React App

## 项目结构

image-compressor/
├── src/
│ ├── App.js # 主应用组件
│ ├── components/ # 组件目录
│ │ └── ImageCompressor.jsx # 图片压缩组件
│ └── index.js # 入口文件
└── package.json # 项目配置文件


## 注意事项

- 支持的图片格式：PNG、JPG、WebP
- 建议上传图片大小不超过 10MB
- 需要现代浏览器支持（支持 Canvas API）
- 压缩效果取决于原图大小和选择的参数

## 开发相关

### 安装依赖

bash
npm install @emotion/styled browser-image-compression


### 开发模式

bash
npm start


### 构建生产版本

bash
npm run build

## 更新日志

### v1.0.0
- 支持三种压缩模式
- 实时预览压缩效果
- 支持格式转换
- 添加 DPI 预设选项

## 许可证

MIT

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 问题反馈

如果你发现任何问题或有改进建议，欢迎：
1. 提交 Issue
2. 发送邮件至 [your-email@example.com]
3. 提交 Pull Request

