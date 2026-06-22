'use client';

import { useStoreAddCard } from '../../store/boardStore'
import { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { FaRegTrashCan } from "react-icons/fa6";

export default function Board() {
    const columns = useStoreAddCard(state => state.columns)
    const addCard = useStoreAddCard(state => state.addCard)
    const addColumn = useStoreAddCard(state => state.addColumn)
    const moveCard = useStoreAddCard(state => state.moveCard)
    const deleteCard = useStoreAddCard(state => state.deleteCard)
    const deleteColumn = useStoreAddCard(state => state.deleteColumn)

    
    const [closedCol, setClosedCol] = useState(false)
    const [closed, setClosed] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [Open, setOpen] = useState<number | null>(null)
    const [newColumnTitle, setNewColumnTitle] = useState<string>("");
    const [newCardTitle, setNewCardTitle] = useState<string>("");

    const hendelAddColumn = () => {
      const title = newColumnTitle.trim()
      if(!title) return

      addColumn({ id: Date.now(), title: newColumnTitle.trim(), cards: [] })
      setIsOpen(false)
      setNewColumnTitle('')
    }

    return (
        <div className="flex gap-4 p-6 overflow-y-hidden overflow-x-auto h-screen items-start scrollbar-thin snap-x snap-mandatory">
          {columns?.map(col => (
            <div key={col.id} className="bg-black rounded-lg p-4 w-72 flex-shrink-0 self-start">
              <h3 className="text-white font-semibold mb-3 flex justify-between w-full">
                <span>{col.title}</span>
                <div className='flex items-center gap-1'>
                  <span>{col.cards.length}</span>
                  <button 
                  className='cursor-pointer hover:bg-gray-700 p-1 rounded transition-all duration-200'
                    onClick={() => deleteColumn(col.id)}><FaRegTrashCan /></button>
                </div>
              </h3>
              <div className="flex flex-col gap-2">
                {col.cards.map(card => (
                  <div key={card.id} className="bg-neutral-900 p-3 rounded text-white text-sm flex justify-between w-full">
                    <span>{card.text}</span>
                    <button className='cursor-pointer hover:bg-gray-700 p-1 rounded transition-all duration-200' onClick={() => deleteCard(col.id, card.id)}><FaRegTrashCan /></button>
                  </div>
                ))}
                {Open === col.id && (
                <div className='flex flex-col gap-2'>
                    <input 
                      value={newCardTitle} 
                      placeholder='titleCard' 
                      onKeyDown={(e) => {
                      if(e.code === "Enter") {
                        if(newCardTitle.trim()) {
                          addCard(col.id , { id: Date.now(), text: newCardTitle.trim() })
                          setOpen(null)
                          setNewCardTitle('')
                          }
                        }
                      }}
                      onChange={e => setNewCardTitle(e.target.value)} className="text-white placeholder-gray-400 p-1 rounded-lg border border-gray-500 shadow-[0_0_5px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400" />
                    <div className='flex gap-2'>
                      <button onClick={() => {
                          if(newCardTitle.trim()) {
                            addCard(col.id , { id: Date.now(), text: newCardTitle.trim() })
                            setOpen(null)
                            setNewCardTitle('')
                          }
                      }} className="bg-slate-200/60 border border-slate-300/80 text-slate-800 hover:bg-slate-200/90 font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm flex-1"
                      >Add</button>
                      <button onClick={() => { setOpen(null); setNewCardTitle('') }} className="bg-transparent text-gray-400 hover:bg-gray-800 px-4 py-1  rounded-lg"><IoMdClose /></button>
                    </div>
                </div>
              )}
              {!Open && (
                <button onClick={() => {
                  if(Open === null) {
                    setOpen(col.id)
                  } else {
                    setOpen(null)
                  }
                }} className="bg-slate-200/60 border border-slate-300/80 text-slate-800 hover:bg-slate-200/90 font-medium px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm shadow-slate-100 mt-2 px-4 py-2 rounded">Add Card</button>
              )}
              </div>
            </div>
          ))}
          {!isOpen && (
            <button onClick={() => setIsOpen(!isOpen)} className="bg-slate-200/60 border border-slate-300/80 text-slate-800 hover:bg-slate-200/90 font-medium px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm shadow-slate-100 transition-colors w-64 px-4 py-2 rounded">+ Add Column</button>
          )}
          {isOpen && (
            <div className="bg-black rounded-lg p-4 w-72 flex-shrink-0 self-start overflow-y-auto">
              <div className="mt-2 flex flex-col gap-2">
                <input 
                  value={newColumnTitle} 
                  placeholder='titleColumn' 
                  onKeyDown={(e) => {
                    if(e.code === 'Enter') {
                      hendelAddColumn()
                    }
                  }}
                  onChange={e => setNewColumnTitle(e.target.value)} 
                  className="text-white placeholder-gray-400 p-1 rounded-lg border-2 border-blue-300 shadow-[0_0_5px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300" />
                <div className='flex gap-2'>
                  <button onClick={() => hendelAddColumn()} className="bg-blue-300 text-black hover:bg-blue-400 px-2 py-1 rounded flex-1">Add</button>
                  <button onClick={() => setIsOpen(!isOpen)} className="bg-transparent text-gray-400 hover:bg-gray-800 py-1 px-2 rounded-lg"><IoMdClose /></button>
                </div>
              </div>
            </div>
          )}
        </div>
    )
}