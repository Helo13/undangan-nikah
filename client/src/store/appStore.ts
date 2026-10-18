import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export enum AppPhase {
  LOADING = 'loading',
  ENVELOPE = 'envelope',       // Welcome screen (amplop 3D)
  OPENING = 'opening',         // Animasi amplop terbuka
  TRANSITION = 'transition',   // Zoom kertas ke kamera
  BOOK = 'book',               // Mode buku page-flip
}

export interface WeddingContent {
  couple?: {
    groomName: string;
    brideName: string;
    groomFullName: string;
    brideFullName: string;
    groomParents: string;
    brideParents: string;
    groomPhoto?: string;
    bridePhoto?: string;
  };
  event?: {
    date: string;
    ceremonyTime: string;
    receptionTime: string;
    venue: string;
    address: string;
    mapUrl: string;
  };
  quote?: string;
  gallery?: string[];
}

interface AppState {
  phase: AppPhase;
  setPhase: (phase: AppPhase) => void;
  transitionTo: (phase: AppPhase, delay?: number) => void;

  guestName: string;
  setGuestName: (name: string) => void;

  currentPage: number;
  totalPages: number;
  isFlipping: boolean;
  flipDirection: 'forward' | 'backward';
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setFlipping: (v: boolean) => void;

  content: WeddingContent | null;
  contentLoaded: boolean;
  loadContent: () => Promise<void>;

  musicPlaying: boolean;
  toggleMusic: () => void;
  startMusic: () => void;
}

export const useAppStore = create<AppState>()(
  devtools((set, get) => ({
    phase: AppPhase.LOADING,
    setPhase: (phase) => set({ phase }),
    transitionTo: (phase, delay = 0) => {
      setTimeout(() => set({ phase }), delay);
    },

    guestName: '',
    setGuestName: (name) => set({ guestName: name }),

    currentPage: 0,
    totalPages: 6,
    isFlipping: false,
    flipDirection: 'forward',
    setPage: (page) => {
      const { currentPage } = get();
      if (page === currentPage) return;
      set({
        flipDirection: page > currentPage ? 'forward' : 'backward',
        currentPage: Math.max(0, Math.min(page, get().totalPages - 1)),
        isFlipping: true,
      });
      setTimeout(() => set({ isFlipping: false }), 900);
    },
    nextPage: () => {
      const { currentPage, totalPages } = get();
      if (currentPage < totalPages - 1 && !get().isFlipping) {
        get().setPage(currentPage + 1);
      }
    },
    prevPage: () => {
      const { currentPage } = get();
      if (currentPage > 0 && !get().isFlipping) {
        get().setPage(currentPage - 1);
      }
    },
    setFlipping: (v) => set({ isFlipping: v }),

    content: null,
    contentLoaded: false,
    loadContent: async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = await res.json();
          set({ content: data, contentLoaded: true });
        } else {
          set({ contentLoaded: true });
        }
      } catch {
        set({ contentLoaded: true });
      }
    },

    musicPlaying: false,
    toggleMusic: () => set((s) => ({ musicPlaying: !s.musicPlaying })),
    startMusic: () => set({ musicPlaying: true }),
  }))
);
