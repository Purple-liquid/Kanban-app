import { useBoardStore } from '../store/boardStore'
import { motion, AnimatePresence } from "motion/react"

import { BsArrowsCollapseVertical } from "react-icons/bs";
import { TfiSplitH } from "react-icons/tfi";
import { CiEdit } from "react-icons/ci";
import Card from "./Card";
import AddCardFrom from "./AddCardFrom";
import PriorityPills from "./PriorityPills";
import { useState } from 'react';



export default function Column() {
    const [newToggle, setNewToggle] = useState<string>('')

    const columns = useBoardStore(state => state.columns)
    const narrowing = useBoardStore(state => state.narrowing)
    const setEditingColumn = useBoardStore(state => state.setEditingColumn)
    const setAddEditingColumn = useBoardStore(state => state.setAddEditingColumn)
    
    const folding = useBoardStore(state => state.folding)
    const deleteColumn = useBoardStore(state => state.deleteColumn)
    const prioritySelection = useBoardStore(state => state.prioritySelection)
    
    const repaint = (priority: 'Low' | 'Medium' | 'High' | undefined | null) => {
      if (priority === "Low") return "bg-emerald-500"
      if (priority === "Medium") return "bg-amber-500"
      if (priority === "High") return "bg-rose-500"
      
      return "bg-emerald-500" 
    }

    return (
        <AnimatePresence mode="popLayout">
            {columns?.map(col => {
              const isColumnNarrowed = narrowing?.some(n => n.id === col.id);

              const isCurrentColumnEditing = !!col.editingColumn;

              const hendelEditingColumn = () => {
                const titleCol = newToggle.trim();
                if (!titleCol) return;

                setEditingColumn(col.id, titleCol);
                setAddEditingColumn(col.id, false);
                setNewToggle('');
              };

              return (
                <motion.div key={col.id} data-column-id={col.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`flex-shrink-0 w-auto self-start p-3 rounded-lg snap-start bg-[#F7FAFA] group ${isColumnNarrowed ? 'w-14' : 'w-64'}`}
                >
                  {isColumnNarrowed ? (
                    <div className="flex flex-col items-center gap-3 pt-1" data-column-id={col.id}>
                      <div className={`w-10 h-1 transition-colors  ${repaint(col.priority)} rounded-full shrink-0 `} />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteColumn(col.id)}
                        className="cursor-pointer text-muted hover:text-red-400 transition-colors p-1"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <line x1="3" y1="3" x2="9" y2="9" />
                          <line x1="9" y1="3" x2="3" y2="9" />
                        </svg>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => folding(col.id)}
                        className="cursor-pointer text-muted hover:text-accent transition-colors p-1"
                      >
                        <TfiSplitH size={14} />
                      </motion.button>
                      <span className="text-accent font-semibold text-[10px] tracking-widest [writing-mode:vertical-rl] rotate-180 uppercase">
                        {col.title}
                      </span>
                      <span className="text-muted/60 text-[10px] [writing-mode:vertical-rl] rotate-180">{col.cards.length}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3"> 
                        <div className={`w-1 h-10 transition-colors ${repaint(col.priority)} rounded-full shrink-0 mt-1`} />
                        <div className="self-start rounded-lg snap-start bg-[#F7FAFA] group flex-1">
                          {!isCurrentColumnEditing ? (
                            <div className="flex items-center justify-between mb-3 px-1">
                                <div className="flex items-center gap-2 min-w-0">
                                    <h3 className="text-xs font-semibold tracking-wider uppercase text-accent truncate">{col.title}</h3>
                                    <span className="text-[10px] text-muted/60 shrink-0">{col.cards.length}</span>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => folding(col.id)}
                                        className="cursor-pointer text-muted hover:text-accent transition-colors p-1"
                                    >
                                    <BsArrowsCollapseVertical size={12} />
                                    </motion.button>
                                
                                    <motion.button
                                        onClick={() => {
                                          setNewToggle(col.title);
                                          setAddEditingColumn(col.id, !isCurrentColumnEditing)
                                        }}
                                        className="cursor-pointer text-muted hover:text-accent transition-colors p-1"
                                    >
                                        <CiEdit />
                                    </motion.button>
                                
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => deleteColumn(col.id)}
                                        className="cursor-pointer text-muted hover:text-red-400 transition-colors p-1"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <line x1="3" y1="3" x2="9" y2="9" />
                                            <line x1="9" y1="3" x2="3" y2="9" />
                                        </svg>
                                    </motion.button>
                                </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-4 items-center mb-3 px-1">
                                <div className="flex items-center gap-2 w-full">
                                    <input 
                                        value={newToggle}
                                        maxLength={15}
                                        onKeyDown={(e) => {
                                            if(e.code === 'Enter') {
                                                hendelEditingColumn()
                                                setAddEditingColumn(col.id, false)
                                            };
                                        }}
                                        onChange={e => setNewToggle(e.target.value)}
                                        className="w-[175px] text-sm text-accent placeholder:text-muted px-3 py-2 rounded-lg bg-[#f3f3f3] border border-border/60 focus:border-accent/30 focus:outline-none transition-colors"
                                        autoFocus
                                     />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setAddEditingColumn(col.id, false)}
                                        className="cursor-pointer text-muted hover:text-red-400 transition-colors p-1"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <line x1="3" y1="3" x2="9" y2="9" />
                                            <line x1="9" y1="3" x2="3" y2="9" />
                                        </svg>
                                    </motion.button>
                                </div>
                                <PriorityPills value={col.priority} onChange={(level) => prioritySelection(col.id, level)} name="editing-column-priority" />
                            </div>
                          )}
                          

                          <div className="flex flex-col gap-1.5" data-column-id={col.id}>
                            <Card columnId = {col.id} />
                            <AddCardFrom columnId = {col.id} />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
    )
}