import { useEffect, useState } from 'react';
import { Search, Globe, TrendingUp, Trophy, Radio, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountryCard from '../components/CountryCard';
import StationCard from '../components/StationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCountries, searchStations, getMostPlayed, getTopVoted, getTags } from '../lib/radioBrowser';
import type { Country, Station } from '../types';

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [trending, setTrending] = useState<Station[]>([]);
  const [topVoted, setTopVoted] = useState<Station[]>([]);
  const [mostPlayed, setMostPlayed] = useState<Station[]>([]);
  const [tags, setTags] = useState<{ name: string; stationcount: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cData, tData, vData, pData, tagData] = await Promise.all([
          getCountries(),
          searchStations({ limit: 6 }),
          getTopVoted(6),
          getMostPlayed(6),
          getTags(12),
        ]);
        setCountries(cData.slice(0, 24));
        setTrending(tData.slice(0, 6));
        setTopVoted(vData.slice(0, 6));
        setMostPlayed(pData.slice(0, 6));
        setTags(tagData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner full />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div className="max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Could not load radio directory</h2>
          <p className="text-zinc-400 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-40">
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-purple-700 to-indigo-900 px-4 py-10 sm:py-14">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-5xl mx-auto relative">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Every station, everywhere.
          </h1>
          <p className="text-rose-100 text-base sm:text-lg max-w-xl mb-6">
            Browse thousands of live radio stations from every country, city, and genre around the world.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-zinc-900 rounded-xl font-semibold shadow-lg hover:bg-zinc-100 transition-colors"
          >
            <Search className="w-5 h-5" />
            Find a station
          </Link>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        {tags.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Headphones className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Browse by genre</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.name}
                  to={`/search?q=${encodeURIComponent(tag.name)}`}
                  className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 hover:border-rose-500/50 hover:text-white transition-colors"
                >
                  {tag.name}
                  <span className="ml-1.5 text-zinc-500 text-xs">{tag.stationcount.toLocaleString()}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {trending.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white">Trending now</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trending.map((station, i) => (
                <StationCard key={station.stationuuid} station={station} index={i} />
              ))}
            </div>
          </section>
        )}

        {mostPlayed.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white">Most played</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mostPlayed.map((station, i) => (
                <StationCard key={station.stationuuid} station={station} index={i} />
              ))}
            </div>
          </section>
        )}

        {topVoted.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Top voted</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topVoted.map((station, i) => (
                <StationCard key={station.stationuuid} station={station} index={i} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Browse by country</h2>
            </div>
            <Link to="/search" className="text-sm text-rose-400 hover:text-rose-300 font-medium">
              Search all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {countries.map((country, i) => (
              <CountryCard key={country.iso_3166_1} country={country} index={i} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
