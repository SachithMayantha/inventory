import { Utensils } from "lucide-react"

interface RecipeUsageListProps {
  ingredientId: string
}

// Mock data for recipes that use this ingredient
const recipes = [
  {
    id: "recipe1",
    name: "Spaghetti Bolognese",
    usageAmount: 0.5,
    unit: "kg",
    frequency: "Daily",
    lastUsed: "Today",
  },
  {
    id: "recipe2",
    name: "Margherita Pizza",
    usageAmount: 0.3,
    unit: "kg",
    frequency: "Daily",
    lastUsed: "Yesterday",
  },
  {
    id: "recipe3",
    name: "Caprese Salad",
    usageAmount: 0.4,
    unit: "kg",
    frequency: "Weekly",
    lastUsed: "3 days ago",
  },
  {
    id: "recipe4",
    name: "Bruschetta",
    usageAmount: 0.2,
    unit: "kg",
    frequency: "Weekly",
    lastUsed: "5 days ago",
  },
]

export function RecipeUsageList({ ingredientId }: RecipeUsageListProps) {
  // In a real app, you would filter recipes based on the ingredient ID
  // For demo purposes, we'll just show all recipes

  return (
    <div className="space-y-4">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="flex items-start gap-4 rounded-lg border p-3">
          <div className="rounded-full bg-gray-100 p-2">
            <Utensils className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{recipe.name}</p>
              <span className="text-xs text-muted-foreground">Last used: {recipe.lastUsed}</span>
            </div>
            <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                Uses {recipe.usageAmount} {recipe.unit} per serving
              </span>
              <span>•</span>
              <span>Frequency: {recipe.frequency}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

