import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const categoryItemVariants = cva(
  "flex items-center justify-between w-full h-category-item px-4 text-base text-text-primary bg-transparent hover:bg-bg-secondary transition-colors duration-base cursor-pointer",
  {
    variants: {
      selected: {
        true: "bg-bg-tertiary",
        false: "",
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
)

export interface CategoryItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof categoryItemVariants> {
  name: string
  count?: number
  indicatorColor?: string
  selected?: boolean
}

const CategoryItem = React.forwardRef<HTMLButtonElement, CategoryItemProps>(
  ({ className, name, count, indicatorColor = "bg-category-default", selected, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          categoryItemVariants({ selected, className }),
          disabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={disabled}
        type="button"
        {...props}
      >
        <div className="flex items-center gap-3">
          <div
            role="presentation"
            className={cn("w-[11px] h-[11px] rounded-full", indicatorColor)}
          />
          <span>{name}</span>
        </div>
        {count !== undefined && (
          <span className="text-text-tertiary text-sm">{count}</span>
        )}
      </button>
    )
  }
)
CategoryItem.displayName = "CategoryItem"

export { CategoryItem, categoryItemVariants }
export default CategoryItem
