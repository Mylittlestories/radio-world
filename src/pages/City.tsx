import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ChevronLeft, Radio } from 'lucide-react';
import StationCard from '../components/StationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { searchStations } from '../lib/radioBrowser';
import { decodeCityParam } from '../lib/utils';
import type { Station } from '../types';

export default function City() {
  const { code, cityName: cityParam } = useParams<{ code: string; cityName: string }>();
  const location = useLocation();
  const cityName = (location.state as { cityName?: string })?.cityName || decodeCityParam(cityParam || '');
  const countryName = (location.state as { countryName?: string })?.countryName || '';
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await searchStations({ countrycode: code, state: cityName, limit: 100 });
        setStations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    if (code && cityName) fetchStations();
  }, [code, cityName]);

  return (
    <div className="pb-40">
      <div className="sticky top-16 z-20 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/50 px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <Link to={`/country/${code}`} state={{ countryName }} className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white mb-2">
            <ChevronLeft className="w-4 h-4" />
            Back to {countryName || 'country'}
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white truncate">{cityName}</h1>
              <p className="text-xs text-zinc-400">
                {loading ? 'Loading stations...' : `${stations.length} station${stations.length === 1 ? '' : 's'}`}
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
        ) : stations.length === 0 ? (
          <div className="text-center py-16">
            <Radio className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-white">No stations found</h2>
            <p className="text-sm text-zinc-400 mt-1">This city may not have any indexed stations right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stations.map((station, i) => (
              <StationCard key={station.stationuuid} station={station} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
