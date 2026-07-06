'use client';

import Column from "./Column";
import AddColumnForm from "./AddColumnForm";
import { useBoardStore } from '../store/boardStore'



export default function Board() {
    const columns = useBoardStore(state => state.columns)
    
    return (
      <div className="h-screen flex flex-col">
        <header className="flex items-center gap-3 px-8 py-5 border-b border-border shrink-0">
          <h1 className="text-sm font-semibold tracking-widest uppercase text-accent">LIQUID KANBAN</h1>
          <span className="text-muted/60 text-xs">·</span>
          <span className="text-xs text-muted/60 tracking-wide">
            {columns?.length ?? 0} {(columns?.length ?? 0) === 1 ? 'column' : 'columns'}
          </span>
        </header>
        <div className="flex-1 flex gap-10 p-8 overflow-x-auto items-start snap-x snap-mandatory">
          <Column />
          <AddColumnForm/>
        </div>
      </div>
    );
  }
