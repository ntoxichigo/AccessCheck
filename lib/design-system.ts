/**
 * Design System Constants
 * Centralized design tokens for consistent UI across the application
 */

export const colors = {
  // Brand
  brand: {
    primary: 'from-blue-600 to-purple-600',
    gradient: 'bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600',
    dark: 'from-blue-950 via-purple-950 to-black/90',
  },
  
  // Backgrounds
  background: {
    dark: 'bg-gradient-to-br from-gray-900 via-black to-gray-800',
    light: 'bg-white',
    glass: 'bg-white/10 backdrop-blur-lg border border-white/10',
  },
  
  // Text
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    light: 'text-white',
    muted: 'text-gray-300',
  },
};

export const spacing = {
  // Page containers
  container: 'max-w-6xl mx-auto px-6',
  containerNarrow: 'max-w-4xl mx-auto px-6',
  containerWide: 'max-w-7xl mx-auto px-6',
  
  // Vertical spacing
  section: 'py-16',
  sectionLarge: 'py-24',
  
  // Component spacing
  card: 'p-6',
  cardLarge: 'p-8',
};

export const typography = {
  // Headings
  h1: 'text-5xl font-bold',
  h2: 'text-4xl font-bold',
  h3: 'text-3xl font-bold',
  h4: 'text-2xl font-semibold',
  h5: 'text-xl font-semibold',
  
  // Body
  body: 'text-base',
  bodyLarge: 'text-lg',
  bodySmall: 'text-sm',
  
  // Special
  gradient: 'bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600',
};

export const effects = {
  // Shadows
  shadow: 'shadow-xl',
  shadowMd: 'shadow-md',
  shadowLg: 'shadow-lg',
  
  // Borders
  border: 'border border-gray-200',
  borderDark: 'border border-white/10',
  rounded: 'rounded-2xl',
  roundedLg: 'rounded-xl',
  roundedMd: 'rounded-lg',
  
  // Transitions
  transition: 'transition-all duration-300 ease-in-out',
  transitionFast: 'transition-all duration-150 ease-in-out',
};

export const components = {
  // Cards
  cardGlass: `${spacing.card} ${effects.rounded} ${effects.shadowMd} ${colors.background.glass}`,
  cardLight: `${spacing.card} ${effects.rounded} ${effects.border}`,
  
  // Buttons
  buttonPrimary: `px-6 py-3 ${effects.roundedMd} bg-blue-600 text-white font-semibold ${effects.transition} hover:bg-blue-700 hover:shadow-lg`,
  buttonSecondary: `px-6 py-3 ${effects.roundedMd} bg-white/10 border border-white/10 text-white font-semibold ${effects.transition} hover:bg-white/15`,
  buttonOutline: `px-6 py-3 ${effects.roundedMd} border-2 border-blue-600 text-blue-600 font-semibold ${effects.transition} hover:bg-blue-50`,
};
