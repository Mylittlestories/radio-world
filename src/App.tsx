import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { PlayerProvider } from './contexts/PlayerContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Player from './components/Player';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Country from './pages/Country';
import City from './pages/City';
import SearchPage from './pages/Search';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <PlayerProvider>
          <HashRouter>
            <div className="min-h-screen bg-zinc-950 text-zinc-100">
              <Header />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/country/:code" element={<Country />} />
                  <Route path="/city/:code/:cityName" element={<City />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </main>
              <Player />
              <BottomNav />
            </div>
          </HashRouter>
        </PlayerProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
