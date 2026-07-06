import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ChevronLeft, MapPin } from 'lucide-react';
import CityCard from '../components/CityCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCountries, getCities } from '../lib/radioBrowser';
import type { City } from '../types';

export default function Country() {
  const { code } = useParams<{ code: string }>();
  const location = useLocation();
  const [countryName, setCountryName] = useState((location.state as { countryName?: string })?.countryName || '');
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        let name = countryName;
        if (!name && code) {
          const countries = await getCountries();
          const match = countries.find((c) => c.iso_3166_1 === code);
          if (match) {
            name = match.name;
            setCountryName(name);
          }
        }
        if (!name) throw new Error('Country not found');
        const data = await getCities(name);
        setCities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div className="pb-40">
      <div className="sticky top-16 z-20 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/50 px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white mb-2">
            <ChevronLeft className="w-4 h-4" />
            Back to countries
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{countryName}</h1>
              <p className="text-xs text-zinc-400">
                {loading ? 'Loading cities...' : `${cities.length} city${cities.length === 1 ? '' : 'ies'} & regions`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-12 text-red-400">{error}</div>
        ) : cities.length === 0 ? (
          <div className="text-center py-16">
            <MapPin className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-white">No cities found</h2>
            <p className="text-sm text-zinc-400 mt-1">Try searching for a station instead.</p>
            <Link to="/search" className="mt-4 inline-block px-5 py-2 bg-rose-500 text-white rounded-xl text-sm font-medium">
              Search stations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cities.map((city, i) => (
              <CityCard key={city.name} city={city} countryCode={code || ''} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
