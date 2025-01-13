# 📚 书签管理系统 API 文档 v1.0

## 🌟 API 概览

- 基础 URL: `http://localhost:3000`
- 所有请求和响应均使用 JSON 格式
- 认证使用 Bearer Token 方式
- 所有时间戳使用 ISO 8601 格式

## 🔐 认证相关

### 👤 用户注册
```http
POST /api/user/register
```

**请求体**:
```json
{
  "username": "string (必需)",
  "password": "string (必需, 最少6位)"
}
```

**成功响应** (200):
```json
{
  "message": "注册成功"
}
```

### 🔑 用户登录
```http
POST /api/user/login
```

**请求体**:
```json
{
  "username": "string (必需)",
  "password": "string (必需)"
}
```

**成功响应** (200):
```json
{
  "token": "jwt_token_string",
  "username": "用户名"
}
```

### 👀 获取用户信息
```http
GET /api/user/info
```

**请求头**:
```http
Authorization: Bearer <token>
```

**成功响应** (200):
```json
{
  "id": "用户ID",
  "username": "用户名",
  "created_at": "创建时间"
}
```

## 📑 书签管理

### 📋 获取书签列表
```http
GET /api/bookmark/list
```

**请求头**:
```http
Authorization: Bearer <token>
```

**成功响应** (200):
```json
[
  {
    "id": "书签ID",
    "title": "书签标题",
    "url": "书签URL",
    "description": "书签描述",
    "favicon": "网站图标URL",
    "categories": ["分类1", "分类2"],
    "created_at": "创建时间"
  }
]
```

### ➕ 添加书签
```http
POST /api/bookmark/add
```

**请求头**:
```http
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "title": "string (可选, 留空将自动获取)",
  "url": "string (必需)",
  "description": "string (可选)",
  "favicon": "string (可选)",
  "categories": ["string"] (可选)
}
```

**成功响应** (201):
```json
{
  "message": "书签添加成功",
  "bookmark": {
    "id": "书签ID",
    "title": "书签标题",
    "url": "书签URL",
    "description": "书签描述",
    "favicon": "网站图标URL",
    "categories": ["分类1", "分类2"],
    "created_at": "创建时间"
  }
}
```

### ❌ 删除书签
```http
DELETE /api/bookmark/delete/:id
```

**请求头**:
```http
Authorization: Bearer <token>
```

**成功响应** (200):
```json
{
  "message": "书签删除成功"
}
```

### 🏷️ 获取分类列表
```http
GET /api/bookmark/category/list
```

**请求头**:
```http
Authorization: Bearer <token>
```

**成功响应** (200):
```json
[
  "分类1",
  "分类2",
  "分类3"
]
```

### 📤 导出书签
```http
GET /api/bookmark/export
```

**请求头**:
```http
Authorization: Bearer <token>
```

**成功响应** (200):
```json
[
  {
    "id": "书签ID",
    "title": "书签标题",
    "url": "书签URL",
    "description": "书签描述",
    "favicon": "网站图标URL",
    "categories": ["分类1", "分类2"],
    "created_at": "创建时间"
  }
]
```

### 📥 导入书签
```http
POST /api/bookmark/import
```

**请求头**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**:
```json
{
  "bookmarks": [
    {
      "title": "string",
      "url": "string (必需)",
      "description": "string",
      "favicon": "string",
      "categories": ["string"]
    }
  ]
}
```

**成功响应** (200):
```json
{
  "message": "书签导入成功",
  "count": 导入的书签数量
}
```

## ⚠️ 错误处理

所有接口在发生错误时会返回统一格式的错误响应：

```json
{
  "error": "错误信息描述"
}
```

### 常见错误码
| 状态码 | 说明 | 示例场景 |
|--------|------|----------|
| ✅ 200 | 请求成功 | 成功获取数据 |
| 🆕 201 | 创建成功 | 成功创建新资源 |
| ❌ 400 | 请求参数错误 | 提交的数据格式不正确 |
| 🔒 401 | 未授权 | Token 无效或已过期 |
| 🚫 403 | 禁止访问 | 没有权限访问资源 |
| 🔍 404 | 资源不存在 | 请求的数据不存在 |
| 💥 500 | 服务器错误 | 服务器内部错误 |

## 📝 注意事项

1. 所有需要认证的接口必须在请求头中携带有效的 JWT Token
2. URL 必须包含协议头（http:// 或 https://）
3. 书签标题如果不提供，系统会自动获取网页标题
4. 分类名称区分大小写
5. 导入功能支持批量导入，但单次最多 100 条数据

## 🔄 更新日志

### v1.0.0 (2024-03-21)
- 🎉 首次发布
- 📦 基础的 CRUD 功能
- 🔐 用户认证系统
- 📤 导入导出功能