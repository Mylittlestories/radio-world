import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Country } from '../types';
import { formatNumber } from '../lib/utils';

const countryFlagEmoji = (code: string) => {
  const base = 127397;
  return code
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(base + char.charCodeAt(0)))
    .join('');
};

export default function CountryCard({ country, index }: { country: Country; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
    >
      <Link
        to={`/country/${country.iso_3166_1}`}
        state={{ countryName: country.name }}
        className="group flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 hover:border-rose-500/40 hover:bg-zinc-800/60 transition-all"
      >
        <div className="text-3xl leading-none">{countryFlagEmoji(country.iso_3166_1)}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate group-hover:text-rose-400 transition-colors">
            {country.name}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {formatNumber(country.stationcount)} station{country.stationcount === 1 ? '' : 's'}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-rose-500/20 group-hover:text-rose-400 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}
