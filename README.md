# Cursor Bookmark Manager

一个现代化的书签管理系统，帮助你更好地组织和管理网络书签。

## 功能特点

- 👤 用户系统
  - 注册/登录
  - 个人设置管理
  - JWT 认证
- 📚 书签管理
  - 添加/删除书签
  - 分类管理
  - 瀑布流布局展示
  - 编辑模式切换
- 🔄 导入/导出
  - JSON 格式导入导出
  - 批量操作
- 🎨 现代化界面
  - 响应式设计
  - 暗色主题
  - 动画效果
  - Toast 消息提示

## 技术栈

### 前端
- React
- React Router
- Axios
- Tailwind CSS
- Framer Motion
- React Hook Form

### 后端
- Node.js
- Express
- JWT
- LowDB
- bcryptjs

## 快速开始

### 使用 Docker

1. 克隆仓库
```bash
git clone https://github.com/yourusername/cursor-bookmark.git
cd cursor-bookmark
```

2. 使用 Docker Compose 启动
```bash
docker-compose up -d
```

3. 访问 http://localhost:5173

### 手动启动

1. 克隆仓库
```bash
git clone https://github.com/yourusername/cursor_bookmark.git
cd cursor-bookmark
```

2. 安装依赖并启动后端
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

3. 安装依赖并启动前端
```bash
cd frontend
npm install
npm run dev
```

4. 访问 http://localhost:5173

## 项目结构

```
cursor-bookmark/
├── backend/                # 后端代码
│   ├── routes/            # 路由处理
│   ├── data/             # 数据存储
│   ├── .env.example      # 环境变量示例
│   └── server.js         # 入口文件
├── frontend/              # 前端代码
│   ├── src/
│   │   ├── components/   # 组件
│   │   ├── pages/       # 页面
│   │   ├── context/     # Context
│   │   └── App.jsx      # 主应用
│   └── index.html
├── docker-compose.yml    # Docker 配置
└── README.md
```

## API 文档

详细的 API 文档请查看 [API.md](backend/API.md)

## 开发计划

- [ ] 支持更多书签导入格式
- [ ] 添加书签标签功能
- [ ] 支持书签搜索
- [ ] 添加书签分享功能
- [ ] 支持更多主题

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE)