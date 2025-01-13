# 个人书签前后端项目

前端：
    项目目录 : ./frontend
    1.使用vite 创建 react项目
    2.使用react-router-dom 创建路由
    3.使用axios 发送请求
    4.使用tailwindcss 进行样式开发
    5.github 风格ui 颜色暗黑
    6.使用react-hook-form 进行表单验证

    布局 
    顶部导航栏
        - 登录注册
        - 书签管理
        - 退出登录
    中间内容区
        - 书签列表
        - 书签添加
        - 书签删除
        - 书签更新
    底部版权信息

后端：
    项目目录 : ./backend
    框架：express + cors + nodemon + sqlite3 + jsonwebtoken
    1.创建项目
    2.创建路由
    3.创建数据库
    4.创建数据表
    5.创建接口
    6.token 生成验证

    用户表 数据格式
    id: 用户id
    username: 用户名
    password: 用户密码
    email: 用户邮箱
    created_at: 创建时间
    updated_at: 更新时间

    书签表 数据格式
    id: 书签id
    user_id: 用户id 关联用户表
    title: 书签标题
    url: 书签链接
    created_at: 创建时间
    updated_at: 更新时间

    用户api
    注册 /api/user/register
    登录 /api/user/login
    获取用户信息 /api/user/info
    退出登录 /api/user/logout

    书签api
    获取书签 /api/bookmark/list
    添加书签 /api/bookmark/add
    删除书签 /api/bookmark/delete
    更新书签 /api/bookmark/update



