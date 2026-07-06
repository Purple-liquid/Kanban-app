import type { CardType } from '../types/type'
import { motion, AnimatePresence } from "motion/react"
import { useBoardStore } from '../store/boardStore'

interface CardId {
  columnId: number
}

export default function Card({ columnId } : CardId) {
  const columns = useBoardStore(state => state.columns)
  const moveCard = useBoardStore(state => state.moveCard)
  const deleteCard = useBoardStore(state => state.deleteCard)

  const column = columns?.find(c => c.id === columnId)

  return(
    <AnimatePresence mode="popLayout">
      {column?.cards.map((card: CardType) => (
        <motion.div key={card.id} layoutId={String(card.id)}
          layout
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
          drag
          dragSnapToOrigin
          dragElastic={0.3}
          whileDrag={{
            scale: 1.02,
            zIndex: 50,
            rotate: -1,
            cursor: 'grabbing',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.06)'
          }}
          onDragEnd={(_, info) => {
            const els = document.elementsFromPoint(info.point.x, info.point.y)
            const targetCol = els.find(el => el instanceof HTMLElement && el.dataset.columnId)
            if(!targetCol) return
            const toColumnId = Number((targetCol as HTMLElement).dataset.columnId)
            if(toColumnId && toColumnId !== column.id) {
              moveCard(card.id, column.id, toColumnId)
            }
          }}
          className="group/card relative cursor-grab active:cursor-grabbing"
        >
          <div className="px-3 py-2.5 rounded-lg bg-surface border border-border hover:border-black/10 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm text-accent leading-relaxed min-w-0 break-all flex-1">{card.text}</span>
              <motion.button
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => deleteCard(column.id, card.id)}
                className="opacity-0 group-hover/card:opacity-100 cursor-pointer text-muted hover:text-red-400 transition-all p-0.5 shrink-0 mt-0.5"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="2" y1="2" x2="8" y2="8" />
                  <line x1="8" y1="2" x2="2" y2="8" />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
