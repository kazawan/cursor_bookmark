# API 文档

## 基础信息
- 基础URL: `http://localhost:3000/api`
- 所有需要认证的接口都需要在请求头中携带 `Authorization: Bearer <token>`

## 用户相关接口

### 注册
- 路径: `/user/register`
- 方法: `POST`
- 请求体:
  ```json
  {
    "username": "用户名",
    "password": "密码",
    "email": "邮箱（可选）"
  }
  ```
- 响应:
  ```json
  {
    "message": "注册成功"
  }
  ```

### 登录
- 路径: `/user/login`
- 方法: `POST`
- 请求体:
  ```json
  {
    "username": "用户名",
    "password": "密码"
  }
  ```
- 响应:
  ```json
  {
    "token": "JWT令牌",
    "user": {
      "id": "用户ID",
      "username": "用户名"
    }
  }
  ```

### 获取用户信息
- 路径: `/user/info`
- 方法: `GET`
- 需要认证: 是
- 响应:
  ```json
  {
    "id": "用户ID",
    "username": "用户名",
    "email": "邮箱"
  }
  ```

### 更新用户设置
- 路径: `/user/settings`
- 方法: `PUT`
- 需要认证: 是
- 请求体:
  ```json
  {
    "username": "新用户名",  // 可选
    "currentPassword": "当前密码",  // 修改密码时需要
    "newPassword": "新密码"  // 可选
  }
  ```
- 响应:
  ```json
  {
    "message": "设置更新成功"
  }
  ```

## 书签相关接口

### 获取书签列表
- 路径: `/bookmark/list`
- 方法: `GET`
- 需要认证: 是
- 响应:
  ```json
  [
    {
      "id": "书签ID",
      "title": "标题",
      "url": "URL",
      "description": "描述",
      "favicon": "图标URL",
      "categories": ["分类1", "分类2"],
      "created_at": "创建时间"
    }
  ]
  ```

### 添加书签
- 路径: `/bookmark/add`
- 方法: `POST`
- 需要认证: 是
- 请求体:
  ```json
  {
    "title": "标题",
    "url": "URL",
    "description": "描述（可选）",
    "categories": ["分类1", "分类2"]  // 可选
  }
  ```
- 响应:
  ```json
  {
    "id": "新书签ID",
    "message": "书签添加成功"
  }
  ```

### 删除书签
- 路径: `/bookmark/delete/:id`
- 方法: `DELETE`
- 需要认证: 是
- 响应:
  ```json
  {
    "message": "书签删除成功"
  }
  ```

### 获取分类列表
- 路径: `/bookmark/category/list`
- 方法: `GET`
- 需要认证: 是
- 响应:
  ```json
  ["分类1", "分类2", "分类3"]
  ```

### 导出书签
- 路径: `/bookmark/export`
- 方法: `GET`
- 需要认证: 是
- 响应: JSON文件下载

### 导入书签
- 路径: `/bookmark/import`
- 方法: `POST`
- 需要认证: 是
- 请求体:
  ```json
  {
    "bookmarks": [
      {
        "title": "标题",
        "url": "URL",
        "description": "描述",
        "categories": ["分类1", "分类2"]
      }
    ]
  }
  ```
- 响应:
  ```json
  {
    "message": "书签导入成功",
    "imported": 5  // 导入成功的数量
  }
  ``` 