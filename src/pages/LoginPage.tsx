import { useState } from 'react';
import { login as apiLogin, register } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { getErrorMessage } from '../lib/utils';
import ErrorBanner from '../components/ErrorBanner';
import { LoaderCircle } from 'lucide-react';
import TailoringResumePreview from '../components/TailoringResumePreview';

function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (mode === 'signin') {
      try {
        setLoading(true);
        const response = await apiLogin(email, password);
        login(response.token);
        navigate('/applications');
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to sign in'));
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const response = await register(name, email, password);
        login(response.token);
        navigate('/applications');
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to create account'));
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className='min-h-screen bg-cream-primary flex justify-center items-center'>
      <div className='flex rounded-2xl overflow-hidden shadow-xl'>
        <div className='relative w-100 bg-linear-150 from-[#4A7059] via-[#3B5B48] to-[#334F41] p-5 overflow-hidden flex flex-col gap-3'>
          <p className='text-white text-lg font-bold z-10'>Parsewell</p>
          <h1 className='text-[#f0f7f0] text-3xl font-bold z-10'>
            Every application, tailored
          </h1>
          <p className='text-[#f0f7f0]/60 z-10'>
            Drop in a job description and Parsewell reshapes your resume for it
            - then keeps the whole search in one place
          </p>
          <div
            className='pointer-events-none absolute -top-28 -right-24 h-72 w-72 rounded-full
                bg-radial from-[#81b482]/55 to-transparent to-70%'
          />
          <div
            className='pointer-events-none absolute -bottom-24 -left-20 h-60 w-60 rounded-full
                bg-radial from-[#c98b5e]/40 to-transparent to-70%'
          />
          <TailoringResumePreview />
        </div>
        <div className='w-100 bg-white py-10 px-10'>
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
                  <div className='font-bold text-white flex justify-center'>
                    {loading ? (
                      <div className='animate-spin w-fit'>
                        <LoaderCircle />
                      </div>
                    ) : (
                      'Sign in'
                    )}
                  </div>
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
                  <div className='font-bold text-white flex justify-center'>
                    {loading ? (
                      <div className='animate-spin w-fit'>
                        <LoaderCircle />
                      </div>
                    ) : (
                      'Create account'
                    )}
                  </div>
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
      {/* <div className='w-100 bg-white border border-subtle-border rounded-r-[25px] flex flex-col items-center p-10 gap-7'>
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
                <div className='font-bold text-white flex justify-center'>
                  {loading ? (
                    <div className='animate-spin w-fit'>
                      <LoaderCircle />
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </div>
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
                <div className='font-bold text-white flex justify-center'>
                  {loading ? (
                    <div className='animate-spin w-fit'>
                      <LoaderCircle />
                    </div>
                  ) : (
                    'Create account'
                  )}
                </div>
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
      </div> */}
    </div>
  );
}

export default LoginPage;
