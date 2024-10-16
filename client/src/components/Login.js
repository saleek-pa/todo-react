import React, { useContext, useState } from 'react';
import { TodoContext } from '../context/Context';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(TodoContext);
  const [email, setEmail] = useState('user@gmail.com');
  const [password, setPassword] = useState('1234');

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      await login(email, password);
      toast.success('Login successful');

      setEmail('');
      setPassword('');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            placeholder="********"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 transition-all hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Login
        </button>

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
