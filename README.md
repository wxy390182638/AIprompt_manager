# Prompt Manager Chrome扩展

这是一个用于管理和组织AI提示词(Prompt)的Chrome浏览器扩展。它可以帮助你更好地管理、分类和使用各种AI提示词。

## 项目简介

在AI时代，优质的Prompt对于获得好的AI回复至关重要。本扩展旨在提供一个简单易用的界面，帮助用户：
- 系统地管理和组织各类Prompt
- 快速查找和使用常用Prompt
- 分享和导入优质Prompt

## 功能特性

### 1. 文件夹管理
- 创建新文件夹：可以创建多层文件夹结构，方便分类管理
- 编辑文件夹：支持重命名文件夹
- 删除文件夹：可以删除空文件夹或包含内容的文件夹（会有确认提示）
- 文件夹排序：支持拖拽排序
- 文件夹搜索：快速查找特定文件夹

### 2. Prompt管理
- 创建Prompt：在指定文件夹中创建新的Prompt
- 编辑功能：
  - 修改Prompt内容
  - 添加标签
  - 设置使用场景
  - 添加备注说明
- 删除Prompt：支持单个或批量删除
- 搜索功能：支持按标题、内容、标签搜索
- 收藏功能：可以收藏常用的Prompt
- 使用统计：记录Prompt的使用次数和最后使用时间

### 3. 热门Prompt
- 预设模板：提供常用场景的Prompt模板
- 一键导入：可以直接将模板导入到个人文件夹
- 分类展示：按照不同场景和用途分类展示
- 评分系统：用户可以对模板进行评分和评论

### 4. 主题支持
- 亮色/暗色主题：支持根据系统设置自动切换或手动选择
- 现代化UI：科技感十足的界面设计，采用圆角设计
- 动画效果：平滑的过渡效果，提升用户体验

### 5. 数据管理
- 导入/导出：支持将数据导出为JSON文件，也可以从文件导入
- 自动保存：实时保存用户的更改
- 同步功能：在不同设备间同步数据（规划中）

## 技术架构

- 框架：React + TypeScript
- 状态管理：React Context
- 存储：Chrome Storage API
- UI库：Material-UI (MUI)
- 构建工具：Webpack
- 代码规范：ESLint + Prettier

## 安装说明

1. 克隆项目到本地
   ```
   git clone https://github.com/yourusername/prompt-manager.git
   ```

2. 安装依赖
   ```
   npm install
   ```

3. 构建项目
   ```
   npm run build
   ```

4. 安装到Chrome
   - 打开Chrome浏览器，访问`chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目的`build`文件夹

## 近期更新

- 2023-03-21: 
  - 优化UI界面，增加圆角设计，提升科技感
  - 增加暗色主题支持，自动适应系统设置
  - 修复popup窗口尺寸问题，现在能够完整显示所有内容
  - 改进文件夹管理界面，增加搜索功能
  - 优化交互体验，添加过渡动画效果

## 贡献指南

欢迎贡献代码或提出建议！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目基于 MIT 许可证 - 详情请参阅 LICENSE 文件

