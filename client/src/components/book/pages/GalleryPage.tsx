import { useState, useEffect } from 'react';

export function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/media/gallery?category=gallery')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setImages(data);
        } else {
          setImages([
            { id: 1, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800' },
            { id: 2, url: 'https://images.unsplash.com/photo-1522673607200-1645062cd99a?auto=format&fit=crop&q=80&w=800' },
            { id: 3, url: 'https://images.unsplash.com/photo-1516723666632-5150510414c4?auto=format&fit=crop&q=80&w=800' },
            { id: 4, url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34681c?auto=format&fit=crop&q=80&w=800' },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col justify-center h-full p-2 sm:p-4">
      <h2 className="text-3xl font-display font-bold text-slate-900 mb-6 text-center">Galeri Momen</h2>
      <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[70vh] custom-scroll pr-1">
        {images.map((img) => (
          <div key={img.id} className="aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-sm">
            <img src={img.url} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
