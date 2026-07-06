import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Radio, Chrome, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import supabase from '../lib/supabase';
import { signInWithGoogle } from '../lib/googleAuth';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setError('Check your email to confirm your account.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/favorites');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-rose-500/20">
            <Radio className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">{isSignUp ? 'Create account' : 'Welcome back'}</h1>
          <p className="text-sm text-zinc-400 mt-1">Save favorites and sync across devices</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/60 transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-11 pr-11 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/60 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className={`text-sm text-center ${error.includes('Check your email') ? 'text-emerald-400' : 'text-red-400'}`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-zinc-700 text-white rounded-xl font-semibold transition-colors"
          >
            {loading ? 'Please wait...' : isSignUp ? 'Sign up' : 'Sign in'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
          <div className="relative flex justify-center"><span className="px-3 bg-zinc-900 text-xs text-zinc-500">or</span></div>
        </div>

        <button
          onClick={() => signInWithGoogle('Radio World')}
          className="w-full py-3 bg-white hover:bg-zinc-100 text-zinc-900 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Chrome className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-zinc-400 mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            className="text-rose-400 hover:text-rose-300 font-medium"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>

        <Link to="/" className="block text-center text-sm text-zinc-500 hover:text-zinc-300 mt-4">
          ← Back to stations
        </Link>
      </motion.div>
    </div>
  );
}
