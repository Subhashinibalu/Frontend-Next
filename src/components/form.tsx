import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import { BsArrowLeft } from 'react-icons/bs';
import logindata from '../server/client/login';
import registerdata from '../server/client/register';
import Cookies from 'js-cookie';

const Form = ({ pagetype }) => {
  const router = useRouter(); // Initialize the router
  const [loginFormData, setLoginFormData] = useState({ email: '', password: '' });
  const [registerFormData, setRegisterFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleLoginChange = (e) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterFormData({ ...registerFormData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    let response;

    try {
      if (pagetype === 'login') {
        response = await logindata(loginFormData);
        const data = await response.json();

        if (data.token) {
          Cookies.set('authToken', data.token);
          setLoading(true);
          setSuccess('Login successful!');
          setTimeout(()=>{
            router.push('/'); // Navigate to the home page
            setLoading(false);
          },2000)
        } else {
          throw new Error(data.message || 'Login failed');
        }
      } else if (pagetype === 'register') {
        response = await registerdata(registerFormData);
        const data = await response.json();
        console.log(data);
        if (data.success) {
          setSuccess('Registration successful! Please log in.');
        } else {
          throw new Error(data.message || 'Registration failed');
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md p-10 rounded-lg shadow-2xl">
        <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-blue-700">
          {pagetype === 'login' ? 'Login' : pagetype === 'register' ? 'Register' : 'Forgot Password'}
        </h2>

        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && <div className="text-green-500 text-center">{success}</div>}

        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          {pagetype === 'register' && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleRegisterChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          )}

          {pagetype === 'login' && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={handleLoginChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              {pagetype === 'login' ? 'Password' : 'Create Password'}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              onChange={pagetype === 'login' ? handleLoginChange : handleRegisterChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          {pagetype === 'login' && (
            <div className="text-sm">
              <a href="/forget" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="flex  w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
           disabled={loading} >
              {loading?"Wait..."
  :pagetype === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          {pagetype === 'login' ? "Don't have an account?" : 'Already have an account?'}
          {' '}
          {(pagetype === 'login' || pagetype === 'register') && (
            <a
              href={pagetype === 'login' ? '/register' : '/login'}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              {pagetype === 'login' ? 'Register' : 'Login'}
            </a>
          )}
          {pagetype === 'forget' && (
            <a href="/login" className="text-blue-800 text-2xl">
              <BsArrowLeft />
            </a>
          )}
        </p>
      </div>
    </div>
  );
};

export default Form;
