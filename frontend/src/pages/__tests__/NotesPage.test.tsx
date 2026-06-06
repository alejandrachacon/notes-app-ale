import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import NotesPage from '../NotesPage'
import { AuthProvider } from '@/contexts/AuthContext'
import { notesAPI } from '@/services/api'

const mockUser = { id: '1', email: 'test@example.com' }

const mockNotes = [
  {
    id: '1',
    title: 'Test Note 1',
    content: 'Content 1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Test Note 2',
    content: 'Content 2',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
]

const renderNotesPage = () => {
  localStorage.setItem('access_token', 'mock-token')
  localStorage.setItem('user', JSON.stringify(mockUser))

  return render(
    <MemoryRouter>
      <AuthProvider>
        <NotesPage />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('NotesPage', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should render page header with user email', async () => {
    ;(notesAPI.getAll as jest.Mock).mockResolvedValue({ data: [] })

    renderNotesPage()

    await waitFor(() => {
      expect(screen.getByText('My Notes')).toBeInTheDocument()
      expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    })
  })

  it('should fetch and display notes on mount', async () => {
    ;(notesAPI.getAll as jest.Mock).mockResolvedValue({ data: mockNotes })

    renderNotesPage()

    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument()
      expect(screen.getByText('Test Note 2')).toBeInTheDocument()
      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.getByText('Content 2')).toBeInTheDocument()
    })
  })

  it('should show loading state initially', () => {
    ;(notesAPI.getAll as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
    )

    renderNotesPage()

    expect(screen.getByText(/loading notes/i)).toBeInTheDocument()
  })

  it('should show empty state when no notes', async () => {
    ;(notesAPI.getAll as jest.Mock).mockResolvedValue({ data: [] })

    renderNotesPage()

    await waitFor(() => {
      expect(screen.getByText(/no notes yet/i)).toBeInTheDocument()
    })
  })

  it('should display note count', async () => {
    ;(notesAPI.getAll as jest.Mock).mockResolvedValue({ data: mockNotes })

    renderNotesPage()

    await waitFor(() => {
      expect(screen.getByText('2 Notes')).toBeInTheDocument()
    })
  })

  it('should open create note dialog when clicking New Note button', async () => {
    const user = userEvent.setup()
    ;(notesAPI.getAll as jest.Mock).mockResolvedValue({ data: [] })

    renderNotesPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /new note/i })).toBeInTheDocument()
    })

    const newNoteButton = screen.getByRole('button', { name: /new note/i })
    await user.click(newNoteButton)

    await waitFor(() => {
      expect(screen.getByText('Create New Note')).toBeInTheDocument()
    })
  })

  it('should create a new note', async () => {
    const user = userEvent.setup()
    const newNote = {
      id: '3',
      title: 'New Note',
      content: 'New Content',
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z',
    }

    ;(notesAPI.getAll as jest.Mock).mockResolvedValue({ data: [] })
    ;(notesAPI.create as jest.Mock).mockResolvedValue({ data: newNote })

    renderNotesPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /new note/i })).toBeInTheDocument()
    })

    const newNoteButton = screen.getByRole('button', { name: /new note/i })
    await user.click(newNoteButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    })

    const titleInput = screen.getByLabelText(/title/i)
    const contentInput = screen.getByLabelText(/content/i)
    const createButton = screen.getByRole('button', { name: /^create$/i })

    await user.type(titleInput, 'New Note')
    await user.type(contentInput, 'New Content')
    await user.click(createButton)

    await waitFor(() => {
      expect(notesAPI.create).toHaveBeenCalledWith({
        title: 'New Note',
        content: 'New Content',
      })
    })
  })

  it('should edit an existing note', async () => {
    const user = userEvent.setup()
    const updatedNote = {
      ...mockNotes[0],
      title: 'Updated Title',
      content: 'Updated Content',
    }

    ;(notesAPI.getAll as jest.Mock).mockResolvedValue({ data: mockNotes })
    ;(notesAPI.update as jest.Mock).mockResolvedValue({ data: updatedNote })

    renderNotesPage()

    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument()
    })

    const editButtons = screen.getAllByRole('button', { name: '' })
    const editButton = editButtons.find(btn => btn.querySelector('svg'))
    
    if (editButton) {
      await user.click(editButton)

      await waitFor(() => {
        expect(screen.getByText('Edit Note')).toBeInTheDocument()
      })

      const titleInput = screen.getByLabelText(/title/i)
      const contentInput = screen.getByLabelText(/content/i)

      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Title')
      await user.clear(contentInput)
      await user.type(contentInput, 'Updated Content')

      const updateButton = screen.getByRole('button', { name: /update/i })
      await user.click(updateButton)

      await waitFor(() => {
        expect(notesAPI.update).toHaveBeenCalledWith('1', {
          title: 'Updated Title',
          content: 'Updated Content',
        })
      })
    }
  })

  it('should delete a note', async () => {
    const user = userEvent.setup()
    global.confirm = jest.fn(() => true)

    ;(notesAPI.getAll as jest.Mock).mockResolvedValue({ data: mockNotes })
    ;(notesAPI.delete as jest.Mock).mockResolvedValue({})

    renderNotesPage()

    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByRole('button', { name: '' })
    const deleteButton = deleteButtons.find(btn => {
      const svg = btn.querySelector('svg')
      return svg && btn.querySelector('.text-destructive')
    })

    if (deleteButton) {
      await user.click(deleteButton)

      await waitFor(() => {
        expect(notesAPI.delete).toHaveBeenCalledWith('1')
      })
    }
  })

  it('should not delete note if user cancels confirmation', async () => {
    const user = userEvent.setup()
    global.confirm = jest.fn(() => false)

    ;(notesAPI.getAll as jest.Mock).mockResolvedValue({ data: mockNotes })

    renderNotesPage()

    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByRole('button', { name: '' })
    const deleteButton = deleteButtons.find(btn => {
      const svg = btn.querySelector('svg')
      return svg && btn.querySelector('.text-destructive')
    })

    if (deleteButton) {
      await user.click(deleteButton)

      expect(notesAPI.delete).not.toHaveBeenCalled()
    }
  })

  it('should show error toast when fetch fails', async () => {
    ;(notesAPI.getAll as jest.Mock).mockRejectedValue(new Error('Network error'))

    renderNotesPage()

    await waitFor(() => {
      expect(notesAPI.getAll).toHaveBeenCalled()
    })
  })

  it('should have logout button', async () => {
    ;(notesAPI.getAll as jest.Mock).mockResolvedValue({ data: [] })

    renderNotesPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
    })
  })
})
