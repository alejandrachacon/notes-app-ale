'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { notesAPI, Category } from '@/services/api'
import { useToast } from '@/hooks/use-toast'
import { X } from 'lucide-react'
import { NotesCard } from '@/components/notes/NotesCard'
import { CategoryDropdown } from '@/components/notes/CategoryDropdown'

export default function NewNotePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('Random Thoughts')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await notesAPI.getCategories()
      setCategories(response.data)
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0].name)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      setCategories([
        { name: 'Random Thoughts', color: '#EF9C66' },
        { name: 'School', color: '#FFE5A3' },
        { name: 'Personal', color: '#B8E0D2' },
      ])
      setSelectedCategory('Random Thoughts')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const category = categories.find(c => c.name === selectedCategory)
      if (!category) return

      await notesAPI.create({
        title,
        content,
        category: category.name,
        color: category.color,
      })

      toast({
        title: 'Success',
        description: 'Note created successfully',
      })

      router.push('/notes')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.title?.[0] || 'Failed to create note',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    router.push('/notes')
  }

  const selectedCategoryColor = categories.find(c => c.name === selectedCategory)?.color || '#EF9C66'

  const tempNote = {
    id: 'temp',
    title: title,
    content: content,
    category: selectedCategory,
    color: selectedCategoryColor,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return (
    <div className="min-h-screen bg-[#FAF1E3] relative">
      {/* Category Dropdown - Top Left */}
      <div className="absolute top-6 left-6 z-10">
        <CategoryDropdown
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Close Button - Top Right */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 z-10 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
        type="button"
      >
        <X className="h-6 w-6" style={{ color: '#000000' }} />
      </button>

      {/* Centered NotesCard */}
      <form onSubmit={handleSubmit} className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
        <NotesCard
          note={tempNote}
          editable={true}
          width="900px"
          height="600px"
          onTitleChange={setTitle}
          onContentChange={setContent}
        />
        
        {/* Save Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-[6px] px-4 py-3"
          style={{
            width: '384px',
            height: '43px',
            borderRadius: '46px',
            outline: '1px solid #957139',
            outlineOffset: '-1px',
            backgroundColor: 'transparent',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          <span 
            style={{ 
              color: '#957139',
              fontSize: '16px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              wordWrap: 'break-word'
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </span>
        </button>
      </form>
    </div>
  )
}
