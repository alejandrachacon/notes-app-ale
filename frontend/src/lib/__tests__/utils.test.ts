import { cn } from '../utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500')
    expect(result).toBe('text-red-500 bg-blue-500')
  })

  it('should handle conditional classes', () => {
    const result = cn('base-class', false && 'hidden', 'visible')
    expect(result).toBe('base-class visible')
  })

  it('should merge tailwind classes and resolve conflicts', () => {
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4')
  })

  it('should handle undefined and null values', () => {
    const result = cn('text-sm', undefined, null, 'font-bold')
    expect(result).toBe('text-sm font-bold')
  })

  it('should handle arrays of classes', () => {
    const result = cn(['text-sm', 'font-bold'], 'text-red-500')
    expect(result).toBe('text-sm font-bold text-red-500')
  })

  it('should handle empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })
})
