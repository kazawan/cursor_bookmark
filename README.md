 # 📚 书签管理系统

一个现代化的书签管理系统，帮助你更好地组织和管理网络书签。

## ✨ 特性

- 🔐 用户认证系统
- 📑 书签管理（添加、删除、分类）
- 🏷️ 分类管理
- 🔍 书签搜索
- 📱 响应式设计
- 🌙 暗色主题
- 📤 导入/导出功能
- 🔄 实时同步
- 🎨 美观的界面设计

## 🛠️ 技术栈

### 前端
- ⚛️ React
- 🎨 Tailwind CSS
- 🔄 Framer Motion
- 📦 Vite
- 🚦 React Router
- 🎯 Axios

### 后端
- 🟢 Node.js
- 🚂 Express
- 💾 LowDB
- 🔑 JWT 认证

### 部署
- 🐳 Docker
- 🌐 Nginx

## 🚀 快速开始

### 使用 Docker 运行（推荐）

1. 克隆仓库
```bash
git clone <repository-url>
cd bookmark-manager
```

2. 启动服务
```bash
docker-compose up --build
```

3. 访问应用
- 前端: http://localhost:3030
- 后端: http://localhost:3000
- API 文档: http://localhost:3000/api-docs

### 手动运行

1. 安装依赖

前端:
```bash
cd frontend
npm install
```

后端:
```bash
cd backend
npm install
```

2. 启动服务

前端:
```bash
npm run dev
```

后端:
```bash
npm run dev
```

## 📝 环境变量

### 后端 (.env)
```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

### 前端 (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 📁 项目结构

```
bookmark-manager/
├── frontend/                # 前端代码
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── pages/         # 页面组件
│   │   ├── context/       # React Context
│   │   └── ...
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                # 后端代码
│   ├── routes/            # API 路由
│   ├── middleware/        # 中间件
│   ├── db.js             # 数据库配置
│   └── Dockerfile
└── docker-compose.yml     # Docker 编排配置
```

## 🔨 开发指南

1. 分支管理
- `main`: 主分支
- `develop`: 开发分支
- `feature/*`: 功能分支
- `bugfix/*`: 修复分支

2. 提交规范
```
feat: 新功能
fix: 修复
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建过程或辅助工具的变动
```

## 📚 API 文档

详细的 API 文档请查看 [api.md](api.md)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👥 作者

- 作者名字 - [GitHub](https://github.com/kazawan)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！