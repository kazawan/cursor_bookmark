const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'db.json');
const adapter = new FileSync(dbPath);
const db = low(adapter);

// 设置默认数据
db.defaults({ users: [], bookmarks: [] }).write();

module.exports = db; 