import { 
  Coffee, ShoppingBag, Gamepad2, Car, Shirt, Smartphone, UtensilsCrossed,
  BookOpen, Sparkles, Home, Dumbbell, Plane, CreditCard, Gift,
  Heart, Palette, Wine, Joystick, HelpCircle
} from "lucide-react"
import { TemptationCategory } from "@/lib/types"

interface CategoryIconProps {
  category: TemptationCategory
  className?: string
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  const iconProps = { className, size: 20 }

  switch (category) {
    case TemptationCategory.FOOD_DINING:
      return <UtensilsCrossed {...iconProps} />
    case TemptationCategory.COFFEE:
      return <Coffee {...iconProps} />
    case TemptationCategory.SHOPPING:
      return <ShoppingBag {...iconProps} />
    case TemptationCategory.CLOTHES:
      return <Shirt {...iconProps} />
    case TemptationCategory.ELECTRONICS:
      return <Smartphone {...iconProps} />
    case TemptationCategory.ENTERTAINMENT:
      return <Gamepad2 {...iconProps} />
    case TemptationCategory.BOOKS_EDUCATION:
      return <BookOpen {...iconProps} />
    case TemptationCategory.BEAUTY_WELLNESS:
      return <Sparkles {...iconProps} />
    case TemptationCategory.HOME_GARDEN:
      return <Home {...iconProps} />
    case TemptationCategory.SPORTS_FITNESS:
      return <Dumbbell {...iconProps} />
    case TemptationCategory.TRAVEL:
      return <Plane {...iconProps} />
    case TemptationCategory.TRANSPORTATION:
      return <Car {...iconProps} />
    case TemptationCategory.SUBSCRIPTIONS:
      return <CreditCard {...iconProps} />
    case TemptationCategory.GIFTS_CHARITY:
      return <Gift {...iconProps} />
    case TemptationCategory.HEALTH_MEDICAL:
      return <Heart {...iconProps} />
    case TemptationCategory.HOBBIES_CRAFTS:
      return <Palette {...iconProps} />
    case TemptationCategory.ALCOHOL_TOBACCO:
      return <Wine {...iconProps} />
    case TemptationCategory.GAMING:
      return <Joystick {...iconProps} />
    case TemptationCategory.OTHER:
      return <HelpCircle {...iconProps} />
    default:
      return <HelpCircle {...iconProps} />
  }
}