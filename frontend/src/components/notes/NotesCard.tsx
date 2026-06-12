import * as React from "react"
import { NotesCardProps } from "@/types/notes"
import { cn } from "@/lib/utils"

const NotesCard = React.forwardRef<HTMLDivElement, NotesCardProps>(
  ({ note, selected, onClick, editable = false, width = '280px', height = '240px', onTitleChange, onContentChange }, ref) => {
    const handleClick = () => {
      if (onClick && !editable) {
        onClick(note.id)
      }
    }

    const formatDate = (dateString: string): string => {
      const date = new Date(dateString)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      const noteDate = new Date(date.toDateString())
      const todayDate = new Date(today.toDateString())
      const yesterdayDate = new Date(yesterday.toDateString())
      
      if (noteDate.getTime() === todayDate.getTime()) {
        return 'today'
      } else if (noteDate.getTime() === yesterdayDate.getTime()) {
        return 'yesterday'
      } else {
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
      }
    }

    // Convert hex color to rgba with 50% opacity for background
    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    return (
      <div
        ref={ref}
        role="article"
        className={cn(
          "p-4 rounded-xl shadow-[1px_1px_2px_0px_rgba(0,0,0,0.25)] inline-flex flex-col justify-start items-start gap-3",
          onClick && !editable && "cursor-pointer",
          selected && "ring-2 ring-offset-2 ring-gray-400"
        )}
        style={{ 
          backgroundColor: hexToRgba(note.color, 0.5),
          width: width,
          height: height,
          minHeight: height,
          outline: `3px solid ${note.color}`,
          outlineOffset: '-3px'
        }}
        onClick={handleClick}
        tabIndex={onClick && !editable ? 0 : undefined}
      >
        <div className="inline-flex justify-start items-start gap-2">
          <div className="justify-start text-black text-xs font-bold font-['Inter']">{formatDate(note.created_at)}</div>
          <div className="justify-start text-black text-xs font-normal font-['Inter']">{note.category}</div>
        </div>

        {editable ? (
          <input
            type="text"
            value={note.title}
            onChange={(e) => onTitleChange?.(e.target.value)}
            placeholder="Note Title"
            className="w-full justify-start text-black text-2xl font-bold font-['Inria_Serif'] bg-transparent border-none outline-none placeholder:text-gray-600"
            autoFocus
          />
        ) : (
          <div className="w-full justify-start text-black text-2xl font-bold font-['Inria_Serif'] line-clamp-2">
            {note.title}
          </div>
        )}
        
        {editable ? (
          <textarea
            value={note.content}
            onChange={(e) => onContentChange?.(e.target.value)}
            placeholder="Pour your heart out..."
            className="w-full flex-1 justify-start text-black text-xs font-normal font-['Inter'] bg-transparent border-none outline-none resize-none placeholder:text-gray-600 whitespace-pre-line"
          />
        ) : (
          <div className="w-full h-32 justify-start text-black text-xs font-normal font-['Inter'] overflow-hidden whitespace-pre-line">
            {note.content}
          </div>
        )}
      </div>
    )
  }
)
NotesCard.displayName = "NotesCard"

export { NotesCard }
export default NotesCard
