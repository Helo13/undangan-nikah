import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';
export function RSVPPage() {
  const [form, setForm] = useState({
    guest_name: '',
    email: '',
    phone: '',
    attendance: 'attending',
    guests_count: 1,
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      alert('Gagal mengirim RSVP');
    }
  };

  return (
    <div className="flex flex-col justify-center h-full p-2 sm:p-4 overflow-y-auto custom-scroll">
      <h2 className="text-3xl font-display font-bold text-slate-900 mb-4 text-center">Konfirmasi Kehadiran</h2>
      {submitted ? (
        <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl text-center my-auto">
          <p className="font-bold text-lg mb-1">Terima Kasih!</p>
          <p className="text-sm">Konfirmasi kehadiran Anda telah berhasil disimpan.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              value={form.guest_name}
              onChange={e => setForm({...form, guest_name: e.target.value})}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-amber-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Kehadiran</label>
              <select
                value={form.attendance}
                onChange={e => setForm({...form, attendance: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-amber-600"
              >
                <option value="attending">Hadir</option>
                <option value="not_attending">Berhalangan</option>
                <option value="maybe">Ragu-ragu</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Jumlah Tamu</label>
              <input
                type="number"
                min="1"
                max="5"
                value={form.guests_count}
                onChange={e => setForm({...form, guests_count: parseInt(e.target.value)})}
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Pesan & Doa</label>
            <textarea
              rows={3}
              value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-amber-600 resize-none"
              placeholder="Tulis ucapan selamat..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-medium py-2.5 rounded-lg hover:bg-slate-800 transition text-sm shadow-md"
          >
            Kirim Konfirmasi
          </button>
        </form>
      )}
    </div>
  );
}
