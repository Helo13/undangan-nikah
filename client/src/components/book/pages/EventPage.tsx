import { useAppStore } from '@/store/appStore';

export function EventPage() {
  const content = useAppStore((state) => state.content);

  return (
    <div className="flex flex-col justify-center h-full text-center p-4">
      <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Waktu & Tempat</h2>
      <div className="space-y-6">
        <div className="bg-amber-50/50 border border-amber-200/50 p-4 rounded-xl">
          <h3 className="font-display font-bold text-amber-900 text-base mb-1">Akad Nikah</h3>
          <p className="text-sm text-slate-700">{content?.event?.date || 'Sabtu, 25 Oktober 2026'}</p>
          <p className="text-xs text-slate-500">{content?.event?.ceremonyTime || '08:00 WIB'}</p>
        </div>

        <div className="bg-rose-50/50 border border-rose-200/50 p-4 rounded-xl">
          <h3 className="font-display font-bold text-rose-900 text-base mb-1">Resepsi</h3>
          <p className="text-sm text-slate-700">{content?.event?.date || 'Sabtu, 25 Oktober 2026'}</p>
          <p className="text-xs text-slate-500">{content?.event?.receptionTime || '11:00 - 13:00 WIB'}</p>
        </div>

        <div>
          <h3 className="font-display font-bold text-slate-900 text-sm mb-1">{content?.event?.venue || 'Griya Agung Convention Center'}</h3>
          <p className="text-xs text-slate-500 mb-3">{content?.event?.address || 'Jl. Jendral Sudirman No. 123, Jakarta Selatan'}</p>
          <a
            href={content?.event?.mapUrl || 'https://maps.google.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-slate-900 text-white text-xs px-4 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            Buka di Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
