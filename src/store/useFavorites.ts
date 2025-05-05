import { create } from 'zustand';

type FavoriteStore = {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  loadFavorites: () => void;
};

export const useFavorites = create<FavoriteStore>((set, get) => ({
  favorites: [],

  loadFavorites: () => {
    const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
    set({ favorites: stored });
  },

  addFavorite: (id: string) => {
    const updated = [...get().favorites, id];
    set({ favorites: updated });
    localStorage.setItem('favorites', JSON.stringify(updated));
  },

  removeFavorite: (id: string) => {
    const updated = get().favorites.filter((fav) => fav !== id);
    set({ favorites: updated });
    localStorage.setItem('favorites', JSON.stringify(updated));
  },

  isFavorite: (id: string) => get().favorites.includes(id),
}));