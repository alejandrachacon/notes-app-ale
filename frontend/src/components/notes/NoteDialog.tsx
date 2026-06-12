'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { Note, Category } from '@/services/api'

interface NoteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { title: string; content: string; category: string; color: string }) => Promise<void>
  editingNote?: Note | null
  categories: Category[]
}

export function NoteDialog({ isOpen, onOpenChange, onSubmit, editingNote, categories }: NoteDialogProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.name || 'Random Thoughts')

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title)
      setContent(editingNote.content)
      setSelectedCategory(editingNote.category || categories[0]?.name || 'Random Thoughts')
    } else {
      setTitle('')
      setContent('')
      setSelectedCategory(categories[0]?.name || 'Random Thoughts')
    }
  }, [editingNote, categories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const category = categories.find(c => c.name === selectedCategory)
    if (!category) return

    await onSubmit({
      title,
      content,
      category: category.name,
      color: category.color,
    })

    // Reset form
    setTitle('')
    setContent('')
    setSelectedCategory(categories[0]?.name || 'Random Thoughts')
  }

  const selectedCategoryColor = categories.find(c => c.name === selectedCategory)?.color || '#FFB380'

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 border-none">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
          type="button"
        >
          <X className="h-6 w-6" style={{ color: '#000000' }} />
        </button>
        <div className="flex h-[600px]">
          {/* Left sidebar - Category selector */}
          <div className="w-48 bg-white p-4 border-r">
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => setSelectedCategory(category.name)}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  style={{
                    backgroundColor: selectedCategory === category.name ? '#F5F5F5' : 'transparent'
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium" style={{ color: '#000000' }}>
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right side - Note content */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div
              className="flex-1 p-6 flex flex-col"
              style={{ backgroundColor: selectedCategoryColor }}
            >
              <div className="flex justify-end mb-2">
                <span className="text-xs" style={{ color: '#000000' }}>
                  Last Edited: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </span>
              </div>
              <input
                type="text"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-2xl font-bold mb-4 bg-transparent border-none outline-none placeholder:text-gray-600"
                style={{ color: '#000000' }}
              />
              <textarea
                placeholder="Pour your heart out..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none resize-none placeholder:text-gray-600"
                style={{ color: '#000000' }}
              />
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function NoteDialogTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button 
      variant="outline"
      onClick={onClick}
      style={{
        borderColor: '#957139',
        color: '#957139',
        backgroundColor: 'transparent'
      }}
    >
      <Plus className="mr-2 h-4 w-4" />
      New Note
    </Button>
  )
}
