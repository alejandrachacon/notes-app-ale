'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { Category } from '@/services/api'

interface CategoryDropdownProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryDropdown({ categories, selectedCategory, onCategoryChange }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedCategoryData = categories.find(c => c.name === selectedCategory)
  const selectedColor = selectedCategoryData?.color || '#EF9C66'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (categoryName: string) => {
    onCategoryChange(categoryName)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative" style={{ width: '384px' }}>
      {/* Selected Value */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-[39px] px-[15px] py-[7px] rounded-md w-full"
        style={{
          outline: '1px solid #957139',
          outlineOffset: '-1px',
          backgroundColor: 'white'
        }}
      >
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: selectedColor }}
        />
        <span 
          className="flex-1 text-left text-xs font-normal"
          style={{ fontFamily: 'Inter, sans-serif', color: '#000000' }}
        >
          {selectedCategory}
        </span>
        <ChevronDown 
          className="h-4 w-4 flex-shrink-0 transition-transform"
          style={{ 
            color: '#957139',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-md shadow-lg overflow-hidden z-50"
          style={{
            backgroundColor: '#FAF1E3',
            border: '1px solid #957139'
          }}
        >
          {categories.map((category) => (
            <button
              key={category.name}
              type="button"
              onClick={() => handleSelect(category.name)}
              className="flex items-center gap-2 w-full px-[15px] py-[10px] hover:bg-white/50 transition-colors"
              style={{
                backgroundColor: selectedCategory === category.name ? 'white' : 'transparent'
              }}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <span 
                className="text-left text-xs font-normal"
                style={{ fontFamily: 'Inter, sans-serif', color: '#000000' }}
              >
                {category.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
