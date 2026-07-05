interface CardType {
    id: number
    text: string
}

interface ColumnType {
    id: number
    title: string
    cards: CardType[]
    priority: PriorityLevel
}

export interface Narrowing {
    id: number
    title: string
}

export type PriorityLevel = 'Low' | 'Medium' | 'High'


export interface BoardStore {
    columns: ColumnType[] | null
    narrowing: Narrowing[] | null
    addCard: (column: number, card: CardType) => void
    addColumn: (column: ColumnType) => void
    folding: (columnId: number) => void
    moveCard: (cardId: number, fromColumnId: number, toColumnId: number) => void
    deleteCard: (columnId: number, cardId: number) => void
    deleteColumn: (columnId: number) => void
    prioritySelection: (columnId: number, priority: PriorityLevel) => void
}