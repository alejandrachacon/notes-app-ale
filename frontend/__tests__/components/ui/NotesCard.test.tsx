import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotesCard } from '../../../src/components/ui/NotesCard';

describe('NotesCard', () => {
  const mockNote = {
    id: '1',
    title: 'Test Note',
    content: 'This is a test note content',
    category: 'Personal',
    createdAt: '2024-01-15',
  };

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<NotesCard {...mockNote} />);
      expect(screen.getByText('Test Note')).toBeInTheDocument();
    });

    it('should render note title', () => {
      render(<NotesCard {...mockNote} />);
      expect(screen.getByText('Test Note')).toBeInTheDocument();
    });

    it('should render note content', () => {
      render(<NotesCard {...mockNote} />);
      expect(screen.getByText('This is a test note content')).toBeInTheDocument();
    });

    it('should render category', () => {
      render(<NotesCard {...mockNote} />);
      expect(screen.getByText('Personal')).toBeInTheDocument();
    });

    it('should render created date', () => {
      render(<NotesCard {...mockNote} />);
      expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    });

    it('should render without category when not provided', () => {
      const { category, ...noteWithoutCategory } = mockNote;
      render(<NotesCard {...noteWithoutCategory} />);
      expect(screen.queryByText('Personal')).not.toBeInTheDocument();
    });

    it('should truncate long content', () => {
      const longContent = 'A'.repeat(300);
      render(<NotesCard {...mockNote} content={longContent} />);
      const contentElement = screen.getByText(longContent, { exact: false });
      expect(contentElement).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should apply correct width', () => {
      const { container } = render(<NotesCard {...mockNote} />);
      const card = container.firstChild;
      expect(card).toHaveClass('w-note-card-width');
    });

    it('should apply correct height', () => {
      const { container } = render(<NotesCard {...mockNote} />);
      const card = container.firstChild;
      expect(card).toHaveClass('h-note-card-height');
    });

    it('should apply correct padding', () => {
      const { container } = render(<NotesCard {...mockNote} />);
      const card = container.firstChild;
      expect(card).toHaveClass('p-4');
    });

    it('should apply correct border radius', () => {
      const { container } = render(<NotesCard {...mockNote} />);
      const card = container.firstChild;
      expect(card).toHaveClass('rounded-lg');
    });

    it('should apply box shadow', () => {
      const { container } = render(<NotesCard {...mockNote} />);
      const card = container.firstChild;
      expect(card).toHaveClass('shadow-card');
    });

    it('should apply background color', () => {
      const { container } = render(<NotesCard {...mockNote} />);
      const card = container.firstChild;
      expect(card).toHaveClass('bg-bg-card');
    });

    it('should apply border', () => {
      const { container } = render(<NotesCard {...mockNote} />);
      const card = container.firstChild;
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('border-border-light');
    });
  });

  describe('Typography', () => {
    it('should apply correct title font size', () => {
      render(<NotesCard {...mockNote} />);
      const title = screen.getByText('Test Note');
      expect(title).toHaveClass('text-2xl');
    });

    it('should apply correct title font weight', () => {
      render(<NotesCard {...mockNote} />);
      const title = screen.getByText('Test Note');
      expect(title).toHaveClass('font-semibold');
    });

    it('should apply correct content font size', () => {
      render(<NotesCard {...mockNote} />);
      const content = screen.getByText('This is a test note content');
      expect(content).toHaveClass('text-base');
    });

    it('should apply correct content color', () => {
      render(<NotesCard {...mockNote} />);
      const content = screen.getByText('This is a test note content');
      expect(content).toHaveClass('text-text-secondary');
    });

    it('should apply correct category font size', () => {
      render(<NotesCard {...mockNote} />);
      const category = screen.getByText('Personal');
      expect(category).toHaveClass('text-sm');
    });
  });

  describe('Interactions', () => {
    it('should call onClick when card is clicked', () => {
      const handleClick = jest.fn();
      const { container } = render(<NotesCard {...mockNote} onClick={handleClick} />);
      const card = container.firstChild as HTMLElement;
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should pass note id to onClick handler', () => {
      const handleClick = jest.fn();
      render(<NotesCard {...mockNote} onClick={handleClick} />);
      const card = screen.getByText('Test Note').closest('div');
      fireEvent.click(card!);
      expect(handleClick).toHaveBeenCalled();
    });

    it('should apply hover shadow', () => {
      const { container } = render(<NotesCard {...mockNote} />);
      const card = container.firstChild;
      expect(card).toHaveClass('hover:shadow-card-hover');
    });

    it('should apply transition classes', () => {
      const { container } = render(<NotesCard {...mockNote} />);
      const card = container.firstChild;
      expect(card).toHaveClass('transition-shadow');
      expect(card).toHaveClass('duration-base');
    });

    it('should apply cursor pointer when onClick is provided', () => {
      const { container } = render(<NotesCard {...mockNote} onClick={() => {}} />);
      const card = container.firstChild;
      expect(card).toHaveClass('cursor-pointer');
    });
  });

  describe('Variants', () => {
    it('should render with default variant', () => {
      const { container } = render(<NotesCard {...mockNote} />);
      const card = container.firstChild;
      expect(card).toHaveClass('bg-bg-card');
    });

    it('should render with highlighted variant', () => {
      const { container } = render(<NotesCard {...mockNote} variant="highlighted" />);
      const card = container.firstChild;
      expect(card).toHaveClass('border-brand-primary');
    });

    it('should render with compact variant', () => {
      const { container } = render(<NotesCard {...mockNote} variant="compact" />);
      const card = container.firstChild;
      expect(card).toHaveClass('p-3');
    });
  });

  describe('States', () => {
    it('should handle disabled state', () => {
      const { container } = render(<NotesCard {...mockNote} disabled />);
      const card = container.firstChild;
      expect(card).toHaveClass('opacity-50');
      expect(card).toHaveClass('cursor-not-allowed');
    });

    it('should not trigger onClick when disabled', () => {
      const handleClick = jest.fn();
      const { container } = render(<NotesCard {...mockNote} disabled onClick={handleClick} />);
      const card = container.firstChild as HTMLElement;
      fireEvent.click(card);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should show selected state', () => {
      const { container } = render(<NotesCard {...mockNote} selected />);
      const card = container.firstChild;
      expect(card).toHaveClass('border-brand-primary');
      expect(card).toHaveClass('bg-bg-tertiary');
    });
  });

  describe('Custom Props', () => {
    it('should accept and apply custom className', () => {
      const { container } = render(<NotesCard {...mockNote} className="custom-class" />);
      const card = container.firstChild;
      expect(card).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<NotesCard {...mockNote} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Content Overflow', () => {
    it('should apply line clamp to content', () => {
      render(<NotesCard {...mockNote} />);
      const content = screen.getByText('This is a test note content');
      expect(content).toHaveClass('line-clamp-3');
    });

    it('should apply overflow hidden', () => {
      render(<NotesCard {...mockNote} />);
      const content = screen.getByText('This is a test note content');
      expect(content).toHaveClass('overflow-hidden');
    });
  });

  describe('Accessibility', () => {
    it('should have article role', () => {
      render(<NotesCard {...mockNote} />);
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<NotesCard {...mockNote} aria-label="Note card" />);
      expect(screen.getByLabelText('Note card')).toBeInTheDocument();
    });

    it('should be keyboard accessible when clickable', () => {
      const handleClick = jest.fn();
      render(<NotesCard {...mockNote} onClick={handleClick} />);
      const card = screen.getByRole('article');
      card.focus();
      expect(card).toHaveFocus();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot for default variant', () => {
      const { container } = render(<NotesCard {...mockNote} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for highlighted variant', () => {
      const { container } = render(<NotesCard {...mockNote} variant="highlighted" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for compact variant', () => {
      const { container } = render(<NotesCard {...mockNote} variant="compact" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for selected state', () => {
      const { container } = render(<NotesCard {...mockNote} selected />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for disabled state', () => {
      const { container } = render(<NotesCard {...mockNote} disabled />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
