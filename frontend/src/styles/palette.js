// Gradient color palette for consistent styling across the app

export const gradients = {
  // Primary business gradients
  blueIndigo: 'from-blue-500 to-indigo-500',
  indigoPurple: 'from-indigo-500 to-purple-500',
  tealEmerald: 'from-teal-500 to-emerald-500',
  amberOrange: 'from-amber-500 to-orange-500',
  
  // Extended palette
  blueCyan: 'from-blue-600 to-cyan-500',
  greenTeal: 'from-green-500 to-teal-500',
  purplePink: 'from-purple-500 to-pink-500',
  redOrange: 'from-red-500 to-orange-500',
  
  // Subtle variants
  graySlate: 'from-gray-400 to-slate-500',
  blueGray: 'from-blue-400 to-gray-500',
  
  // Status colors
  success: 'from-green-500 to-emerald-600',
  warning: 'from-yellow-500 to-amber-600',
  error: 'from-red-500 to-rose-600',
  info: 'from-blue-500 to-cyan-600'
};

// Helper function to get gradient class
export const getGradient = (name) => gradients[name] || gradients.blueIndigo;

// Color scheme mappings for different contexts
export const contextColors = {
  banking: gradients.blueIndigo,
  admin: gradients.indigoPurple,
  mobile: gradients.tealEmerald,
  finance: gradients.amberOrange,
  support: gradients.blueCyan
};