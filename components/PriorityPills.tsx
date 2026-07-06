import type { PriorityLevel } from '../types/type'

interface PriorityPillsProps {
  value: PriorityLevel
  onChange: (level: PriorityLevel) => void
  name: string
}

export default function PriorityPills({ value, onChange, name }: PriorityPillsProps) {
  const checkedColors = {
    Low: 'peer-checked:bg-emerald-500',
    Medium: 'peer-checked:bg-amber-500',
    High: 'peer-checked:bg-rose-500'
  };

  return (
    <div className="flex gap-1">
      {['Low', 'Medium', 'High'].map((level) => (
        <label key={level} className="relative flex-1 text-center">
          <input 
            type="radio" 
            name={name}
            value={level} 
            className="sr-only peer" 
            checked={value === level}
            onChange={() => onChange(level as PriorityLevel)}
          />
          <span className={`block px-1 py-1 rounded text-[10px] font-medium cursor-pointer transition-all bg-gray-100 text-gray-600 hover:bg-gray-200 peer-checked:text-white ${checkedColors[level as keyof typeof checkedColors]}`}>
            {level}
          </span>
        </label>
      ))}
    </div>
  )
}