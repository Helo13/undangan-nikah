// Removed unused import
import { useAppStore } from '@/store/appStore';

export function CoverPage() {
  const content = useAppStore((state) => state.content);
  const guestName = useAppStore((state) => state.guestName);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="text-amber-700/80 uppercase tracking-[0.3em] text-xs mb-3 font-serif">
        The Wedding Of
      </div>
      <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-6">
        {content?.couple?.groomName || 'Andi'} & {content?.couple?.brideName || 'Siska'}
      </h1>
      <div className="w-16 h-px bg-amber-400 my-4" />
      <p className="text-slate-600 font-serif italic text-sm max-w-sm mb-8">
        "{content?.quote || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...'}"
      </p>
      {guestName && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl px-4 py-2 mt-auto">
          <span className="text-xs text-slate-500 block">Kepada Yth:</span>
          <span className="font-semibold text-slate-800 text-sm">{guestName}</span>
        </div>
      )}
    </div>
  );
}
