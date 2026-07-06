import { Link } from 'react-router-dom';
import { Radio, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:shadow-rose-500/30 transition-shadow">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Radio World</h1>
            <p className="text-[10px] text-zinc-400 leading-tight">Global stations</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
