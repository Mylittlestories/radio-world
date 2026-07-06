import { Radio } from 'lucide-react';

export default function LoadingSpinner({ full = false }: { full?: boolean }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 text-zinc-400">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-zinc-700 border-t-rose-500 animate-spin" />
        <Radio className="w-4 h-4 absolute inset-0 m-auto text-rose-500" />
      </div>
      <span className="text-sm">Loading stations…</span>
    </div>
  );

  if (full) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        {content}
      </div>
    );
  }

  return <div className="py-12 flex justify-center">{content}</div>;
}
