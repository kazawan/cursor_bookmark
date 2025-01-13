import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:3000/api/user/register', data);
      navigate('/login');
    } catch (error) {
      console.error('注册失败:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">注册</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">用户名</label>
          <input
            {...register('username')}
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <div>
          <label className="block mb-1">密码</label>
          <input
            type="password"
            {...register('password')}
            className="w-full p-2 border rounded text-black"
          />
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
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          注册
        </button>
      </form>
    </div>
  );
} 