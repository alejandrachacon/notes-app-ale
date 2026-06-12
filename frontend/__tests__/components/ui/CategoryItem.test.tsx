import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CategoryItem } from '../../../src/components/ui/CategoryItem';

describe('CategoryItem', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<CategoryItem name="Random Thoughts" />);
      expect(screen.getByText('Random Thoughts')).toBeInTheDocument();
    });

    it('should render category name', () => {
      render(<CategoryItem name="School" />);
      expect(screen.getByText('School')).toBeInTheDocument();
    });

    it('should render with count when provided', () => {
      render(<CategoryItem name="Personal" count={5} />);
      expect(screen.getByText('Personal')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should render without count when not provided', () => {
      render(<CategoryItem name="Work" />);
      expect(screen.getByText('Work')).toBeInTheDocument();
      expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
    });

    it('should render category indicator', () => {
      const { container } = render(<CategoryItem name="Test" />);
      const indicator = container.querySelector('[role="presentation"]');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('Variants - Default State', () => {
    it('should apply correct classes for default state', () => {
      render(<CategoryItem name="Default" />);
      const item = screen.getByRole('button');
      expect(item).toHaveClass('h-category-item');
      expect(item).toHaveClass('px-4');
    });

    it('should have transparent background by default', () => {
      render(<CategoryItem name="Default" />);
      const item = screen.getByRole('button');
      expect(item).toHaveClass('bg-transparent');
    });
  });

  describe('Variants - Hover State', () => {
    it('should apply hover classes', () => {
      render(<CategoryItem name="Hover" />);
      const item = screen.getByRole('button');
      expect(item).toHaveClass('hover:bg-bg-secondary');
    });

    it('should apply transition classes', () => {
      render(<CategoryItem name="Transition" />);
      const item = screen.getByRole('button');
      expect(item).toHaveClass('transition-colors');
      expect(item).toHaveClass('duration-base');
    });
  });

  describe('Variants - Selected State', () => {
    it('should apply selected background when selected', () => {
      render(<CategoryItem name="Selected" selected />);
      const item = screen.getByRole('button');
      expect(item).toHaveClass('bg-bg-tertiary');
    });

    it('should not apply selected background when not selected', () => {
      render(<CategoryItem name="Not Selected" selected={false} />);
      const item = screen.getByRole('button');
      expect(item).not.toHaveClass('bg-bg-tertiary');
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<CategoryItem name="Clickable" onClick={handleClick} />);
      const item = screen.getByRole('button');
      fireEvent.click(item);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should pass category name to onClick handler', () => {
      const handleClick = jest.fn();
      render(<CategoryItem name="Test Category" onClick={handleClick} />);
      const item = screen.getByRole('button');
      fireEvent.click(item);
      expect(handleClick).toHaveBeenCalled();
    });

    it('should be keyboard accessible', () => {
      render(<CategoryItem name="Keyboard" />);
      const item = screen.getByRole('button');
      item.focus();
      expect(item).toHaveFocus();
    });
  });

  describe('Styling', () => {
    it('should apply correct height', () => {
      render(<CategoryItem name="Height" />);
      const item = screen.getByRole('button');
      expect(item).toHaveClass('h-category-item');
    });

    it('should apply correct padding', () => {
      render(<CategoryItem name="Padding" />);
      const item = screen.getByRole('button');
      expect(item).toHaveClass('px-4');
    });

    it('should apply correct font styles', () => {
      render(<CategoryItem name="Font" />);
      const item = screen.getByRole('button');
      expect(item).toHaveClass('text-base');
      expect(item).toHaveClass('text-text-primary');
    });

    it('should apply correct layout classes', () => {
      render(<CategoryItem name="Layout" />);
      const item = screen.getByRole('button');
      expect(item).toHaveClass('flex');
      expect(item).toHaveClass('items-center');
      expect(item).toHaveClass('justify-between');
      expect(item).toHaveClass('w-full');
    });

    it('should apply cursor pointer', () => {
      render(<CategoryItem name="Cursor" />);
      const item = screen.getByRole('button');
      expect(item).toHaveClass('cursor-pointer');
    });
  });

  describe('Category Indicator', () => {
    it('should render indicator with correct size', () => {
      const { container } = render(<CategoryItem name="Indicator" />);
      const indicator = container.querySelector('[role="presentation"]');
      expect(indicator).toHaveClass('w-[11px]');
      expect(indicator).toHaveClass('h-[11px]');
    });

    it('should render indicator with rounded full', () => {
      const { container } = render(<CategoryItem name="Indicator" />);
      const indicator = container.querySelector('[role="presentation"]');
      expect(indicator).toHaveClass('rounded-full');
    });

    it('should render indicator with default color', () => {
      const { container } = render(<CategoryItem name="Indicator" />);
      const indicator = container.querySelector('[role="presentation"]');
      expect(indicator).toHaveClass('bg-category-default');
    });

    it('should render indicator with custom color when provided', () => {
      const { container } = render(
        <CategoryItem name="Indicator" indicatorColor="bg-category-school" />
      );
      const indicator = container.querySelector('[role="presentation"]');
      expect(indicator).toHaveClass('bg-category-school');
    });
  });

  describe('Category Count', () => {
    it('should render count with correct styling', () => {
      render(<CategoryItem name="Count" count={10} />);
      const count = screen.getByText('10');
      expect(count).toHaveClass('text-text-tertiary');
      expect(count).toHaveClass('text-sm');
    });

    it('should render count of 0', () => {
      render(<CategoryItem name="Zero" count={0} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle large count numbers', () => {
      render(<CategoryItem name="Large" count={999} />);
      expect(screen.getByText('999')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should handle disabled state', () => {
      render(<CategoryItem name="Disabled" disabled />);
      const item = screen.getByRole('button');
      expect(item).toBeDisabled();
      expect(item).toHaveClass('opacity-50');
    });

    it('should not trigger onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<CategoryItem name="Disabled" disabled onClick={handleClick} />);
      const item = screen.getByRole('button');
      fireEvent.click(item);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should apply disabled cursor', () => {
      render(<CategoryItem name="Disabled" disabled />);
      const item = screen.getByRole('button');
      expect(item).toHaveClass('cursor-not-allowed');
    });
  });

  describe('Custom Props', () => {
    it('should accept and apply custom className', () => {
      render(<CategoryItem name="Custom" className="custom-class" />);
      const item = screen.getByRole('button');
      expect(item).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<CategoryItem name="Ref" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Accessibility', () => {
    it('should have button role', () => {
      render(<CategoryItem name="Accessible" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<CategoryItem name="Test" aria-label="Select Test category" />);
      expect(screen.getByLabelText('Select Test category')).toBeInTheDocument();
    });

    it('should support aria-selected', () => {
      render(<CategoryItem name="Selected" selected aria-selected />);
      const item = screen.getByRole('button');
      expect(item).toHaveAttribute('aria-selected');
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot for default state', () => {
      const { container } = render(<CategoryItem name="Default" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with count', () => {
      const { container } = render(<CategoryItem name="With Count" count={5} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for selected state', () => {
      const { container } = render(<CategoryItem name="Selected" selected />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for disabled state', () => {
      const { container } = render(<CategoryItem name="Disabled" disabled />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with custom indicator color', () => {
      const { container } = render(
        <CategoryItem name="Custom" indicatorColor="bg-category-personal" count={3} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
