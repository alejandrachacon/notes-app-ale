import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../../../src/components/ui/Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    it('should render with default variant', () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-brand-primary');
    });

    it('should render with secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-bg-secondary');
    });

    it('should render with outline variant', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-border-default');
    });

    it('should render with ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent');
    });
  });

  describe('Sizes', () => {
    it('should render with default size', () => {
      render(<Button>Default Size</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-button-height');
    });

    it('should render with small size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8');
    });

    it('should render with large size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12');
    });
  });

  describe('States', () => {
    it('should handle disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50');
      expect(button).toHaveClass('cursor-not-allowed');
    });

    it('should not trigger onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should show loading state', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle onClick event', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should apply hover classes on hover', () => {
      render(<Button>Hover me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-brand-primary-hover');
    });

    it('should apply active/pressed classes', () => {
      render(<Button>Press me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('active:bg-brand-primary-pressed');
    });
  });

  describe('Styling', () => {
    it('should apply correct Tailwind classes for padding', () => {
      render(<Button>Padded</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6');
    });

    it('should apply correct border radius', () => {
      render(<Button>Rounded</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-base');
    });

    it('should apply correct font styles', () => {
      render(<Button>Styled Text</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('font-semibold');
      expect(button).toHaveClass('text-base');
    });

    it('should apply box shadow', () => {
      render(<Button>Shadow</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('shadow-button');
    });

    it('should apply transition classes', () => {
      render(<Button>Transition</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-all');
      expect(button).toHaveClass('duration-base');
    });
  });

  describe('Custom Props', () => {
    it('should accept and apply custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should accept type prop', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref Button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Accessibility', () => {
    it('should have button role', () => {
      render(<Button>Accessible</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<Button aria-label="Close dialog">X</Button>);
      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Keyboard</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot for default variant', () => {
      const { container } = render(<Button>Default</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for secondary variant', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for outline variant', () => {
      const { container } = render(<Button variant="outline">Outline</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for ghost variant', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for disabled state', () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for loading state', () => {
      const { container } = render(<Button loading>Loading</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
