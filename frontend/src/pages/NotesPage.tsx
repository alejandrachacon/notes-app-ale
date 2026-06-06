import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { notesAPI, Note } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Plus, LogOut, Pencil, Trash2 } from 'lucide-react'

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const { user, logout } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getAll()
      setNotes(response.data)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingNote) {
        const response = await notesAPI.update(editingNote.id, { title, content })
        setNotes(notes.map(note => note.id === editingNote.id ? response.data : note))
        toast({
          title: 'Success',
          description: 'Note updated successfully',
        })
      } else {
        const response = await notesAPI.create({ title, content })
        setNotes([response.data, ...notes])
        toast({
          title: 'Success',
          description: 'Note created successfully',
        })
      }
      handleCloseDialog()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.title?.[0] || 'Failed to save note',
      })
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

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setTitle(note.title)
    setContent(note.content)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingNote(null)
    setTitle('')
    setContent('')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
          </h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingNote(null); setTitle(''); setContent(''); }}>
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingNote ? 'Edit Note' : 'Create New Note'}</DialogTitle>
                <DialogDescription>
                  {editingNote ? 'Update your note below' : 'Add a new note to your collection'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Note title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your note here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingNote ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No notes yet. Create your first note!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {formatDate(note.updated_at)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(note)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(note.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-4">
                    {note.content || 'No content'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
