const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');
const axios = require('axios');

// 获取书签列表
router.get('/list', auth, (req, res) => {
  try {
    const bookmarks = db
      .get('bookmarks')
      .filter({ user_id: req.user.id })
      .value();

    console.log('User bookmarks:', bookmarks); // 添加调试日志
    console.log('User ID:', req.user.id); // 添加用户ID调试日志

    res.json(bookmarks);
  } catch (error) {
    console.error('获取书签失败:', error);
    res.status(500).json({ error: '获取书签失败' });
  }
});

// 获取分类列表
router.get('/category/list', auth, (req, res) => {
  try {
    // 从所有书签中收集唯一的分类
    const allBookmarks = db.get('bookmarks')
      .filter({ user_id: req.user.id })
      .value();

    // 使用 Set 来收集唯一的分类
    const uniqueCategories = new Set();
    allBookmarks.forEach(bookmark => {
      if (bookmark.categories && Array.isArray(bookmark.categories)) {
        bookmark.categories.forEach(category => {
          if (category) uniqueCategories.add(category);
        });
      }
    });

    const categories = Array.from(uniqueCategories);
    console.log('Found categories:', categories); // 添加调试日志

    res.json(categories);
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({ error: '获取分类失败' });
  }
});

// 添加书签
router.post('/add', auth, async (req, res) => {
  const { url, title, categories = [] } = req.body;
  
  console.log('Received bookmark data:', req.body); // 添加调试日志

  try {
    // 1. 添加书签
    const bookmark = {
      id: Date.now().toString(),
      user_id: req.user.id,
      title,
      url,
      description: '',
      favicon: '',
      categories: Array.isArray(categories) ? categories : [], // 确保是数组
      created_at: new Date().toISOString()
    };

    console.log('Saving bookmark with categories:', bookmark.categories); // 添加调试日志

    // 2. 保存书签
    db.get('bookmarks')
      .push(bookmark)
      .write();

    // 3. 立即获取更新后的分类列表
    const updatedCategories = await fetchUserCategories(req.user.id);
    
    res.json({ 
      message: '书签添加成功', 
      id: bookmark.id,
      bookmark,
      categories: updatedCategories
    });
  } catch (error) {
    console.error('添加书签失败:', error);
    res.status(500).json({ error: '添加书签失败' });
  }
});

// 辅助函数：获取用户的所有分类
function fetchUserCategories(userId) {
  const bookmarks = db
    .get('bookmarks')
    .filter({ user_id: userId })
    .value();

  const uniqueCategories = new Set();
  bookmarks.forEach(bookmark => {
    if (bookmark.categories && Array.isArray(bookmark.categories)) {
      bookmark.categories.forEach(category => {
        if (category) uniqueCategories.add(category);
      });
    }
  });

  return Array.from(uniqueCategories);
}

// 删除书签
router.delete('/delete/:id', auth, (req, res) => {
  try {
    const result = db
      .get('bookmarks')
      .remove({ id: req.params.id, user_id: req.user.id })
      .write();

    if (result.length === 0) {
      return res.status(404).json({ error: '书签不存在或无权删除' });
    }

    // 清理没有关联书签的分类
    const allBookmarks = db.get('bookmarks').value();
    const usedCategories = new Set(
      allBookmarks.flatMap(b => b.categories || [])
    );

    db.get('categories')
      .remove(category => !usedCategories.has(category.name))
      .write();

    res.json({ message: '书签删除成功' });
  } catch (error) {
    console.error('删除书签失败:', error);
    res.status(500).json({ error: '删除书签失败' });
  }
});

// 导出书签
router.get('/export', auth, (req, res) => {
  try {
    const bookmarks = db.get('bookmarks')
      .filter({ user_id: req.user.id })
      .value();

    res.json(bookmarks);
  } catch (error) {
    console.error('导出书签失败:', error);
    res.status(500).json({ error: '导出书签失败' });
  }
});

// 导入书签
router.post('/import', auth, (req, res) => {
  try {
    const { bookmarks } = req.body;
    
    if (!Array.isArray(bookmarks)) {
      return res.status(400).json({ error: '无效的书签数据格式' });
    }

    // 处理每个书签
    const processedBookmarks = bookmarks.map(bookmark => ({
      ...bookmark,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // 生成新的ID
      user_id: req.user.id,
      created_at: new Date().toISOString()
    }));

    // 添加书签
    db.get('bookmarks')
      .push(...processedBookmarks)
      .write();

    res.json({ message: '书签导入成功', count: processedBookmarks.length });
  } catch (error) {
    console.error('导入书签失败:', error);
    res.status(500).json({ error: '导入书签失败' });
  }
});

module.exports = router; 