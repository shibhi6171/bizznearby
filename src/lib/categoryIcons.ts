export const categoryIcons: Record<string, string> = {
  Home: '🏠',
  Sparkles: '✨',
  GraduationCap: '🎓',
  Heart: '❤️',
  PartyPopper: '🎉',
  Car: '🚗',
  Laptop: '💻',
  Shirt: '👕',
  Sofa: '🛋️',
  ShoppingBag: '🛍️',
  ShoppingCart: '🛒',
  Store: '🏪',
  MapPin: '📍',
  UtensilsCrossed: '🍽️',
  Wrench: '🔧',
  Building2: '🏢',
  Plane: '✈️',
  PawPrint: '🐾',
  Scissors: '💇',
  Briefcase: '💼',
  Dumbbell: '🏋️',
  BookOpen: '📚',
  Baby: '🧸',
  Sprout: '🌱',
  Palette: '🎨',
  Stethoscope: '🩺',
};

export function getCategoryIcon(icon?: string | null) {
  return categoryIcons[icon || ''] || '📦';
}
