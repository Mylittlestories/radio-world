import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import StationCard from '../components/StationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { searchStations } from '../lib/radioBrowser';
import type { Station } from '../types';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialQuery.trim()) {
      performSearch(initialQuery.trim());
    }
  }, []);

  const performSearch = async (term: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchStations({ search: term, limit: 50 });
      setStations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;
    setSearchParams({ q: term });
    performSearch(term);
  };

  const clearSearch = () => {
    setQuery('');
    setStations([]);
    setSearchParams({});
    inputRef.current?.focus();
  };

  return (
    <div className="pb-40">
      <div className="sticky top-16 z-20 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/50 px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-xl font-bold text-white mb-3">Search stations</h1>
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Station name, genre, city or country..."
              className="w-full pl-11 pr-10 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/60 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-12 text-red-400">{error}</div>
        ) : stations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stations.map((station, i) => (
              <StationCard key={station.stationuuid} station={station} index={i} />
            ))}
          </div>
        ) : query.trim() && !loading ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-white">No stations found</h2>
            <p className="text-sm text-zinc-400 mt-1">Try a different search term.</p>
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-500">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Type a station name, genre or location to start searching.</p>
          </div>
        )}
      </main>
    </div>
  );
}
