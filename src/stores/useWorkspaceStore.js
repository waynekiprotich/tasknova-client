import { create } from 'zustand';

export const useWorkspaceStore = create((set) => ({
  activeWorkspaceId: localStorage.getItem('activeWorkspaceId') || null,
  setActiveWorkspaceId: (id) => {
    if (id) {
      localStorage.setItem('activeWorkspaceId', id);
    } else {
      localStorage.removeItem('activeWorkspaceId');
    }
    set({ activeWorkspaceId: id });
  },
}));
