import { RecipeList } from "@/components/recipe-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function RecipesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recipes</h1>
          <p className="text-muted-foreground">Manage your restaurant's recipes and track ingredient usage</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Recipe
        </Button>
      </div>
      <RecipeList />
    </div>
  )
}

