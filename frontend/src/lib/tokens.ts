// src/lib/tokens.ts
// Design tokens from Figma — Notes Taking App
// Based on figma-context.md design spec

export const tokens = {
  colors: {
    // Background colors from Figma spec
    background: '#FAF1E3',
    surface: '#FAF1E3',
    
    // Border colors
    border: '#E5E7EB',
    borderPrimary: '#957139',
    
    // Text colors
    textPrimary: '#947038',
    textSecondary: '#000000',
    
    // Button/Interactive colors
    buttonBorder: '#957139',
    buttonHover: 'rgba(149, 113, 57, 0.2)', // #957139 / 20%
    
    // Category colors (from existing design)
    categoryRandomThoughts: '#8B5CF6',
    categorySchool: '#3B82F6',
    categoryPersonal: '#10B981',
    categoryDefault: '#6B7280',
  },
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Inria Serif, serif',
      mono: 'JetBrains Mono, monospace',
    },
    scale: {
      xs:   '0.75rem',   // 12px - Figma base
      sm:   '0.875rem',  // 14px
      base: '1rem',      // 16px
      lg:   '1.125rem',  // 18px
      xl:   '1.25rem',   // 20px
      '2xl':'1.5rem',    // 24px
      '3xl':'1.875rem',  // 30px
      '4xl':'2.25rem',   // 36px
      '5xl':'3rem',      // 48px
    },
    weight: {
      normal:    400,
      medium:    500,
      semibold:  600,
      bold:      700,
    },
    lineHeight: {
      tight:  '1.25',
      snug:   '1.375',
      normal: '1.5',
      relaxed:'1.625',
    },
  },
  spacing: {
    px:   '1px',
    0.5:  '0.125rem',
    1:    '0.25rem',
    2:    '0.5rem',
    3:    '0.75rem',
    4:    '1rem',
    5:    '1.25rem',
    6:    '1.5rem',
    7:    '1.75rem',
    8:    '2rem',
    10:   '2.5rem',
    12:   '3rem',
    16:   '4rem',
    20:   '5rem',
    24:   '6rem',
  },
  radius: {
    none: '0',
    sm:   '0.25rem',   // 4px
    md:   '0.375rem',  // 6px - Figma 5px
    lg:   '0.5rem',    // 8px - Figma base
    xl:   '0.75rem',   // 12px
    '2xl':'1rem',      // 16px
    '3xl':'2.875rem',  // 46px - Figma button radius
    full: '9999px',
  },
  shadows: {
    sm:  '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md:  '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg:  '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl:  '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
} as const

export type ColorToken = keyof typeof tokens.colors
export type Tokens = typeof tokens
