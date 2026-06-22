interface CardType {
    id: number
    text: string
}

interface ColumnType {
    id: number
    title: string
    cards: CardType[]
}

export interface BoardStore {
    columns: ColumnType[] | null
    addCard: (column: number, card: CardType) => void
    addColumn: (column: ColumnType) => void
    moveCard: (cardId: number, fromColumnId: number, toColumnId: number) => void
    deleteCard: (columnId: number, cardId: number) => void
    deleteColumn: (columnId: number) => void
}