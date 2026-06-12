import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { CategoryItem } from "./CategoryItem"

const categoryDropdownVariants = cva(
  "relative inline-flex items-center justify-between w-full px-4 text-base font-normal rounded-base border border-border-default bg-bg-primary transition-all duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      state: {
        closed: "h-dropdown-height shadow-dropdown",
        open: "shadow-dropdown",
      },
    },
    defaultVariants: {
      state: "closed",
    },
  }
)

export interface Category {
  id: string
  name: string
  count?: number
}

export interface CategoryDropdownProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  categories: Category[]
  selectedCategory: string
  onSelect: (categoryName: string) => void
  disabled?: boolean
}

const CategoryDropdown = React.forwardRef<HTMLButtonElement, CategoryDropdownProps>(
  ({ className, categories, selectedCategory, onSelect, disabled, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen)
      }
    }

    const handleSelect = (categoryName: string) => {
      onSelect(categoryName)
      setIsOpen(false)
    }

    return (
      <div ref={dropdownRef} className="relative w-full">
        <button
          ref={ref}
          className={cn(
            categoryDropdownVariants({ state: isOpen ? "open" : "closed", className })
          )}
          onClick={handleToggle}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          type="button"
          {...props}
        >
          <span className="text-text-primary">{selectedCategory}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-text-secondary transition-transform duration-base",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div
            role="listbox"
            className="absolute top-full left-0 right-0 mt-1 bg-bg-primary border border-border-default rounded-base shadow-dropdown z-dropdown overflow-hidden"
          >
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                name={category.name}
                count={category.count}
                selected={category.name === selectedCategory}
                onClick={() => handleSelect(category.name)}
                aria-selected={category.name === selectedCategory}
                role="option"
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)
CategoryDropdown.displayName = "CategoryDropdown"

export { CategoryDropdown, categoryDropdownVariants }
export default CategoryDropdown
