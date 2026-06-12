'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { notesAPI, Note, Category } from '@/services/api'
import { useToast } from '@/hooks/use-toast'
import { NotesCard } from '@/components/notes/NotesCard'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, LogOut } from 'lucide-react'

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchNotes()
    fetchCategories()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getAll()
      setNotes(response.data)
      console.log(response.data)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch notes',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await notesAPI.getCategories()
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      // Set default categories if API fails
      setCategories([
        { name: 'Random Thoughts', color: '#EF9C66' },
        { name: 'School', color: '#FFE5A3' },
        { name: 'Personal', color: '#B8E0D2' },
      ])
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      await notesAPI.delete(id)
      setNotes(notes.filter(note => note.id !== id))
      toast({
        title: 'Success',
        description: 'Note deleted successfully',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete note',
      })
    }
  }

  const handleNoteClick = (noteId: string) => {
    router.push(`/notes/${noteId}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Get note counts per category
  const noteCounts = notes.reduce((acc, note) => {
    if (note.category) {
      acc[note.category] = (acc[note.category] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)
  
  // Combine API categories with note counts
  const categoryData = categories.map(cat => ({
    name: cat.name,
    color: cat.color,
    count: noteCounts[cat.name] || 0
  }))
  
  // Filter notes by selected category
  const filteredNotes = selectedCategory
    ? notes.filter(note => note.category === selectedCategory)
    : notes

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category)
  }

  return (
    <div className="min-h-screen bg-[#FAF1E3] flex">
      {/* Sidebar */}
      <aside className="w-64 p-6 pt-20">
        <div className="space-y-4">
          <button
            onClick={() => handleCategoryClick(null)}
            className="justify-start text-black text-sm font-bold"
          >
            All Categories
          </button>
          <div className="space-y-2">
            {categoryData.length > 0 ? (
              categoryData.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className="flex items-center justify-between w-full text-left hover:opacity-70 transition-opacity"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span 
                      className="text-sm text-black" 
                      style={{ 
                        fontWeight: selectedCategory === category.name ? 600 : 400
                      }}
                    >
                      {category.name}
                    </span>
                  </div>
                  <span className="text-sm text-black">{category.count}</span>
                </button>
              ))
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span className="text-sm text-gray-400">No categories yet</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative">
        {/* New Note Button - Top Right */}
        <div className="absolute top-6 right-6 z-10">
          <Link href="/notes/new">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-md border transition-colors"
              style={{
                borderColor: '#957139',
                color: '#957139',
                backgroundColor: 'transparent'
              }}
            >
              <Plus className="h-4 w-4" />
              New Note
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <p style={{ color: '#88642A' }}>Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <img 
              src="/images/coffee_waiting.png" 
              alt="Waiting for notes"
              className="size-72 object-contain mb-6"
            />
            <p style={{ color: '#88642A', fontSize: '16px' }}>
              {selectedCategory 
                ? `No notes in "${selectedCategory}" yet...` 
                : "I'm just here waiting for your charming notes..."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 p-6 pt-20">
            {filteredNotes.map((note) => (
              <NotesCard 
                key={note.id} 
                note={note}
                onClick={handleNoteClick}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
