import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useEditMode } from '../context/EditModeContext';
import { useUser } from '../context/UserContext';
import SettingsModal from './SettingsModal';
import { useState } from 'react';

export default function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { isEditMode, setIsEditMode } = useEditMode();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, [setUser]);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:3000/api/user/info', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('获取用户信息失败:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const isBookmarkPage = location.pathname === '/bookmarks';

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 左侧 Logo 和主导航 */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
              书签管理
            </Link>
            {user && (
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  to="/bookmarks" 
                  className={`text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md ${
                    isBookmarkPage ? 'bg-gray-900' : ''
                  }`}
                >
                  我的书签
                </Link>
              </div>
            )}
          </div>

          {/* 右侧用户区域 */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {isBookmarkPage && (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEditMode}
                      onChange={(e) => setIsEditMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-2 text-sm font-medium text-gray-300">编辑模式</span>
                  </label>
                )}
                
                {/* 用户菜单 */}
                <div className="relative flex items-center">
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden md:block">{user.username}</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="ml-4 text-gray-300 hover:text-white transition-colors flex items-center"
                    title="退出登录"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  登录
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUsername={user?.username}
      />
    </nav>
  );
} 