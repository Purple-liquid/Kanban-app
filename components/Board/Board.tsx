'use client';

import { useStoreAddCard } from '../../store/boardStore'
import { motion } from "motion/react"
import { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { FaRegTrashCan } from "react-icons/fa6";
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
        <div className="flex gap-4 p-6 overflow-y-hidden overflow-x-auto h-screen items-start scrollbar-thin snap-x snap-mandatory">
            {columns?.map(col => {
              const isColumnNarrowed = narrowing?.some(n => n.id === col.id);

              return (
                <motion.div key={col.id} data-column-id={col.id}
                  layout
                  className={`bg-black rounded-lg p-4 flex-shrink-0 self-start transition-all duration-300 ${isColumnNarrowed ? 'w-16 overflow-hidden' : 'w-72'}`}
                  >
                  {isColumnNarrowed ? (
                    <div className="flex flex-col items-center gap-3">
                      <button onClick={() => folding(col.id)} className='cursor-pointer hover:bg-gray-700 p-1 rounded transition-all duration-200 text-white'>
                        <TfiSplitH />
                      </button>
                      <span className="text-white font-semibold [writing-mode:vertical-rl] rotate-180 text-xs tracking-wider">
                        {col.title}
                      </span>
                      <span className='text-gray-300 font-semibold [writing-mode:vertical-rl] rotate-180 text-xs tracking-wider'>{col.cards.length}</span>
                    </div>
                  ) : (
                    <>
                    <h3 className="text-white font-semibold mb-3 flex justify-between w-full">
                      <span className="truncate max-w-[150px]">{col.title}</span>
                      <div className='flex items-center gap-2'>
                        <span className='pr-2 text-gray-400 text-sm'>{col.cards.length}</span>
                        <button onClick={() => folding(col.id)} className='cursor-pointer hover:bg-gray-700 p-1 rounded transition-all duration-200 text-white'>
                          <BsArrowsCollapseVertical />
                        </button>
                        <button 
                          className='cursor-pointer hover:bg-gray-700 p-1 rounded transition-all duration-200 text-white'
                          onClick={() => deleteColumn(col.id)}>
                          <FaRegTrashCan />
                        </button>
                      </div>
                    </h3>
                    <div className="flex flex-col gap-2">
                      {col.cards.map(card => (
                        <motion.div key={card.id} layoutId={String(card.id)}
                          drag
                          dragSnapToOrigin
                          whileTap={{ rotate: -5, scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          onDragEnd={(_, info) => {
                            const els = document.elementsFromPoint(info.point.x, info.point.y)
                            const targetCol = els.find(el => el instanceof HTMLElement && el.dataset.columnId)
                            if(!targetCol) return
                            const toColumnId = Number((targetCol as HTMLElement).dataset.columnId)
                            if(toColumnId && toColumnId !== col.id) {
                              moveCard(card.id, col.id, toColumnId)
                            }
                          }}
                          className="bg-neutral-900 p-3 cursor-grab active:cursor-grabbing rounded text-white text-sm flex items-start justify-between w-full gap-2"
                         >
                          <span className='min-w-0 break-words flex-1'>{card.text}</span>
                          <button className='cursor-pointer hover:bg-gray-700 p-1 rounded transition-all duration-200 shrink-0' onClick={() => deleteCard(col.id, card.id)}>
                            <FaRegTrashCan />
                          </button>
                        </motion.div>
                      ))}
                      
                      {Open === col.id && (
                        <div className='flex flex-col gap-2 mt-2'>
                            <input 
                              value={newCardTitle} 
                              placeholder='titleCard' 
                              onKeyDown={(e) => {
                                if(e.code === "Enter" && newCardTitle.trim()) {
                                  addCard(col.id , { id: Date.now(), text: newCardTitle.trim() })
                                  setOpen(null)
                                  setNewCardTitle('')
                                }
                              }}
                              onChange={e => setNewCardTitle(e.target.value)} 
                              className="text-white placeholder-gray-400 p-1 rounded-lg border border-gray-500 bg-transparent focus:outline-none focus:ring-1 focus:ring-gray-400" 
                            />
                            <div className='flex gap-2'>
                              <button onClick={() => {
                                  if(newCardTitle.trim()) {
                                    addCard(col.id , { id: Date.now(), text: newCardTitle.trim() })
                                    setOpen(null)
                                    setNewCardTitle('')
                                  }
                              }} className="bg-slate-200/60 border border-slate-300/80 text-slate-800 hover:bg-slate-200/90 font-medium px-4 py-1.5 rounded-lg transition-all duration-200 shadow-sm flex-1"
                              >Add</button>
                              <button onClick={() => { setOpen(null); setNewCardTitle('') }} className="bg-transparent text-gray-400 hover:bg-gray-800 px-3 py-1 rounded-lg">
                                <IoMdClose />
                              </button>
                            </div>
                        </div>
                      )}
                      
                      {Open !== col.id && (
                        <button onClick={() => setOpen(col.id)} className="bg-slate-200/60 border border-slate-300/80 text-slate-800 hover:bg-slate-200/90 font-medium py-2 rounded-lg transition-all duration-200 shadow-sm mt-2 w-full text-center">
                          Add Card
                        </button>
                      )}
                    </div>
                    </>
                  )}
                </motion.div>
              );
            })}

            {!isOpen && (
              <button onClick={() => setIsOpen(true)} className="bg-slate-200/60 border border-slate-300/80 text-slate-800 hover:bg-slate-200/90 font-medium px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm w-64">+ Add Column</button>
            )}
            {isOpen && (
              <div className="bg-black rounded-lg p-4 w-72 flex-shrink-0 self-start">
                <div className="flex flex-col gap-2">
                  <input 
                    value={newColumnTitle} 
                    placeholder='titleColumn' 
                    onKeyDown={(e) => { if(e.code === 'Enter') hendelAddColumn() }}
                    onChange={e => setNewColumnTitle(e.target.value)} 
                    className="text-white placeholder-gray-400 p-1 rounded-lg border-2 border-blue-300 bg-transparent focus:outline-none" 
                  />
                  <div className='flex gap-2'>
                    <button onClick={() => hendelAddColumn()} className="bg-blue-300 text-black hover:bg-blue-400 px-2 py-1 rounded flex-1">Add</button>
                    <button onClick={() => setIsOpen(false)} className="bg-transparent text-gray-400 hover:bg-gray-800 py-1 px-2 rounded-lg"><IoMdClose /></button>
                  </div>
                </div>
              </div>
            )}
        </div>
    )
}
