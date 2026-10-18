import { useState } from 'react';

export function WishesPage() {
  const [form, setForm] = useState({ name: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/rsvp/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
      setForm({ name: '', message: '' });
    } catch {
      alert('Gagal mengirim wishes');
    }
  };

  return (
    <div className="flex flex-col justify-center h-full p-4 overflow-y-auto custom-scroll">
      <h2 className="text-3xl font-display font-bold text-slate-900 mb-6 text-center">Buku Tamu & Doa</h2>
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Nama</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-rose-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Ucapan & Doa</label>
            <textarea
              rows={4}
              required
              value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-rose-600 resize-none"
              placeholder="Tulis doa dan harapan untuk mempelai..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-rose-600 text-white font-medium py-2.5 rounded-lg hover:bg-rose-700 transition text-sm shadow-md"
          >
            Kirim Ucapan
          </button>
        </form>
      ) : (
        <div className="text-center my-auto">
          <div className="text-3xl mb-2">❤️</div>
          <p className="text-sm text-slate-600">Terima kasih atas doa dan harapanmu!</p>
        </div>
      )}

      {/* Wishes list (mock) */}
      <div className="mt-8 space-y-2">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Ucapan dari Tamu</h3>
        {[
          { name: 'Budi Santoso', message: 'Selamat atas pernikahannya! Semoga langgeng sampai bapak ibu.' },
          { name: 'Siti Rahayu', message: 'Doa terbaik untuk Andi & Siska. Semoga sakinah mawaddah rahmah.' },
          { name: 'Ahmad Hidayat', message: 'Kebahagiaan yang luar biasa! Semoga menjadi keluarga yang sakinah.' },
        ].map((wish, i) => (
          <div key={i} className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-xs">
            <p className="font-semibold text-slate-700">{wish.name}</p>
            <p className="text-slate-500 mt-1 italic">"{wish.message}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
