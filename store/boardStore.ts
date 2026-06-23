import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BoardStore } from '../types/type'

export const useStoreAddCard = create<BoardStore>()(
  persist(
    (set) => (
      {
        columns: [],

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
}),
{
  name: 'save-kanban-columns'
}
))