import { useAppStore } from '@/store/appStore';

export function CouplePage() {
  const content = useAppStore((state) => state.content);

  return (
    <div className="flex flex-col justify-center h-full text-center p-4">
      <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Mempelai</h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="w-24 h-28 mx-auto bg-slate-200 rounded-xl overflow-hidden mb-3 shadow-md">
            <img src={content?.couple?.groomPhoto || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=400'} alt="Groom" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900">{content?.couple?.groomFullName || 'Andi Pratama, S.T.'}</h3>
          <p className="text-xs text-slate-500 mt-1">{content?.couple?.groomParents || 'Putra dari Bpk. Budiman & Ibu Siti'}</p>
        </div>

        <div className="text-amber-600 font-display italic text-lg">&</div>

        <div>
          <div className="w-24 h-28 mx-auto bg-slate-200 rounded-xl overflow-hidden mb-3 shadow-md">
            <img src={content?.couple?.bridePhoto || 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=400'} alt="Bride" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900">{content?.couple?.brideFullName || 'Siska Amelia, S.E.'}</h3>
          <p className="text-xs text-slate-500 mt-1">{content?.couple?.brideParents || 'Putri dari Bpk. Hartono & Ibu Lilis'}</p>
        </div>
      </div>
    </div>
  );
}
