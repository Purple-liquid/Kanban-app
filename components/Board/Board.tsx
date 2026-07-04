'use client';

import { useStoreAddCard } from '../../store/boardStore'
import { motion, AnimatePresence } from "motion/react"
import { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { BsArrowsCollapseVertical } from "react-icons/bs";
import { TfiSplitH } from "react-icons/tfi";

export default function Board() {
    const columns = useStoreAddCard(state => state.columns)
    const narrowing = useStoreAddCard(state => state.narrowing)
    const addCard = useStoreAddCard(state => state.addCard)
    const addColumn = useStoreAddCard(state => state.addColumn)
    const folding = useStoreAddCard(state => state.folding)
    const moveCard = useStoreAddCard(state => state.moveCard)
    const deleteCard = useStoreAddCard(state => state.deleteCard)
    const deleteColumn = useStoreAddCard(state => state.deleteColumn)
    
    const [isOpen, setIsOpen] = useState(false)
    const [Open, setOpen] = useState<number | null>(null)
    const [newColumnTitle, setNewColumnTitle] = useState<string>("");
    const [newCardTitle, setNewCardTitle] = useState<string>("");

    const hendelAddColumn = () => {
      const titleCol = newColumnTitle.trim()
      if(!titleCol) return

      addColumn({ id: Date.now(), title: titleCol, cards: [] })
      setIsOpen(false)
      setNewColumnTitle('')
    }

    return (
      <div className="h-screen flex flex-col">
        <header className="flex items-center gap-3 px-8 py-5 border-b border-border shrink-0">
          <h1 className="text-sm font-medium tracking-widest uppercase text-muted">LIQUID_KANBAN</h1>
          <span className="text-muted/30 text-xs">·</span>
          <span className="text-xs text-muted/50 tracking-wide">
            {columns?.length ?? 0} {(columns?.length ?? 0) === 1 ? 'column' : 'columns'}
          </span>
        </header>

        <div className="flex-1 flex gap-10 p-8 overflow-x-auto items-start snap-x snap-mandatory">
          <AnimatePresence mode="popLayout">
            {columns?.map(col => {
              const isColumnNarrowed = narrowing?.some(n => n.id === col.id);

              return (
                <motion.div key={col.id} data-column-id={col.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`flex-shrink-0 self-start snap-start group ${isColumnNarrowed ? 'w-14' : 'w-64'}`}
                >
                  {isColumnNarrowed ? (
                    <div className="flex flex-col items-center gap-3 pt-6" data-column-id={col.id}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteColumn(col.id)}
                        className="cursor-pointer text-muted/50 hover:text-red-400/70 transition-colors p-1"
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
                      <span className="text-muted font-medium text-[10px] tracking-widest [writing-mode:vertical-rl] rotate-180 uppercase">
                        {col.title}
                      </span>
                      <span className="text-muted/40 text-[10px] [writing-mode:vertical-rl] rotate-180">{col.cards.length}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-5 px-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <h3 className="text-xs font-medium tracking-wider uppercase text-muted truncate">{col.title}</h3>
                          <span className="text-[10px] text-muted/40 shrink-0">{col.cards.length}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => folding(col.id)}
                            className="cursor-pointer text-muted/50 hover:text-accent transition-colors p-1"
                          >
                            <BsArrowsCollapseVertical size={12} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteColumn(col.id)}
                            className="cursor-pointer text-muted/50 hover:text-red-400/70 transition-colors p-1"
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <line x1="3" y1="3" x2="9" y2="9" />
                              <line x1="9" y1="3" x2="3" y2="9" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5" data-column-id={col.id}>
                        <AnimatePresence mode="popLayout">
                          {col.cards.map((card) => (
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
                                boxShadow: '0 0 0 1px rgba(255,255,255,0.08)'
                              }}
                              onDragEnd={(_, info) => {
                                const els = document.elementsFromPoint(info.point.x, info.point.y)
                                const targetCol = els.find(el => el instanceof HTMLElement && el.dataset.columnId)
                                if(!targetCol) return
                                const toColumnId = Number((targetCol as HTMLElement).dataset.columnId)
                                if(toColumnId && toColumnId !== col.id) {
                                  moveCard(card.id, col.id, toColumnId)
                                }
                              }}
                              className="group/card relative cursor-grab active:cursor-grabbing"
                            >
                              <div className="px-3 py-2.5 rounded-lg bg-surface/60 border border-border hover:border-white/20 transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-sm text-accent/90 leading-relaxed min-w-0 break-words flex-1">{card.text}</span>
                                  <motion.button
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => deleteCard(col.id, card.id)}
                                    className="opacity-0 group-hover/card:opacity-100 cursor-pointer text-muted/30 hover:text-red-400/60 transition-all p-0.5 shrink-0 mt-0.5"
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

                        {Open === col.id ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col gap-2 mt-1"
                          >
                            <input
                              value={newCardTitle}
                              placeholder="Card title..."
                              onKeyDown={(e) => {
                                if(e.code === "Enter" && newCardTitle.trim()) {
                                  addCard(col.id, { id: Date.now(), text: newCardTitle.trim() })
                                  setOpen(null)
                                  setNewCardTitle('')
                                }
                                if(e.code === "Escape") {
                                  setOpen(null)
                                  setNewCardTitle('')
                                }
                              }}
                              onChange={e => setNewCardTitle(e.target.value)}
                              className="text-sm text-accent placeholder-muted/40 px-3 py-2 rounded-lg bg-surface/40 border border-border/60 focus:border-accent/30 focus:outline-none transition-colors"
                              autoFocus
                            />
                            <div className="flex gap-1.5">
                              <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                  if(newCardTitle.trim()) {
                                    addCard(col.id, { id: Date.now(), text: newCardTitle.trim() })
                                    setOpen(null)
                                    setNewCardTitle('')
                                  }
                                }}
                                className="text-xs text-dark bg-accent hover:bg-white px-3 py-1.5 rounded-lg transition-colors font-medium flex-1"
                              >Add</motion.button>
                              <button onClick={() => { setOpen(null); setNewCardTitle('') }} className="text-muted/50 hover:text-accent px-2 transition-colors">
                                <IoMdClose size={14} />
                              </button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setOpen(col.id)}
                            className="flex items-center gap-1.5 text-xs text-muted/40 hover:text-muted transition-colors px-3 py-2 mt-0.5"
                          >
                            <FiPlus size={12} />
                            <span className="tracking-wide">Add card</span>
                          </motion.button>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {!isOpen ? (
            <motion.button
              whileHover={{ borderColor: 'rgba(255,255,255,0.15)' }}
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 text-xs text-muted/40 hover:text-muted transition-colors px-5 py-3 rounded-lg border border-border/40 hover:border-border/60 border-dashed shrink-0 snap-start mt-[2px]"
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
                  onKeyDown={(e) => { if(e.code === 'Enter') hendelAddColumn(); if(e.code === 'Escape') { setIsOpen(false); setNewColumnTitle('') } }}
                  onChange={e => setNewColumnTitle(e.target.value)}
                  className="text-sm text-accent placeholder-muted/40 px-3 py-2 rounded-lg bg-surface/40 border border-border/60 focus:border-accent/30 focus:outline-none transition-colors"
                  autoFocus
                />
                <div className="flex gap-1.5">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => hendelAddColumn()}
                    className="text-xs text-dark bg-accent hover:bg-white px-3 py-1.5 rounded-lg transition-colors font-medium flex-1"
                  >Add</motion.button>
                  <button onClick={() => { setIsOpen(false); setNewColumnTitle('') }} className="text-muted/50 hover:text-accent px-2 transition-colors">
                    <IoMdClose size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    )
}
