
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const RestaurantMenu = ({ onAddToCart, onBack, cartItemsCount, onViewCart }) => {
  const [activeCategory, setActiveCategory] = useState('repas');

  const menuItems = {
    repas: [
      {
        id: 1,
        name: "Burger Classique",
        description: "Pain artisanal, steak haché, salade, tomate, oignon",
        price: 3500,
        image: "🍔",
        category: "repas"
      },
      {
        id: 2,
        name: "Pizza Margherita",
        description: "Base tomate, mozzarella, basilic frais",
        price: 4000,
        image: "🍕",
        category: "repas"
      },
      {
        id: 3,
        name: "Salade César",
        description: "Salade romaine, poulet grillé, parmesan, croûtons",
        price: 2800,
        image: "🥗",
        category: "repas"
      },
      {
        id: 4,
        name: "Pâtes Carbonara",
        description: "Spaghettis, lardons, crème, parmesan, œuf",
        price: 3200,
        image: "🍝",
        category: "repas"
      },
      {
        id: 5,
        name: "Poisson Grillé",
        description: "Filet de dorade, légumes de saison, riz",
        price: 4500,
        image: "🐟",
        category: "repas"
      },
      {
        id: 6,
        name: "Couscous Royal",
        description: "Semoule, agneau, merguez, légumes",
        price: 5000,
        image: "🍲",
        category: "repas"
      }
    ],
    boissons: [
      {
        id: 101,
        name: "Coca-Cola",
        description: "Boisson gazeuse rafraîchissante",
        price: 800,
        image: "🥤",
        category: "boissons"
      },
      {
        id: 102,
        name: "Jus d'Orange",
        description: "Jus d'orange frais pressé",
        price: 1000,
        image: "🍊",
        category: "boissons"
      },
      {
        id: 103,
        name: "Eau Minérale",
        description: "Eau plate ou gazeuse",
        price: 500,
        image: "💧",
        category: "boissons"
      },
      {
        id: 104,
        name: "Café Expresso",
        description: "Café italien authentique",
        price: 600,
        image: "☕",
        category: "boissons"
      },
      {
        id: 105,
        name: "Thé Vert",
        description: "Thé vert bio aux herbes",
        price: 700,
        image: "🍵",
        category: "boissons"
      },
      {
        id: 106,
        name: "Smoothie Tropical",
        description: "Mangue, ananas, banane",
        price: 1200,
        image: "🥤",
        category: "boissons"
      }
    ]
  };

  const handleAddToCart = (item) => {
    onAddToCart(item);
    toast({
      title: "Ajouté au panier !",
      description: `${item.name} a été ajouté à votre panier`,
    });
  };

  const currentItems = menuItems[activeCategory];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-800">Menu du Restaurant</h1>
          
          <Button
            onClick={onViewCart}
            className="relative bg-orange-500 hover:bg-orange-600"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Panier
            {cartItemsCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                {cartItemsCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <Button
              onClick={() => setActiveCategory('repas')}
              variant={activeCategory === 'repas' ? 'default' : 'ghost'}
              className={`mr-2 ${activeCategory === 'repas' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
            >
              🍽️ Repas
            </Button>
            <Button
              onClick={() => setActiveCategory('boissons')}
              variant={activeCategory === 'boissons' ? 'default' : 'ghost'}
              className={activeCategory === 'boissons' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              🥤 Boissons
            </Button>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="text-center pb-2">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {item.image}
                </div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm mb-4 h-12 flex items-center justify-center">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">
                    {item.price.toLocaleString()} FCFA
                  </span>
                  <Button
                    onClick={() => handleAddToCart(item)}
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;
