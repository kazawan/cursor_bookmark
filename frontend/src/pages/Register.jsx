import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axios.post('http://localhost:3000/api/user/register', data);
      setToast({ message: '注册成功！正在跳转到登录页面...', type: 'success' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setToast({
        message: error.response?.data?.error || '注册失败，请重试',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">注册</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">用户名</label>
          <input
            {...register('username', { 
              required: '用户名不能为空',
              minLength: { value: 3, message: '用户名至少3个字符' }
            })}
            className="w-full p-2 border rounded text-black"
          />
          {errors.username && (
            <span className="text-red-500 text-sm">{errors.username.message}</span>
          )}
        </div>
        <div>
          <label className="block mb-1">密码</label>
          <input
            type="password"
            {...register('password', { 
              required: '密码不能为空',
              minLength: { value: 6, message: '密码至少6个字符' }
            })}
            className="w-full p-2 border rounded text-black"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>
        <div>
          <label className="block mb-1">邮箱</label>
          <input
            type="email"
            {...register('email')}
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '注册中...' : '注册'}
        </button>
      </form>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, message: '' })}
      />
    </div>
  );
} 