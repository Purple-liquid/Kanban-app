export interface CardType {
    id: number
    text: string
}

export interface ColumnType {
    id: number
    title: Title
    cards: CardType[]
    priority: PriorityLevel
    editingColumn?: boolean;
}

export type Title = string

export interface Narrowing {
    id: number
    title: string
}

export type PriorityLevel = 'Low' | 'Medium' | 'High'


export interface BoardStore {
    columns: ColumnType[] | null
    narrowing: Narrowing[] | null
    newColumnPriority: PriorityLevel
    addCard: (column: number, card: CardType) => void
    addColumn: (column: ColumnType) => void
    folding: (columnId: number) => void
    moveCard: (cardId: number, fromColumnId: number, toColumnId: number) => void
    deleteCard: (columnId: number, cardId: number) => void
    deleteColumn: (columnId: number) => void
    prioritySelection: (columnId: number, priority: PriorityLevel) => void
    setNewColumnPriority: (priority: PriorityLevel) => void
    setEditingColumn: (columnId: number, t: Title) => void
    setAddEditingColumn: (columnId: number, x: boolean) => void
}