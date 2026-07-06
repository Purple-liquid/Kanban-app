import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BoardStore, Narrowing } from '../types/type'

export const useBoardStore = create<BoardStore>()(
  persist(
    (set) => (
      {
        columns: [],

        narrowing: [],

        newColumnPriority: 'Low',

        editingColumn: false,

        addCard: (columnId, card) => set((state) => ({ 
          columns: state.columns === null 
            ? null 
            : state.columns.map((col) => 
              col.id === columnId ? { ...col, cards: [...col.cards, card] } : col
            )
        })),

        addColumn: (column) => set((state) => ({ 
          columns: state.columns === null 
          ? [column]
          : [...state.columns, column]
        })),

        folding: (columnId: number) => set((state) => {
          const Nar: Narrowing[] = state.narrowing || [];

          const isNarrowed = Nar.some((n) => n.id === columnId);
          
          const nextNarrowing: Narrowing[] = isNarrowed
            ? Nar.filter((n) => n.id !== columnId)
            : [...Nar, { id: columnId } as Narrowing];

          return {
            narrowing: nextNarrowing
          };
        }),

        moveCard: (cardId, fromColumnId, toColumnId) => set((state) => { 
          if (state.columns === null) return { columns: null }

          const from = state.columns.find(col => col.id === fromColumnId)
          const card = from?.cards.find(c => c.id === cardId)
          if(!card) return { columns: state.columns }

          const updated = state.columns.map((col) => {
              if (col.id === fromColumnId) {
                  return {
                      ...col,
                      cards: col.cards.filter((c) => c.id !== cardId)
                  }
              }

              if(col.id === toColumnId) {
                  return {
                      ...col,
                      cards: [...col.cards, card]
                  }
              }

              return col;
              })
              return { columns: updated }
          }),

        deleteCard: (columnId, cardId) => set((state) => ({  
          columns: state.columns === null
          ? null
          : state.columns.map((col) =>
              col.id === columnId ? {...col, cards: col.cards.filter(c => c.id !== cardId)} : col
          )
        })),

        deleteColumn: (columnId) => set((state) => ({ 
          columns: state.columns === null
          ? null
          : state.columns.filter(col => col.id !== columnId)
        })),

        prioritySelection: (columnId, priority) => set((state) => ({
          columns: state.columns === null
          ? null
          : state.columns.map((col) => 
            col.id === columnId 
              ? { ...col, priority: priority || 'Low' } 
              : col
          )
        })),

        setNewColumnPriority: (priority) => set({ newColumnPriority: priority}),
        
        
        setEditingColumn: (columnId, t) => set((state) => ({
          columns: state.columns?.map((col) => 
            col.id === columnId ? { ...col, title: t } : col
          ) ?? null
        })),

        setAddEditingColumn: (columnId, x) => set((state) => ({
          columns: state.columns === null
          ? null
          : state.columns.map((col) => 
            col.id === columnId 
              ? { ...col, editingColumn: x }
          : col
        )})),
}),
{
  name: 'save-kanban-columns'
}
))