import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategorySelect from './CategorySelect';

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

export default function AddBookmarkModal({ isOpen, onClose, onSubmit, loading, categories, initialUrl }) {
  const [bookmark, setBookmark] = useState({
    title: '',
    url: '',
    categories: []
  });

  // 当 initialUrl 改变时更新表单
  useEffect(() => {
    if (initialUrl) {
      setBookmark(prev => ({
        ...prev,
        url: initialUrl
      }));
    }
  }, [initialUrl]);

  // 重置表单
  const resetForm = () => {
    setBookmark({
      title: '',
      url: '',
      categories: []
    });
  };

  // 添加 ESC 键关闭功能
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // 打开时禁止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(bookmark);
  };

  // 关闭时重置表单
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
            onClick={onClose}
          />
          
          {/* 弹出框 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">添加新书签</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="关闭"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">URL</label>
                <div className="flex gap-2">
                  <input
                    value={bookmark.url}
                    onChange={(e) => setBookmark({ ...bookmark, url: e.target.value })}
                    className="flex-1 p-2 border rounded text-black bg-white"
                    placeholder="例如: www.example.com 或 https://example.com"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
                        if (urlPattern.test(text)) {
                          setBookmark(prev => ({ ...prev, url: text }));
                        } else {
                          alert('剪贴板中的内容不是有效的URL');
                        }
                      } catch (error) {
                        console.error('无法读取剪贴板:', error);
                        alert('无法读取剪贴板内容');
                      }
                    }}
                    className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center"
                    title="从剪贴板粘贴"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block mb-1">标题</label>
                <input
                  value={bookmark.title}
                  onChange={(e) => setBookmark({ ...bookmark, title: e.target.value })}
                  className="w-full p-2 border rounded text-black bg-white"
                  placeholder="可选，留空将自动获取网页标题"
                />
              </div>
              
              <div>
                <label className="block mb-1">分类</label>
                <CategorySelect
                  existingCategories={categories}
                  selectedCategories={bookmark.categories}
                  onChange={(cats) => setBookmark({ ...bookmark, categories: cats })}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center min-w-[80px] transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      <span>添加中...</span>
                    </>
                  ) : (
                    '添加'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 