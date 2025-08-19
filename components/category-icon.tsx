import { Coffee, ShoppingBag, Gamepad2, Car, Shirt, Smartphone, UtensilsCrossed } from "lucide-react"
import { TemptationCategory } from "@/lib/types"

interface CategoryIconProps {
  category: TemptationCategory
  className?: string
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  const iconProps = { className, size: 20 }

  switch (category) {
    case TemptationCategory.COFFEE:
      return <Coffee {...iconProps} />
    case TemptationCategory.SHOPPING:
      return <ShoppingBag {...iconProps} />
    case TemptationCategory.ENTERTAINMENT:
      return <Gamepad2 {...iconProps} />
    case TemptationCategory.TRANSPORTATION:
      return <Car {...iconProps} />
    case TemptationCategory.CLOTHES:
      return <Shirt {...iconProps} />
    case TemptationCategory.ELECTRONICS:
      return <Smartphone {...iconProps} />
    case TemptationCategory.FOOD_DINING:
      return <UtensilsCrossed {...iconProps} />
    default:
      return <ShoppingBag {...iconProps} />
  }
}