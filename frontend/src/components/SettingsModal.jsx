import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

export default function SettingsModal({ isOpen, onClose, currentUsername }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [editMode, setEditMode] = useState(''); // 'username' 或 'password' 或 ''
  const [settings, setSettings] = useState({
    username: currentUsername || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // 添加文件输入引用
  const fileInputRef = useRef(null);

  // 当 currentUsername 更新时，更新 settings
  useEffect(() => {
    setSettings(prev => ({ ...prev, username: currentUsername || '' }));
  }, [currentUsername]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      if (editMode === 'password' && settings.newPassword !== settings.confirmPassword) {
        throw new Error('新密码和确认密码不匹配');
      }

      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3000/api/user/settings', {
        ...(editMode === 'username' ? { username: settings.username } : {}),
        ...(editMode === 'password' ? {
          currentPassword: settings.currentPassword,
          newPassword: settings.newPassword
        } : {})
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', content: '设置更新成功' });
      setTimeout(() => {
        setEditMode('');
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        content: error.response?.data?.error || error.message || '更新设置失败'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSettings({
      username: currentUsername || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setMessage({ type: '', content: '' });
    setEditMode('');
  };

  // 导出书签
  const handleExport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/bookmark/export', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 创建并下载文件
      const dataStr = JSON.stringify(response.data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookmarks_${currentUsername}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage({ type: 'success', content: '书签导出成功' });
    } catch (error) {
      setMessage({
        type: 'error',
        content: error.response?.data?.error || '书签导出失败'
      });
    } finally {
      setLoading(false);
    }
  };

  // 导入书签
  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = JSON.parse(e.target.result);
          const token = localStorage.getItem('token');
          
          await axios.post('http://localhost:3000/api/bookmark/import', 
            { bookmarks: content },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setMessage({ type: 'success', content: '书签导入成功' });
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } catch (error) {
          setMessage({
            type: 'error',
            content: error.response?.data?.error || '书签导入失败'
          });
        } finally {
          setLoading(false);
        }
      };

      reader.readAsText(file);
    } catch (error) {
      setMessage({
        type: 'error',
        content: '文件读取失败'
      });
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
            onClick={() => {
              resetForm();
              onClose();
            }}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">用户设置</h3>
              <button
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="关闭"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {message.content && (
              <div className={`p-3 rounded mb-4 ${
                message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
              }`}>
                {message.content}
              </div>
            )}

            {!editMode ? (
              // 用户信息显示模式
              <div className="space-y-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm text-gray-400">用户名</h4>
                      <p className="text-lg font-semibold">{currentUsername}</p>
                    </div>
                    <button
                      onClick={() => setEditMode('username')}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      修改
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm text-gray-400">密码</h4>
                      <p className="text-lg font-semibold">••••••••</p>
                    </div>
                    <button
                      onClick={() => setEditMode('password')}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      修改
                    </button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <h4 className="text-sm text-gray-400 mb-3">书签管理</h4>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleExport}
                        disabled={loading}
                        className="flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? <LoadingSpinner /> : (
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        )}
                        导出书签
                      </button>
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImport}
                        accept=".json"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? <LoadingSpinner /> : (
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        )}
                        导入书签
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // 编辑模式
              <form onSubmit={handleSubmit} className="space-y-4">
                {editMode === 'username' && (
                  <div>
                    <label className="block mb-1">新用户名</label>
                    <input
                      type="text"
                      value={settings.username}
                      onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                      className="w-full p-2 border rounded text-black bg-white"
                      required
                      autoFocus
                    />
                  </div>
                )}

                {editMode === 'password' && (
                  <>
                    <div>
                      <label className="block mb-1">当前密码</label>
                      <input
                        type="password"
                        value={settings.currentPassword}
                        onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                        className="w-full p-2 border rounded text-black bg-white"
                        required
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block mb-1">新密码</label>
                      <input
                        type="password"
                        value={settings.newPassword}
                        onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                        className="w-full p-2 border rounded text-black bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">确认新密码</label>
                      <input
                        type="password"
                        value={settings.confirmPassword}
                        onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                        className="w-full p-2 border rounded text-black bg-white"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                    }}
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
                        <span>保存中...</span>
                      </>
                    ) : (
                      '保存'
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 