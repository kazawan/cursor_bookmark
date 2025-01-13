const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

// 设置默认数据
db.defaults({
  users: [],
  bookmarks: [],
  categories: []
}).write();

// 确保现有的书签表有新的字段
const bookmarks = db.get('bookmarks').value();
bookmarks.forEach(bookmark => {
  if (!bookmark.description) bookmark.description = '';
  if (!bookmark.favicon) bookmark.favicon = '';
  if (!bookmark.categories || !Array.isArray(bookmark.categories)) {
    bookmark.categories = [];
  }
  if (!bookmark.created_at) {
    bookmark.created_at = new Date().toISOString();
  }
});

// 确保现有的用户表有新的字段
const users = db.get('users').value();
users.forEach(user => {
  if (!user.created_at) {
    user.created_at = new Date().toISOString();
  }
  if (!user.id) {
    user.id = Date.now().toString();
  }
});

db.write();

module.exports = db; 