import type { ColumnType } from '../types/type'
import { useState } from 'react'
import { motion } from "motion/react"
import { useBoardStore } from '../store/boardStore'
import { IoMdClose } from "react-icons/io";
import { FiPlus } from "react-icons/fi";

interface AddCardId {
  columnId: number
}

export default function AddCardFrom({ columnId } :AddCardId) {
    const columns = useBoardStore(state => state.columns)
    const addCard = useBoardStore(state => state.addCard)
    const [Open, setOpen] = useState<number | null>(null)
    const [newCardTitle, setNewCardTitle] = useState<string>("");

    const column: ColumnType | undefined  = columns?.find(c => c.id === columnId)

    return (
        <>
            {Open === column?.id ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-2 mt-1"
                  >
                    <input
                      value={newCardTitle}
                      placeholder="Card title..."
                      autoFocus
                      onKeyDown={(e) => {
                        if(e.code === "Enter" && newCardTitle.trim()) {
                          addCard(column?.id, { id: crypto.randomUUID(), text: newCardTitle.trim() })
                          setOpen(null)
                          setNewCardTitle('')
                        }
                        if(e.code === "Escape") {
                          setOpen(null)
                          setNewCardTitle('')
                        }
                      }}
                      onChange={e => setNewCardTitle(e.target.value)}
                      className="text-sm text-accent placeholder:text-muted px-3 py-2 rounded-lg bg-[#f3f3f3] border border-border/60 focus:border-accent/30 focus:outline-none transition-colors"
                    />
                    <div className="flex gap-1.5">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          if(newCardTitle.trim()) {
                            addCard(column?.id, { id: crypto.randomUUID(), text: newCardTitle.trim() })
                            setOpen(null)
                            setNewCardTitle('')
                          }
                        }}
                        className="text-xs text-white bg-accent hover:bg-[#2a2a2a] px-3 py-1.5 rounded-lg transition-colors font-medium flex-1 cursor-pointer"
                      >Add</motion.button>
                      <button 
                        onClick={() => { setOpen(null); setNewCardTitle('') }} 
                        className="text-muted hover:text-accent px-2 transition-colors cursor-pointer"
                      >
                        <IoMdClose size={14} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setOpen(columnId)}
                    className="flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors px-3 py-2 mt-0.5 border border-transparent hover:border-accent/20 rounded-lg"
                  >
                    <FiPlus size={12} />
                    <span className="tracking-wide">Add card</span>
                  </motion.button>
            )}
        </>
    )
}
