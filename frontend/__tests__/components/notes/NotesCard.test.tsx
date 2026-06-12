import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotesCard } from '../../../src/components/notes/NotesCard';
import { Note } from '../../../src/types/notes';

describe('NotesCard', () => {
  const mockNote: Note = {
    id: '1',
    title: 'Meeting Notes',
    body: 'Discussed project timeline and deliverables for Q1. Need to follow up with team on resource allocation.',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    tags: ['work', 'meeting', 'important'],
  };

  const minimalNote: Note = {
    id: '2',
    title: 'Quick Note',
    body: 'Remember to buy milk',
    createdAt: '2024-01-16T08:00:00Z',
    updatedAt: '2024-01-16T08:00:00Z',
    tags: [],
  };

  describe('Rendering - Full Data', () => {
    it('should render without crashing with full mock data', () => {
      render(<NotesCard note={mockNote} />);
      expect(screen.getByText('Meeting Notes')).toBeInTheDocument();
    });

    it('should render note title', () => {
      render(<NotesCard note={mockNote} />);
      expect(screen.getByText('Meeting Notes')).toBeInTheDocument();
    });

    it('should render note body', () => {
      render(<NotesCard note={mockNote} />);
      expect(screen.getByText(/Discussed project timeline/)).toBeInTheDocument();
    });

    it('should render all tags', () => {
      render(<NotesCard note={mockNote} />);
      expect(screen.getByText('work')).toBeInTheDocument();
      expect(screen.getByText('meeting')).toBeInTheDocument();
      expect(screen.getByText('important')).toBeInTheDocument();
    });

    it('should render created date', () => {
      render(<NotesCard note={mockNote} />);
      expect(screen.getByText(/2024-01-15/)).toBeInTheDocument();
    });
  });

  describe('Rendering - Minimum Required Data', () => {
    it('should render correctly with minimum required data', () => {
      render(<NotesCard note={minimalNote} />);
      expect(screen.getByText('Quick Note')).toBeInTheDocument();
      expect(screen.getByText('Remember to buy milk')).toBeInTheDocument();
    });

    it('should render without tags when tags array is empty', () => {
      render(<NotesCard note={minimalNote} />);
      expect(screen.queryByText('work')).not.toBeInTheDocument();
    });

    it('should handle note with empty body', () => {
      const emptyBodyNote = { ...minimalNote, body: '' };
      render(<NotesCard note={emptyBodyNote} />);
      expect(screen.getByText('Quick Note')).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should apply correct width', () => {
      const { container } = render(<NotesCard note={mockNote} />);
      const card = container.firstChild;
      expect(card).toHaveClass('w-note-card-width');
    });

    it('should apply correct height', () => {
      const { container } = render(<NotesCard note={mockNote} />);
      const card = container.firstChild;
      expect(card).toHaveClass('h-note-card-height');
    });

    it('should apply correct padding', () => {
      const { container } = render(<NotesCard note={mockNote} />);
      const card = container.firstChild;
      expect(card).toHaveClass('p-4');
    });

    it('should apply correct border radius', () => {
      const { container } = render(<NotesCard note={mockNote} />);
      const card = container.firstChild;
      expect(card).toHaveClass('rounded-lg');
    });

    it('should apply box shadow', () => {
      const { container } = render(<NotesCard note={mockNote} />);
      const card = container.firstChild;
      expect(card).toHaveClass('shadow-card');
    });
  });

  describe('Typography', () => {
    it('should apply correct title font size', () => {
      render(<NotesCard note={mockNote} />);
      const title = screen.getByText('Meeting Notes');
      expect(title).toHaveClass('text-2xl');
    });

    it('should apply correct title font weight', () => {
      render(<NotesCard note={mockNote} />);
      const title = screen.getByText('Meeting Notes');
      expect(title).toHaveClass('font-semibold');
    });

    it('should apply correct body font size', () => {
      render(<NotesCard note={mockNote} />);
      const body = screen.getByText(/Discussed project timeline/);
      expect(body).toHaveClass('text-base');
    });

    it('should apply line clamp to body', () => {
      render(<NotesCard note={mockNote} />);
      const body = screen.getByText(/Discussed project timeline/);
      expect(body).toHaveClass('line-clamp-3');
    });
  });

  describe('Tags Display', () => {
    it('should render tags container when tags exist', () => {
      const { container } = render(<NotesCard note={mockNote} />);
      const tags = container.querySelectorAll('[data-testid="tag"]');
      expect(tags.length).toBe(3);
    });

    it('should not render tags container when tags array is empty', () => {
      const { container } = render(<NotesCard note={minimalNote} />);
      const tags = container.querySelectorAll('[data-testid="tag"]');
      expect(tags.length).toBe(0);
    });

    it('should apply correct tag styling', () => {
      render(<NotesCard note={mockNote} />);
      const tag = screen.getByText('work');
      expect(tag).toHaveClass('text-sm');
    });

    it('should limit number of visible tags', () => {
      const manyTagsNote = {
        ...mockNote,
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6'],
      };
      render(<NotesCard note={manyTagsNote} />);
      // Should show max 3 tags + "more" indicator
      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
      expect(screen.getByText('tag3')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onClick with note id when card is clicked', () => {
      const handleClick = jest.fn();
      const { container } = render(<NotesCard note={mockNote} onClick={handleClick} />);
      const card = container.firstChild as HTMLElement;
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledWith('1');
    });

    it('should not call onClick when not provided', () => {
      const { container } = render(<NotesCard note={mockNote} />);
      const card = container.firstChild as HTMLElement;
      expect(() => fireEvent.click(card)).not.toThrow();
    });

    it('should apply cursor pointer when onClick is provided', () => {
      const { container } = render(<NotesCard note={mockNote} onClick={() => {}} />);
      const card = container.firstChild;
      expect(card).toHaveClass('cursor-pointer');
    });

    it('should apply hover shadow', () => {
      const { container } = render(<NotesCard note={mockNote} />);
      const card = container.firstChild;
      expect(card).toHaveClass('hover:shadow-card-hover');
    });
  });

  describe('Selected State', () => {
    it('should apply selected styling when selected is true', () => {
      const { container } = render(<NotesCard note={mockNote} selected />);
      const card = container.firstChild;
      expect(card).toHaveClass('border-brand-primary');
    });

    it('should not apply selected styling when selected is false', () => {
      const { container } = render(<NotesCard note={mockNote} selected={false} />);
      const card = container.firstChild;
      expect(card).not.toHaveClass('border-brand-primary');
    });

    it('should apply selected background', () => {
      const { container } = render(<NotesCard note={mockNote} selected />);
      const card = container.firstChild;
      expect(card).toHaveClass('bg-bg-tertiary');
    });
  });

  describe('Content Overflow', () => {
    it('should truncate long title', () => {
      const longTitleNote = {
        ...mockNote,
        title: 'A'.repeat(100),
      };
      render(<NotesCard note={longTitleNote} />);
      const title = screen.getByText('A'.repeat(100));
      expect(title).toHaveClass('truncate');
    });

    it('should clamp long body text', () => {
      const longBodyNote = {
        ...mockNote,
        body: 'Lorem ipsum dolor sit amet. '.repeat(50),
      };
      render(<NotesCard note={longBodyNote} />);
      const body = screen.getByText(/Lorem ipsum/);
      expect(body).toHaveClass('line-clamp-3');
    });
  });

  describe('Date Formatting', () => {
    it('should format createdAt date', () => {
      render(<NotesCard note={mockNote} />);
      // Should display formatted date
      expect(screen.getByText(/2024-01-15/)).toBeInTheDocument();
    });

    it('should handle different date formats', () => {
      const differentDateNote = {
        ...mockNote,
        createdAt: '2024-12-25T00:00:00Z',
      };
      render(<NotesCard note={differentDateNote} />);
      expect(screen.getByText(/2024-12-25/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have article role', () => {
      render(<NotesCard note={mockNote} />);
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('should be keyboard accessible when clickable', () => {
      render(<NotesCard note={mockNote} onClick={() => {}} />);
      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('should not have tabIndex when not clickable', () => {
      render(<NotesCard note={mockNote} />);
      const card = screen.getByRole('article');
      expect(card).not.toHaveAttribute('tabIndex');
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot with full data', () => {
      const { container } = render(<NotesCard note={mockNote} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with minimal data', () => {
      const { container } = render(<NotesCard note={minimalNote} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot when selected', () => {
      const { container } = render(<NotesCard note={mockNote} selected />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with many tags', () => {
      const manyTagsNote = {
        ...mockNote,
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
      };
      const { container } = render(<NotesCard note={manyTagsNote} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
