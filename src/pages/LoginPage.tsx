import { useState } from 'react';
import { login as apiLogin, register } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { getErrorMessage } from '../lib/utils';
import ErrorBanner from '../components/ErrorBanner';

function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (mode === 'signin') {
      try {
        const response = await apiLogin(email, password);
        login(response.token);
        navigate('/applications');
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to sign in'));
      }
    } else {
      try {
        const response = await register(name, email, password);
        login(response.token);
        navigate('/applications');
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to create account'));
      }
    }
  }

  return (
    <div className='min-h-screen bg-cream-primary flex justify-center items-center'>
      <div className='w-100 bg-white border border-subtle-border rounded-[25px] flex flex-col items-center p-10 gap-7'>
        {mode === 'signin' && (
          <>
            <div className='flex flex-col items-center gap-2'>
              <h2 className='text-2xl font-bold'>Parsewell</h2>
              <p className='text-secondary-text'>Sign into your account</p>
            </div>
            <ErrorBanner message={error} onDismiss={() => setError('')} />
            <form
              className='flex flex-col w-full gap-4'
              onSubmit={handleSubmit}
            >
              <input
                type='text'
                placeholder='Email'
                className='bg-cream-primary border border-input-border p-3 rounded-xl'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type='password'
                placeholder='Password'
                className='bg-cream-primary border border-input-border p-3 rounded-xl'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type='submit'
                className='bg-[#7FA687] p-3 rounded-xl hover:bg-[#6D9476] cursor-pointer'
              >
                <span className='font-bold text-white'>Sign in</span>
              </button>
            </form>
            <p className='text-secondary-text'>
              Don't have an account?{' '}
              <button
                className='text-[#345F3E] underline'
                onClick={() => {
                  setError('');
                  setMode('signup');
                }}
              >
                Sign up
              </button>
            </p>
          </>
        )}
        {mode === 'signup' && (
          <>
            <div className='flex flex-col items-center gap-2'>
              <h2 className='text-2xl font-bold'>Parsewell</h2>
              <p className='text-secondary-text'>Sign into your account</p>
            </div>
            <ErrorBanner message={error} onDismiss={() => setError('')} />
            <form
              className='flex flex-col w-full gap-4'
              onSubmit={handleSubmit}
            >
              <input
                type='text'
                placeholder='First name'
                className='bg-cream-primary border border-input-border p-3 rounded-xl'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type='text'
                placeholder='Email'
                className='bg-cream-primary border border-input-border p-3 rounded-xl'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type='password'
                placeholder='Password'
                className='bg-cream-primary border border-input-border p-3 rounded-xl'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type='submit'
                className='bg-[#7FA687] p-3 rounded-xl hover:bg-[#6D9476] cursor-pointer'
              >
                <span className='font-bold text-white'>Create account</span>
              </button>
            </form>
            <p className='text-secondary-text'>
              Already have an account?{' '}
              <button
                className='text-[#345F3E] underline'
                onClick={() => {
                  setError('');
                  setMode('signin');
                }}
              >
                Sign in
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
