import { useState, useEffect } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditMode } from '../context/EditModeContext';
import CategorySelect from '../components/CategorySelect';
import AddBookmarkModal from '../components/AddBookmarkModal';

// 添加加载动画组件
function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

export default function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newBookmark, setNewBookmark] = useState({ 
    title: '', 
    url: '',
    categories: []
  });
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const { isEditMode } = useEditMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clipboardUrl, setClipboardUrl] = useState('');

  // 瀑布流的断点设置
  const breakpointColumns = {
    default: 4, // 默认4列
    1280: 3,   // 屏幕宽度 >= 1280px 时3列
    1024: 2,   // 屏幕宽度 >= 1024px 时2列
    640: 1     // 屏幕宽度 >= 640px 时1列
  };

  useEffect(() => {
    fetchBookmarks();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/bookmark/category/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched categories:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('获取分类失败:', error);
    }
  };

  // 确保 URL 包含协议
  const ensureHttps = (url) => {
    if (!url) return url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/bookmark/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Received bookmarks:', response.data); // 添加调试日志
      setBookmarks(response.data);
    } catch (error) {
      console.error('获取书签失败:', error);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setNewBookmark(prev => ({ ...prev, url }));
  };

  const handleSubmit = async (newBookmark) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const bookmarkWithProtocol = {
        ...newBookmark,
        url: ensureHttps(newBookmark.url),
        categories: newBookmark.categories || []
      };
      
      await axios.post('http://localhost:3000/api/bookmark/add', bookmarkWithProtocol, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsModalOpen(false);
      setClipboardUrl('');
      await Promise.all([fetchBookmarks(), fetchCategories()]);
    } catch (error) {
      console.error('添加书签失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 添加删除书签的函数
  const handleDelete = async (bookmarkId) => {
    if (!window.confirm('确定要删除这个书签吗？')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/bookmark/delete/${bookmarkId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookmarks(); // 重新获取书签列表
    } catch (error) {
      console.error('删除书签失败:', error);
    }
  };

  const filteredBookmarks = activeFilter === 'all'
    ? bookmarks
    : bookmarks.filter(bookmark => bookmark.categories.includes(activeFilter));

  // 简化添加书签按钮的处理函数
  const handleAddBookmarkClick = () => {
    setIsModalOpen(true);
  };

  // 修改关闭弹窗的处理函数
  const handleModalClose = () => {
    setIsModalOpen(false);
    setClipboardUrl('');
    setNewBookmark({ 
      title: '', 
      url: '',
      categories: []
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">书签管理</h2>
        <button
          onClick={handleAddBookmarkClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          添加书签
        </button>
      </div>
      
      {/* 分类过滤器 */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1 rounded-full text-sm ${
            activeFilter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          全部
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-3 py-1 rounded-full text-sm ${
              activeFilter === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 书签列表 */}
      <AnimatePresence>
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-transparent"
        >
          {filteredBookmarks.map((bookmark) => (
            <motion.div
              key={bookmark.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.3,
                layout: { duration: 0.3 }
              }}
              className="mb-4 w-full"
              layout
            >
              <div className="p-4 border rounded-lg bg-gray-800 hover:shadow-lg transition-shadow relative group">
                {/* 删除按钮 */}
                {isEditMode && (
                  <motion.button
                    onClick={() => handleDelete(bookmark.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="删除书签"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                )}

                <motion.div
                  initial={{ y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={bookmark.favicon || `https://www.google.com/s2/favicons?domain=${bookmark.url}`}
                      alt=""
                      className="w-6 h-6"
                      onError={(e) => {
                        e.target.src = `https://www.google.com/s2/favicons?domain=${bookmark.url}`;
                      }}
                    />
                    <h3 className="font-bold truncate flex-1">{bookmark.title}</h3>
                  </div>
                  {bookmark.description && (
                    <p className="text-gray-400 text-sm mb-2 line-clamp-3">
                      {bookmark.description}
                    </p>
                  )}
                  {bookmark.categories && Array.isArray(bookmark.categories) && bookmark.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {bookmark.categories.map((category, index) => (
                        <span
                          key={`${bookmark.id}-${category}-${index}`}
                          className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full text-xs"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                  <a
                    href={ensureHttps(bookmark.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm block truncate"
                  >
                    {bookmark.url}
                  </a>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </Masonry>
      </AnimatePresence>

      {/* 添加书签弹出框 */}
      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        loading={loading}
        categories={categories}
        initialUrl={clipboardUrl}
      />

      {/* 空状态提示 */}
      {filteredBookmarks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 mt-8"
        >
          {activeFilter === 'all' ? '还没有添加任何书签' : '该分类下没有书签'}
        </motion.div>
      )}
    </div>
  );
} 