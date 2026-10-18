import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';

interface PageFlipBookProps {
  pages: React.ReactNode[];
}

export function PageFlipBook({ pages }: PageFlipBookProps) {
  const { currentPage, prevPage, nextPage, flipDirection, isFlipping } = useAppStore();

  return (
    <div className="fixed inset-0 bg-[#0f0e17] flex items-center justify-center p-4 sm:p-8 perspective-[2000px] overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-200 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-300 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-5xl aspect-[3/4] sm:aspect-video flex shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]">
        
        {/* Left Side (Static for desktop, single page for mobile) */}
        <div className="hidden sm:block relative flex-1 bg-white border-r border-slate-100 overflow-hidden rounded-l-2xl">
           <div className="absolute inset-0 bg-gradient-to-r from-slate-200/50 to-transparent w-12 z-10" />
           <div className="w-full h-full p-8 overflow-y-auto custom-scroll">
              {pages[currentPage]}
           </div>
        </div>

        {/* Right Side / Flipping Side */}
        <div className="relative flex-1 bg-white overflow-hidden rounded-r-2xl sm:rounded-l-none">
          <div className="absolute inset-0 bg-gradient-to-l from-slate-200/50 to-transparent w-12 z-10 hidden sm:block" />
          
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentPage + (sm() ? 1 : 0)}
              initial={{ rotateY: flipDirection === 'forward' ? 90 : -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: flipDirection === 'forward' ? -90 : 90, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.45, 0, 0.55, 1] }}
              className="w-full h-full p-6 sm:p-12 overflow-y-auto custom-scroll origin-left"
              style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
            >
              {currentPage + 1 < pages.length ? pages[currentPage + 1] : <div className="flex items-center justify-center h-full text-slate-300 italic italic">Akhir Undangan</div>}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Overlays */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-24 z-20 flex items-center justify-center">
           <button 
             onClick={prevPage}
             disabled={currentPage === 0 || isFlipping}
             className="w-10 h-10 sm:w-12 sm:h-12 bg-white/80 border border-slate-200 rounded-full shadow-xl flex items-center justify-center hover:bg-white transition-all disabled:opacity-0"
           >
             <span className="text-xl">←</span>
           </button>
        </div>
        <div className="absolute inset-y-0 right-0 w-16 sm:w-24 z-20 flex items-center justify-center">
           <button 
             onClick={nextPage}
             disabled={currentPage >= pages.length - 2 || isFlipping}
             className="w-10 h-10 sm:w-12 sm:h-12 bg-white/80 border border-slate-200 rounded-full shadow-xl flex items-center justify-center hover:bg-white transition-all disabled:opacity-0"
           >
             <span className="text-xl">→</span>
           </button>
        </div>

        {/* Book Spine */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-200/50 z-30 hidden sm:block" />
      </div>

      {/* Page Counter */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/60 text-xs tracking-widest uppercase">
        Halaman {currentPage + 1} / {pages.length}
      </div>
    </div>
  );
}

function sm() {
  return typeof window !== 'undefined' && window.innerWidth >= 640;
}
