import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const notesCardVariants = cva(
  "w-note-card-width h-note-card-height p-4 rounded-lg border border-border-light bg-bg-card shadow-card hover:shadow-card-hover transition-shadow duration-base flex flex-col gap-3",
  {
    variants: {
      variant: {
        default: "",
        highlighted: "border-brand-primary",
        compact: "p-3",
      },
      selected: {
        true: "border-brand-primary bg-bg-tertiary",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      selected: false,
    },
  }
)

export interface NotesCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notesCardVariants> {
  id: string
  title: string
  content: string
  category?: string
  createdAt: string
  selected?: boolean
  disabled?: boolean
}

const NotesCard = React.forwardRef<HTMLDivElement, NotesCardProps>(
  ({ 
    className, 
    id, 
    title, 
    content, 
    category, 
    createdAt, 
    variant, 
    selected, 
    disabled,
    onClick,
    ...props 
  }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return
      onClick?.(e)
    }

    return (
      <div
        ref={ref}
        role="article"
        className={cn(
          notesCardVariants({ variant, selected, className }),
          onClick && !disabled && "cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleClick}
        tabIndex={onClick && !disabled ? 0 : undefined}
        {...props}
      >
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          <h3 className="text-2xl font-semibold text-text-primary truncate">
            {title}
          </h3>
          
          <p className="text-base text-text-secondary line-clamp-3 overflow-hidden">
            {content}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-text-tertiary mt-auto">
          {category && (
            <span className="truncate">{category}</span>
          )}
          <span className={cn(!category && "ml-auto")}>{createdAt}</span>
        </div>
      </div>
    )
  }
)
NotesCard.displayName = "NotesCard"

export { NotesCard, notesCardVariants }
export default NotesCard
