import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart } from 'lucide-react';

export default function BottomNav() {
  const { pathname } = useLocation();

  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/favorites', icon: Heart, label: 'Favorites' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/50 pb-safe">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-around">
        {links.map((link) => {
          const active = pathname === link.to || pathname.startsWith(`${link.to}/`);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
                active ? 'text-rose-500' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <link.icon className={`w-5 h-5 ${active ? 'fill-current' : ''}`} />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
