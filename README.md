# AI提示词管理器 (AI Prompt Manager)

这是一个专业的Chrome浏览器扩展，用于管理、组织和优化AI提示词（Prompts）。通过简洁直观的界面，帮助用户提高与AI工具交互的效率。

![屏幕截图](https://github.com/wxy390182638/AIprompt_manager/raw/master/screenshots/main.png)

## 项目简介

在AI时代，优质的Prompt对于获得高质量AI回复至关重要。本扩展旨在提供一个简单易用的界面，帮助用户：
- 系统地管理和组织各类Prompt
- 快速查找和使用常用Prompt
- 分享和导入优质Prompt模板
- 提高AI交互的效率和质量

## 主要功能

### 1. 文件夹管理
- 创建新文件夹：通过顶部"+"按钮创建文件夹
- 编辑文件夹：支持重命名文件夹
- 删除文件夹：可以删除文件夹（会有确认提示）
- 文件夹导航：轻松在不同文件夹间切换

### 2. Prompt管理
- 创建Prompt：在指定文件夹中创建新的Prompt
- 编辑功能：
  - 修改Prompt标题和内容
  - 添加标签
  - 调整格式
- 删除Prompt：支持单个删除
- 搜索功能：支持按标题、内容、标签搜索
- 使用统计：显示Prompt的创建和更新时间

### 3. 精选Prompt
- 预设模板：提供常用场景的Prompt模板
- 分类浏览：按通用、写作、编程、商业等分类查看
- 一键导入：可以直接将模板导入到个人文件夹
- 多文件夹选择：支持选择导入到特定文件夹
- 远程提示词：支持从远程URL获取最新提示词数据
  - 自动缓存：减少网络请求，提高加载速度
  - 手动刷新：随时获取最新提示词
  - 自定义来源：支持设置自定义JSON数据源

### 4. 主题支持
- 亮色/暗色主题：支持根据系统设置自动切换或手动选择
- 现代化UI：美观的界面设计，采用Material Design设计语言
- 响应式设计：适应不同尺寸的浏览器窗口

### 5. 数据管理
- 本地存储：使用Chrome Storage API保存数据
- 自动保存：实时保存用户的更改
- 数据隐私：所有数据存储在本地，保护用户隐私

## 技术架构

- 前端框架：React 18 + TypeScript
- 状态管理：React Context API
- 存储：Chrome Storage API
- UI组件库：Material-UI v5 (MUI)
- 构建工具：Create React App
- 扩展框架：Chrome Extension Manifest V3

## 安装说明

### 从源码安装

1. 克隆项目到本地
   ```
   git clone https://github.com/wxy390182638/AIprompt_manager.git
   cd AIprompt_manager
   ```

2. 安装依赖
   ```
   npm install
   ```

3. 构建项目
   ```
   npm run build
   ```

4. 在Chrome浏览器中安装
   - 打开Chrome浏览器，访问`chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目的`build`文件夹

### 从Chrome应用商店安装（即将推出）

- 访问[Chrome网上应用店](https://chrome.google.com/webstore/category/extensions)
- 搜索"AI Prompt Manager"
- 点击"添加到Chrome"按钮

## 近期更新

- 2023-03-22:
  - 优化热门提示词功能，支持从远程数据源获取
  - 增加提示词刷新功能和最后更新时间显示
  - 支持用户自定义提示词数据源URL
  - 改进提示词缓存机制，提高性能
  - 新增提示词标签展示和分类筛选

- 2023-03-21: 
  - 修改UI界面，优化用户体验
  - 增加暗色主题支持，自动适应系统设置
  - 精选提示词功能增强，新增文件夹选择功能
  - 改进文件夹管理界面
  - 完善导入提示词的交互流程

## 未来规划

- 账号系统：支持用户注册登录
- 云同步：在不同设备间同步数据
- 协作功能：团队共享和协作编辑提示词
- 会员计划：提供高级功能和更多模板
- 浏览器支持：扩展到Firefox和Edge等浏览器

## 贡献指南

欢迎贡献代码或提出建议！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目基于 MIT 许可证 - 详情请参阅 LICENSE 文件

## 联系方式

如有问题或建议，请[提交Issue](https://github.com/wxy390182638/AIprompt_manager/issues)，或联系我们的团队。

