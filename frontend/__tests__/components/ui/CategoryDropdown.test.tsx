import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CategoryDropdown } from '../../../src/components/ui/CategoryDropdown';

describe('CategoryDropdown', () => {
  const mockCategories = [
    { id: '1', name: 'Random Thoughts', count: 3 },
    { id: '2', name: 'School', count: 3 },
    { id: '3', name: 'Personal', count: 1 },
  ];

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      expect(screen.getByText('All Categories')).toBeInTheDocument();
    });

    it('should render selected category', () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="Random Thoughts"
          onSelect={() => {}}
        />
      );
      expect(screen.getByText('Random Thoughts')).toBeInTheDocument();
    });

    it('should render with closed state by default', () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      const dropdown = screen.getByRole('button');
      expect(dropdown).toHaveClass('h-dropdown-height');
      expect(screen.queryByText('School')).not.toBeInTheDocument();
    });
  });

  describe('Variants - Closed State', () => {
    it('should apply correct classes for closed state', () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      const dropdown = screen.getByRole('button');
      expect(dropdown).toHaveClass('h-dropdown-height');
      expect(dropdown).toHaveClass('rounded-base');
      expect(dropdown).toHaveClass('border');
    });

    it('should show chevron icon in closed state', () => {
      const { container } = render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      const chevron = container.querySelector('svg');
      expect(chevron).toBeInTheDocument();
    });
  });

  describe('Variants - Open State', () => {
    it('should expand to show all categories when clicked', async () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      
      const dropdown = screen.getByRole('button');
      fireEvent.click(dropdown);

      await waitFor(() => {
        expect(screen.getByText('Random Thoughts')).toBeInTheDocument();
        expect(screen.getByText('School')).toBeInTheDocument();
        expect(screen.getByText('Personal')).toBeInTheDocument();
      });
    });

    it('should show category counts in open state', async () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const counts = screen.getAllByText('3');
        expect(counts.length).toBeGreaterThan(0);
        expect(screen.getByText('1')).toBeInTheDocument();
      });
    });

    it('should apply correct height for open state', async () => {
      const { container } = render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const dropdownContent = container.querySelector('[role="listbox"]');
        expect(dropdownContent).toBeInTheDocument();
      });
    });
  });

  describe('Interactions', () => {
    it('should call onSelect when category is clicked', async () => {
      const handleSelect = jest.fn();
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={handleSelect}
        />
      );
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        const schoolOption = screen.getByText('School');
        fireEvent.click(schoolOption);
      });

      expect(handleSelect).toHaveBeenCalledWith('School');
    });

    it('should close dropdown after selection', async () => {
      const handleSelect = jest.fn();
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={handleSelect}
        />
      );
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        const schoolOption = screen.getByText('School');
        fireEvent.click(schoolOption);
      });

      await waitFor(() => {
        expect(screen.queryByText('Personal')).not.toBeInTheDocument();
      });
    });

    it('should toggle open/close on button click', async () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      
      const button = screen.getByRole('button');
      
      // Open
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByText('School')).toBeInTheDocument();
      });

      // Close
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.queryByText('School')).not.toBeInTheDocument();
      });
    });

    it('should close dropdown when clicking outside', async () => {
      render(
        <div>
          <CategoryDropdown
            categories={mockCategories}
            selectedCategory="All Categories"
            onSelect={() => {}}
          />
          <div data-testid="outside">Outside</div>
        </div>
      );
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByText('School')).toBeInTheDocument();
      });

      fireEvent.mouseDown(screen.getByTestId('outside'));

      await waitFor(() => {
        expect(screen.queryByText('School')).not.toBeInTheDocument();
      });
    });
  });

  describe('Styling', () => {
    it('should apply correct padding', () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      const dropdown = screen.getByRole('button');
      expect(dropdown).toHaveClass('px-4');
    });

    it('should apply correct border radius', () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      const dropdown = screen.getByRole('button');
      expect(dropdown).toHaveClass('rounded-base');
    });

    it('should apply correct font styles', () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      const dropdown = screen.getByRole('button');
      expect(dropdown).toHaveClass('text-base');
    });

    it('should apply box shadow', () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      const dropdown = screen.getByRole('button');
      expect(dropdown).toHaveClass('shadow-dropdown');
    });

    it('should apply transition classes', () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      const dropdown = screen.getByRole('button');
      expect(dropdown).toHaveClass('transition-all');
    });
  });

  describe('Category Items', () => {
    it('should render category indicators', async () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const indicators = screen.getAllByRole('presentation');
        expect(indicators.length).toBeGreaterThan(0);
      });
    });

    it('should apply hover state to category items', async () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const schoolOption = screen.getByText('School').closest('button');
        expect(schoolOption).toHaveClass('hover:bg-bg-secondary');
      });
    });

    it('should show correct height for category items', async () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const schoolOption = screen.getByText('School').closest('button');
        expect(schoolOption).toHaveClass('h-category-item');
      });
    });
  });

  describe('Disabled State', () => {
    it('should handle disabled state', () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
          disabled
        />
      );
      const dropdown = screen.getByRole('button');
      expect(dropdown).toBeDisabled();
      expect(dropdown).toHaveClass('opacity-50');
    });

    it('should not open when disabled', () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
          disabled
        />
      );
      const dropdown = screen.getByRole('button');
      fireEvent.click(dropdown);
      expect(screen.queryByText('School')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have button role', () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should be keyboard accessible', async () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      const dropdown = screen.getByRole('button');
      dropdown.focus();
      expect(dropdown).toHaveFocus();
    });

    it('should support aria-expanded', async () => {
      render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      const dropdown = screen.getByRole('button');
      expect(dropdown).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(dropdown);
      
      await waitFor(() => {
        expect(dropdown).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot for closed state', () => {
      const { container } = render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for open state', async () => {
      const { container } = render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
        />
      );
      
      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByText('School')).toBeInTheDocument();
      });

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for disabled state', () => {
      const { container } = render(
        <CategoryDropdown
          categories={mockCategories}
          selectedCategory="All Categories"
          onSelect={() => {}}
          disabled
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
