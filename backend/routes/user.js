const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const db = require("../db");

// 注册
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    // 检查用户是否已存在
    const existingUser = db.get('users').find({ username }).value();

    if (existingUser) {
      return res.status(400).json({ error: "用户名已存在" });
    }

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const user = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      created_at: new Date().toISOString()
    };

    // 保存用户
    db.get('users')
      .push(user)
      .write();

    res.json({ message: "注册成功" });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ error: "注册失败" });
  }
});

// 登录
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = db.get('users').find({ username }).value();

    if (!user) {
      return res.status(400).json({ error: "用户名或密码错误" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "用户名或密码错误" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token, username: user.username });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ error: "登录失败" });
  }
});

// 获取用户信息
router.get("/info", auth, (req, res) => {
  try {
    const user = db.get('users')
      .find({ id: req.user.id })
      .omit(['password'])
      .value();

    if (!user) {
      return res.status(404).json({ error: "用户不存在" });
    }

    res.json(user);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ error: "获取用户信息失败" });
  }
});

// 更新用户设置
router.put("/settings", auth, async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    const user = db.get('users').find({ id: req.user.id }).value();

    if (!user) {
      return res.status(404).json({ error: "用户不存在" });
    }

    // 如果是更新用户名
    if (username && !currentPassword && !newPassword) {
      // 检查用户名是否已被其他用户使用
      const existingUser = db.get('users')
        .find({ username, id: { $ne: req.user.id } })
        .value();

      if (existingUser) {
        return res.status(400).json({ error: "用户名已被使用" });
      }

      db.get('users')
        .find({ id: req.user.id })
        .assign({ username })
        .write();

      return res.json({ message: "用户名更新成功" });
    }

    // 如果是更新密码
    if (currentPassword && newPassword) {
      // 验证当前密码
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: "当前密码不正确" });
      }

      // 加密新密码
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      db.get('users')
        .find({ id: req.user.id })
        .assign({ password: hashedPassword })
        .write();

      return res.json({ message: "密码更新成功" });
    }

    res.status(400).json({ error: "无效的请求参数" });
  } catch (error) {
    console.error("更新设置失败:", error);
    res.status(500).json({ error: "更新设置失败" });
  }
});

module.exports = router;
