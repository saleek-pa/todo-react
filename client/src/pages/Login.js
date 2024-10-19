import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'flowbite-react';
import { login } from '../redux/userSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: 'user@gmail.com',
    password: '1234',
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      await dispatch(login(formData)).unwrap();

      toast.success('Login successful');
      e.target.reset();
      navigate('/');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <section className="w-full h-screen flex justify-center items-center">
      <form className="max-w-sm mx-auto flex-1" onSubmit={handleSubmit}>
        <h1 className="mb-5 text-black text-3xl font-thin">Welcome back</h1>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Your email
          </label>
          <input
            autoFocus
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@email.com"
            required
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Your password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value.trim() })}
            placeholder="********"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <Button type="submit" color="blue" className="w-full" disabled={loading}>
          {loading ? (
            <div className="flex justify-center">
              <div className="w-5 h-5 border-4 mx-2 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
            </div>
          ) : (
            'Login'
          )}
        </Button>

        <p className="text-center mt-3">
          Don't have an account?{' '}
          <span
            className="text-black font-semibold cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Register
          </span>
        </p>
      </form>
    </section>
  );
};

export default Login;
