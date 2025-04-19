"use client"

import { useState } from "react"
import { Clock, Filter, Search, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface Recipe {
  id: string
  name: string
  category: string
  prepTime: number
  ingredients: number
  lastUsed: string
  popular: boolean
}

const recipeData: Recipe[] = [
  {
    id: "recipe1",
    name: "Spaghetti Bolognese",
    category: "Main Course",
    prepTime: 45,
    ingredients: 12,
    lastUsed: "Today",
    popular: true,
  },
  {
    id: "recipe2",
    name: "Margherita Pizza",
    category: "Main Course",
    prepTime: 30,
    ingredients: 8,
    lastUsed: "Yesterday",
    popular: true,
  },
  {
    id: "recipe3",
    name: "Caprese Salad",
    category: "Appetizer",
    prepTime: 15,
    ingredients: 5,
    lastUsed: "3 days ago",
    popular: false,
  },
  {
    id: "recipe4",
    name: "Tiramisu",
    category: "Dessert",
    prepTime: 60,
    ingredients: 9,
    lastUsed: "1 week ago",
    popular: true,
  },
  {
    id: "recipe5",
    name: "Chicken Caesar Salad",
    category: "Main Course",
    prepTime: 25,
    ingredients: 10,
    lastUsed: "2 days ago",
    popular: false,
  },
  {
    id: "recipe6",
    name: "Chocolate Mousse",
    category: "Dessert",
    prepTime: 40,
    ingredients: 7,
    lastUsed: "5 days ago",
    popular: false,
  },
]

export function RecipeList() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isAddRecipeDialogOpen, setIsAddRecipeDialogOpen] = useState(false)
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    category: "Main Course",
    prepTime: "",
    description: "",
  })

  const filteredRecipes = recipeData.filter((recipe) => {
    // First apply search filter
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchTerm.toLowerCase())

    // Then apply tab filter
    if (activeTab === "all") return matchesSearch
    if (activeTab === "popular") return matchesSearch && recipe.popular
    if (activeTab === "recent") return matchesSearch && ["Today", "Yesterday", "2 days ago"].includes(recipe.lastUsed)

    return matchesSearch
  })

  const handleAddRecipe = () => {
    // Validate form
    if (!newRecipe.name || !newRecipe.category || !newRecipe.prepTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would send this to your API
    toast({
      title: "Recipe added",
      description: `${newRecipe.name} has been added to your recipes`,
    })

    // Close dialog and reset form
    setIsAddRecipeDialogOpen(false)
    setNewRecipe({
      name: "",
      category: "Main Course",
      prepTime: "",
      description: "",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recipe Library</CardTitle>
            <CardDescription>Browse and manage your restaurant's recipes</CardDescription>
          </div>
          <Dialog open={isAddRecipeDialogOpen} onOpenChange={setIsAddRecipeDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Utensils className="mr-2 h-4 w-4" />
                Add Recipe
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Recipe</DialogTitle>
                <DialogDescription>Enter the details of the new recipe below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recipe-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="recipe-name"
                    value={newRecipe.name}
                    onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recipe-category" className="text-right">
                    Category
                  </Label>
                  <Select
                    value={newRecipe.category}
                    onValueChange={(value) => setNewRecipe({ ...newRecipe, category: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Appetizer">Appetizer</SelectItem>
                      <SelectItem value="Main Course">Main Course</SelectItem>
                      <SelectItem value="Dessert">Dessert</SelectItem>
                      <SelectItem value="Beverage">Beverage</SelectItem>
                      <SelectItem value="Side Dish">Side Dish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="prep-time" className="text-right">
                    Prep Time (mins)
                  </Label>
                  <Input
                    id="prep-time"
                    type="number"
                    value={newRecipe.prepTime}
                    onChange={(e) => setNewRecipe({ ...newRecipe, prepTime: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newRecipe.description}
                    onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddRecipeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRecipe}>Add Recipe</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Recipes</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="recent">Recently Used</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No recipes found</p>
            </div>
          ) : (
            filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Utensils className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  {recipe.popular && (
                    <Badge className="absolute right-2 top-2 bg-orange-100 text-orange-800">Popular</Badge>
                  )}
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{recipe.name}</CardTitle>
                  <CardDescription>{recipe.category}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{recipe.prepTime} mins</span>
                    </div>
                    <div>{recipe.ingredients} ingredients</div>
                    <div className="text-muted-foreground">Used: {recipe.lastUsed}</div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

