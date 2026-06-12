'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { notesAPI, Category, Note } from '@/services/api'
import { useToast } from '@/hooks/use-toast'
import { X } from 'lucide-react'
import { NotesCard } from '@/components/notes/NotesCard'
import { CategoryDropdown } from '@/components/notes/CategoryDropdown'

export default function EditNotePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('Random Thoughts')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [note, setNote] = useState<Note | null>(null)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const noteId = params.id as string

  useEffect(() => {
    fetchCategories()
    fetchNote()
  }, [noteId])

  const fetchCategories = async () => {
    try {
      const response = await notesAPI.getCategories()
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      setCategories([
        { name: 'Random Thoughts', color: '#EF9C66' },
        { name: 'School', color: '#FFE5A3' },
        { name: 'Personal', color: '#B8E0D2' },
      ])
    }
  }

  const fetchNote = async () => {
    try {
      const response = await notesAPI.getOne(noteId)
      const noteData = response.data
      setNote(noteData)
      setTitle(noteData.title)
      setContent(noteData.content)
      setSelectedCategory(noteData.category || 'Random Thoughts')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load note',
      })
      router.push('/notes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const category = categories.find(c => c.name === selectedCategory)
      if (!category) return

      await notesAPI.update(noteId, {
        title,
        content,
        category: category.name,
        color: category.color,
      })

      toast({
        title: 'Success',
        description: 'Note updated successfully',
      })

      router.push('/notes')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.title?.[0] || 'Failed to update note',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    router.push('/notes')
  }

  const selectedCategoryColor = categories.find(c => c.name === selectedCategory)?.color || '#EF9C66'

  const editableNote = note ? {
    ...note,
    title: title,
    content: content,
    category: selectedCategory,
    color: selectedCategoryColor,
  } : {
    id: 'temp',
    title: title,
    content: content,
    category: selectedCategory,
    color: selectedCategoryColor,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF1E3] flex items-center justify-center">
        <p style={{ color: '#88642A' }}>Loading note...</p>
      </div>
    )
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
          note={editableNote}
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
