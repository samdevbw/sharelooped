import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, Wallet, CreditCard, 
  TrendingUp, BookOpen, CheckCircle, Mail, Lock, User
} from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase/config';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageSelector from '../../components/common/LanguageSelector';

type AuthMode = 'login' | 'register';

export default function AuthInterface() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(''); // Clear any errors when switching modes
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!fullName.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }
    
    try {
      // 1. Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 2. Update profile with full name
      await updateProfile(user, {
        displayName: fullName
      });
      
      // 3. Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email,
        full_name: fullName,
        created_at: serverTimestamp(),
        // Default user preferences
        preferences: {
          emailNotifications: true,
          pushNotifications: true,
          darkMode: false,
          language: 'english'
        }
      });
      
      // 4. Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(parseFirebaseError(error.code) || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(parseFirebaseError(error.code) || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if this is a new user
      // @ts-ignore - _tokenResponse is not in the types but it exists
      const isNewUser = result._tokenResponse?.isNewUser;
      
      if (isNewUser) {
        // Create user document in Firestore for new users
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          email: user.email,
          full_name: user.displayName,
          created_at: serverTimestamp(),
          preferences: {
            emailNotifications: true,
            pushNotifications: true,
            darkMode: false,
            language: 'english'
          }
        });
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setError(parseFirebaseError(error.code) || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Parse Firebase error codes into user-friendly messages
  const parseFirebaseError = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email address is already in use.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completing the process.';
      default:
        return '';
    }
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    if (mode === 'login') {
      handleLogin(e);
    } else {
      handleRegister(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header with language selector */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      {/* Logo and Title */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Wallet className="h-10 w-10 text-indigo-600" />
            <span className="text-3xl font-bold text-indigo-600">Share Looped</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'login' ? t('auth.login') : t('auth.register')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {mode === 'login' ? (
            <>
              {t('auth.dontHaveAccount')}{' '}
              <button 
                onClick={toggleMode}
                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
              >
                {t('auth.register')}
              </button>
            </>
          ) : (
            <>
              {t('auth.alreadyHaveAccount')}{' '}
              <button 
                onClick={toggleMode}
                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
              >
                {t('auth.login')}
              </button>
            </>
          )}
        </p>
      </div>

      {/* Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Error message */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 11a1 1 0 10-2 0v2a1 1 0 102 0v-2zm0-5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  {t('auth.fullName')}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('auth.email')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="your-email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.password')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === 'login' ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    {t('auth.rememberMe')}
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    {t('auth.forgotPassword')}
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {mode === 'login' ? 'Signing in...' : 'Registering...'}
                  </span>
                ) : (
                  mode === 'login' ? t('auth.login') : t('auth.register')
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Sign in with Google</span>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.152-2.675-6.735-2.675-5.522 0-10 4.479-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-0.668-0.069-1.325-0.189-1.961h-9.811z"
                  />
                </svg>
                {loading ? 'Processing...' : 'Continue with Google'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-12 px-4 sm:px-0">
        <h3 className="text-center text-lg font-medium text-gray-900">
          Why choose Share Looped?
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <TrendingUp className="h-10 w-10 text-indigo-600" />
            <h4 className="mt-2 text-lg font-medium text-gray-900">Smart Investing</h4>
            <p className="mt-1 text-sm text-gray-600">
              AI-powered recommendations tailored to your goals
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <CreditCard className="h-10 w-10 text-indigo-600" />
            <h4 className="mt-2 text-lg font-medium text-gray-900">Diverse Options</h4>
            <p className="mt-1 text-sm text-gray-600">
              Stocks, crypto, ETFs, and more in one place
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <CheckCircle className="h-10 w-10 text-indigo-600" />
            <h4 className="mt-2 text-lg font-medium text-gray-900">Secure</h4>
            <p className="mt-1 text-sm text-gray-600">
              Bank-level security for your investments
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <BookOpen className="h-10 w-10 text-indigo-600" />
            <h4 className="mt-2 text-lg font-medium text-gray-900">Learn & Grow</h4>
            <p className="mt-1 text-sm text-gray-600">
              Educational resources for all experience levels
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Share Looped. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="#" className="hover:text-indigo-600">Terms</a>
          <a href="#" className="hover:text-indigo-600">Privacy</a>
          <a href="#" className="hover:text-indigo-600">Security</a>
          <a href="#" className="hover:text-indigo-600">Contact</a>
        </div>
      </div>
    </div>
  );
}