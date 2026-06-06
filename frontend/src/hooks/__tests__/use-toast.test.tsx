import { renderHook, act } from '@testing-library/react'
import { useToast } from '../use-toast'

describe('useToast hook', () => {
  it('should initialize with empty toasts array', () => {
    const { result } = renderHook(() => useToast())
    expect(result.current.toasts).toEqual([])
  })

  it('should add a toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'This is a test',
      })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0]).toMatchObject({
      title: 'Test Toast',
      description: 'This is a test',
    })
  })

  it('should add toast with variant', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: 'Error Toast',
        variant: 'destructive',
      })
    })

    expect(result.current.toasts[0]).toMatchObject({
      title: 'Error Toast',
      variant: 'destructive',
    })
  })

  it('should dismiss a toast', () => {
    const { result } = renderHook(() => useToast())

    let toastId = ''

    act(() => {
      const { id } = result.current.toast({
        title: 'Test Toast',
      })
      toastId = id
    })

    expect(result.current.toasts).toHaveLength(1)

    act(() => {
      result.current.dismiss(toastId)
    })

    // After dismiss, toast should either be removed or marked as open: false
    const dismissedToast = result.current.toasts.find(t => t.id === toastId)
    if (dismissedToast) {
      // If still in array, should be marked as closed
      expect(dismissedToast.open).toBe(false)
    } else {
      // Or completely removed from array
      expect(result.current.toasts.find(t => t.id === toastId)).toBeUndefined()
    }
  })

  it('should limit number of toasts', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'Toast 1' })
      result.current.toast({ title: 'Toast 2' })
    })

    expect(result.current.toasts.length).toBeLessThanOrEqual(1)
  })

  it('should generate unique IDs for each toast', () => {
    const { result } = renderHook(() => useToast())

    let id1 = ''
    let id2 = ''

    act(() => {
      const toast1 = result.current.toast({ title: 'Toast 1' })
      id1 = toast1.id
    })

    act(() => {
      result.current.dismiss(id1)
    })

    act(() => {
      const toast2 = result.current.toast({ title: 'Toast 2' })
      id2 = toast2.id
    })

    expect(id1).not.toBe(id2)
  })
})
