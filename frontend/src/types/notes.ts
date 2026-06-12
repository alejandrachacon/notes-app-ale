import { Note } from '@/services/api'

export interface NotesCardProps {
  note: Note
  selected?: boolean
  onClick?: (noteId: string) => void
  editable?: boolean
  width?: string
  height?: string
  onTitleChange?: (title: string) => void
  onContentChange?: (content: string) => void
}
