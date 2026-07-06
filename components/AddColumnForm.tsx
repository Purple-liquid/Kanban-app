import type { PriorityLevel } from '../types/type'
import { useBoardStore } from '../store/boardStore'
import { motion } from "motion/react"
import { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import PriorityPills from "./PriorityPills";

export default function AddColumnForm() {
    const addColumn = useBoardStore(state => state.addColumn)
    
    const [isOpen, setIsOpen] = useState(false)
    const [newColumnTitle, setNewColumnTitle] = useState<string>("");
    
    const [newColumnPriority, setNewColumnPriority] = useState<PriorityLevel>('Low');

    const hendelAddColumn = () => {
      const titleCol = newColumnTitle.trim()
      if(!titleCol) return

      addColumn({ id: Date.now(), title: titleCol, cards: [], priority: newColumnPriority })
      setIsOpen(false)
      setNewColumnTitle('')
      setNewColumnPriority('Low')
    }

    return (
        <>
            {!isOpen ? (
                <motion.button
                    whileHover={{ borderColor: 'rgba(0, 0, 0, 0.15)' }}
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 text-xs text-muted hover:text-accent transition-colors px-5 py-3 rounded-lg border border-border/60 hover:border-border/40 border-dashed shrink-0 snap-start mt-[2px]"
                >
                    <FiPlus size={14} />
                    <span className="tracking-wide">Add column</span>
                </motion.button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-64 flex-shrink-0 self-start snap-start"
                >
                    <div className="flex flex-col gap-2">
                        <input
                            value={newColumnTitle}
                            placeholder="Column title..."
                            onKeyDown={(e) => { 
                                if(e.code === 'Enter') hendelAddColumn();
                            }}
                            onChange={e => setNewColumnTitle(e.target.value)}
                            className="text-sm text-accent placeholder:text-muted px-3 py-2 rounded-lg bg-[#f3f3f3] border border-border/60 focus:border-accent/30 focus:outline-none transition-colors"
                            autoFocus
                        />
                        <div className="flex flex-col gap-2 p-1.5 rounded-lg">
                            <PriorityPills value={newColumnPriority} onChange={setNewColumnPriority} name="new-column-priority" />
                            <div className="flex gap-1.5 mt-1 pt-1.5">
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => hendelAddColumn()}
                                    className="text-xs text-white bg-accent hover:bg-[#2a2a2a] px-3 py-1.5 rounded-lg transition-colors font-medium flex-1 cursor-pointer"
                                >Add</motion.button>
                                <button 
                                    onClick={() => { setIsOpen(false); setNewColumnTitle(''); setNewColumnPriority('Low'); }} 
                                    className="text-muted hover:text-accent px-2 transition-colors cursor-pointer"
                                >
                                <IoMdClose size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    )
}