import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { City } from '../types';
import { formatNumber, encodeCityParam } from '../lib/utils';

export default function CityCard({ city, countryCode, index }: { city: City; countryCode: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
    >
      <Link
        to={`/city/${countryCode}/${encodeCityParam(city.name)}`}
        state={{ cityName: city.name, countryName: city.country }}
        className="group flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 hover:border-cyan-500/40 hover:bg-zinc-800/60 transition-all"
      >
        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
            {city.name}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {formatNumber(city.stationcount)} station{city.stationcount === 1 ? '' : 's'}
          </p>
        </div>
        <div className="text-zinc-500 group-hover:text-cyan-400 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}
