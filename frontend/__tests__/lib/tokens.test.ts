import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  transitions,
  breakpoints,
  tokens,
} from '../../src/lib/tokens';

describe('Design Tokens', () => {
  describe('colors', () => {
    it('should have brand colors', () => {
      expect(colors.brand).toBeDefined();
      expect(colors.brand.primary).toBe('#3B82F6');
      expect(colors.brand.primaryHover).toBe('#2563EB');
      expect(colors.brand.primaryPressed).toBe('#1D4ED8');
    });

    it('should have background colors', () => {
      expect(colors.background).toBeDefined();
      expect(colors.background.primary).toBe('#FFFFFF');
      expect(colors.background.secondary).toBe('#F9FAFB');
      expect(colors.background.tertiary).toBe('#F3F4F6');
      expect(colors.background.card).toBe('#FFFFFF');
      expect(colors.background.overlay).toBe('rgba(0, 0, 0, 0.5)');
    });

    it('should have text colors', () => {
      expect(colors.text).toBeDefined();
      expect(colors.text.primary).toBe('#111827');
      expect(colors.text.secondary).toBe('#6B7280');
      expect(colors.text.tertiary).toBe('#9CA3AF');
      expect(colors.text.inverse).toBe('#FFFFFF');
      expect(colors.text.link).toBe('#3B82F6');
      expect(colors.text.placeholder).toBe('#9CA3AF');
    });

    it('should have border colors', () => {
      expect(colors.border).toBeDefined();
      expect(colors.border.default).toBe('#E5E7EB');
      expect(colors.border.light).toBe('#F3F4F6');
      expect(colors.border.focus).toBe('#3B82F6');
      expect(colors.border.hover).toBe('#D1D5DB');
    });

    it('should have state colors', () => {
      expect(colors.state).toBeDefined();
      expect(colors.state.success).toBe('#10B981');
      expect(colors.state.error).toBe('#EF4444');
      expect(colors.state.warning).toBe('#F59E0B');
      expect(colors.state.info).toBe('#3B82F6');
    });

    it('should have category colors', () => {
      expect(colors.category).toBeDefined();
      expect(colors.category.randomThoughts).toBe('#8B5CF6');
      expect(colors.category.school).toBe('#3B82F6');
      expect(colors.category.personal).toBe('#10B981');
      expect(colors.category.default).toBe('#6B7280');
    });

    it('should have valid hex color format for brand colors', () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i;
      expect(colors.brand.primary).toMatch(hexColorRegex);
      expect(colors.brand.primaryHover).toMatch(hexColorRegex);
      expect(colors.brand.primaryPressed).toMatch(hexColorRegex);
    });
  });

  describe('typography', () => {
    it('should have font families', () => {
      expect(typography.fontFamily).toBeDefined();
      expect(typography.fontFamily.sans).toContain('Inter');
      expect(typography.fontFamily.mono).toContain('Fira Code');
    });

    it('should have font sizes', () => {
      expect(typography.fontSize).toBeDefined();
      expect(typography.fontSize.xs).toBe('12px');
      expect(typography.fontSize.sm).toBe('14px');
      expect(typography.fontSize.base).toBe('15px');
      expect(typography.fontSize.lg).toBe('18px');
      expect(typography.fontSize.xl).toBe('20px');
      expect(typography.fontSize['2xl']).toBe('24px');
      expect(typography.fontSize['3xl']).toBe('30px');
      expect(typography.fontSize['4xl']).toBe('36px');
      expect(typography.fontSize['5xl']).toBe('48px');
    });

    it('should have font weights', () => {
      expect(typography.fontWeight).toBeDefined();
      expect(typography.fontWeight.normal).toBe(400);
      expect(typography.fontWeight.medium).toBe(500);
      expect(typography.fontWeight.semibold).toBe(600);
      expect(typography.fontWeight.bold).toBe(700);
      expect(typography.fontWeight.extrabold).toBe(800);
    });

    it('should have line heights', () => {
      expect(typography.lineHeight).toBeDefined();
      expect(typography.lineHeight.tight).toBe(1.2);
      expect(typography.lineHeight.normal).toBe(1.5);
      expect(typography.lineHeight.relaxed).toBe(1.75);
      expect(typography.lineHeight.loose).toBe(2);
    });

    it('should have letter spacing', () => {
      expect(typography.letterSpacing).toBeDefined();
      expect(typography.letterSpacing.tighter).toBe('-0.05em');
      expect(typography.letterSpacing.tight).toBe('-0.025em');
      expect(typography.letterSpacing.normal).toBe('0');
      expect(typography.letterSpacing.wide).toBe('0.025em');
      expect(typography.letterSpacing.wider).toBe('0.05em');
      expect(typography.letterSpacing.widest).toBe('0.1em');
    });

    it('should have valid pixel values for font sizes', () => {
      const pxRegex = /^\d+px$/;
      Object.values(typography.fontSize).forEach((size) => {
        expect(size).toMatch(pxRegex);
      });
    });
  });

  describe('spacing', () => {
    it('should have base spacing values', () => {
      expect(spacing[0]).toBe('0px');
      expect(spacing[1]).toBe('4px');
      expect(spacing[2]).toBe('8px');
      expect(spacing[4]).toBe('16px');
      expect(spacing[8]).toBe('32px');
      expect(spacing[16]).toBe('64px');
    });

    it('should have component-specific spacing', () => {
      expect(spacing.component).toBeDefined();
      expect(spacing.component.sidebarWidth).toBe('288px');
      expect(spacing.component.sidebarPadding).toBe('23px');
      expect(spacing.component.cardGap).toBe('16px');
      expect(spacing.component.categoryItemHeight).toBe('32px');
      expect(spacing.component.buttonHeight).toBe('43px');
      expect(spacing.component.dropdownHeight).toBe('39px');
      expect(spacing.component.noteCardWidth).toBe('303px');
      expect(spacing.component.noteCardHeight).toBe('246px');
    });

    it('should have valid pixel values', () => {
      const pxRegex = /^\d+px$/;
      Object.values(spacing.component).forEach((value) => {
        expect(value).toMatch(pxRegex);
      });
    });
  });

  describe('borderRadius', () => {
    it('should have all border radius values', () => {
      expect(borderRadius.none).toBe('0px');
      expect(borderRadius.sm).toBe('4px');
      expect(borderRadius.base).toBe('8px');
      expect(borderRadius.md).toBe('12px');
      expect(borderRadius.lg).toBe('16px');
      expect(borderRadius.xl).toBe('20px');
      expect(borderRadius['2xl']).toBe('24px');
      expect(borderRadius.full).toBe('9999px');
    });

    it('should have valid pixel values or full', () => {
      const validRegex = /^(\d+px|9999px)$/;
      Object.values(borderRadius).forEach((value) => {
        expect(value).toMatch(validRegex);
      });
    });
  });

  describe('shadows', () => {
    it('should have base shadow values', () => {
      expect(shadows.none).toBe('none');
      expect(shadows.sm).toBeDefined();
      expect(shadows.base).toBeDefined();
      expect(shadows.md).toBeDefined();
      expect(shadows.lg).toBeDefined();
      expect(shadows.xl).toBeDefined();
      expect(shadows['2xl']).toBeDefined();
    });

    it('should have component-specific shadows', () => {
      expect(shadows.card).toBeDefined();
      expect(shadows.cardHover).toBeDefined();
      expect(shadows.dropdown).toBeDefined();
      expect(shadows.button).toBeDefined();
      expect(shadows.buttonHover).toBeDefined();
    });

    it('should have valid shadow format', () => {
      const shadowRegex = /^(none|(\d+px\s+\d+px\s+\d+px\s+\d+px\s+rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)))/;
      expect(shadows.none).toBe('none');
      expect(shadows.card).toContain('rgba');
      expect(shadows.button).toContain('rgba');
    });
  });

  describe('zIndex', () => {
    it('should have all z-index values', () => {
      expect(zIndex.base).toBe(0);
      expect(zIndex.dropdown).toBe(10);
      expect(zIndex.sticky).toBe(20);
      expect(zIndex.overlay).toBe(30);
      expect(zIndex.modal).toBe(40);
      expect(zIndex.popover).toBe(50);
      expect(zIndex.tooltip).toBe(60);
    });

    it('should have ascending z-index values', () => {
      expect(zIndex.base).toBeLessThan(zIndex.dropdown);
      expect(zIndex.dropdown).toBeLessThan(zIndex.sticky);
      expect(zIndex.sticky).toBeLessThan(zIndex.overlay);
      expect(zIndex.overlay).toBeLessThan(zIndex.modal);
      expect(zIndex.modal).toBeLessThan(zIndex.popover);
      expect(zIndex.popover).toBeLessThan(zIndex.tooltip);
    });
  });

  describe('transitions', () => {
    it('should have duration values', () => {
      expect(transitions.duration).toBeDefined();
      expect(transitions.duration.fast).toBe('150ms');
      expect(transitions.duration.base).toBe('200ms');
      expect(transitions.duration.slow).toBe('300ms');
      expect(transitions.duration.slower).toBe('500ms');
    });

    it('should have timing functions', () => {
      expect(transitions.timing).toBeDefined();
      expect(transitions.timing.linear).toBe('linear');
      expect(transitions.timing.ease).toBe('ease');
      expect(transitions.timing.easeIn).toBe('ease-in');
      expect(transitions.timing.easeOut).toBe('ease-out');
      expect(transitions.timing.easeInOut).toBe('ease-in-out');
    });

    it('should have preset transitions', () => {
      expect(transitions.default).toBe('all 200ms ease-in-out');
      expect(transitions.fast).toBe('all 150ms ease-in-out');
      expect(transitions.slow).toBe('all 300ms ease-in-out');
    });

    it('should have valid millisecond values', () => {
      const msRegex = /^\d+ms$/;
      Object.values(transitions.duration).forEach((value) => {
        expect(value).toMatch(msRegex);
      });
    });
  });

  describe('breakpoints', () => {
    it('should have all breakpoint values', () => {
      expect(breakpoints.sm).toBe('640px');
      expect(breakpoints.md).toBe('768px');
      expect(breakpoints.lg).toBe('1024px');
      expect(breakpoints.xl).toBe('1280px');
      expect(breakpoints['2xl']).toBe('1536px');
    });

    it('should have ascending breakpoint values', () => {
      const sm = parseInt(breakpoints.sm);
      const md = parseInt(breakpoints.md);
      const lg = parseInt(breakpoints.lg);
      const xl = parseInt(breakpoints.xl);
      const xxl = parseInt(breakpoints['2xl']);

      expect(sm).toBeLessThan(md);
      expect(md).toBeLessThan(lg);
      expect(lg).toBeLessThan(xl);
      expect(xl).toBeLessThan(xxl);
    });
  });

  describe('tokens object', () => {
    it('should export all token categories', () => {
      expect(tokens.colors).toBe(colors);
      expect(tokens.typography).toBe(typography);
      expect(tokens.spacing).toBe(spacing);
      expect(tokens.borderRadius).toBe(borderRadius);
      expect(tokens.shadows).toBe(shadows);
      expect(tokens.zIndex).toBe(zIndex);
      expect(tokens.transitions).toBe(transitions);
      expect(tokens.breakpoints).toBe(breakpoints);
    });

    it('should be immutable (readonly)', () => {
      expect(() => {
        // @ts-expect-error - Testing immutability
        tokens.colors = {};
      }).toThrow();
    });
  });

  describe('token structure validation', () => {
    it('should not have undefined values in colors', () => {
      const checkUndefined = (obj: any): void => {
        Object.values(obj).forEach((value) => {
          if (typeof value === 'object' && value !== null) {
            checkUndefined(value);
          } else {
            expect(value).toBeDefined();
          }
        });
      };
      checkUndefined(colors);
    });

    it('should have consistent naming conventions', () => {
      // Check that all color keys use camelCase
      const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
      Object.keys(colors).forEach((key) => {
        expect(key).toMatch(camelCaseRegex);
      });
    });
  });
});
