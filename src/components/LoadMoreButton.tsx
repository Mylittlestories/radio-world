import { Loader2 } from 'lucide-react';

interface LoadMoreButtonProps {
  onClick: () => void;
  loading: boolean;
  hasMore: boolean;
}

export default function LoadMoreButton({ onClick, loading, hasMore }: LoadMoreButtonProps) {
  if (!hasMore) return null;
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center justify-center gap-2"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {loading ? 'Loading more...' : 'Load more stations'}
    </button>
  );
}
