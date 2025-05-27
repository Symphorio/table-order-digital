
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Edit, Trash2, Percent, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MenuItemForm from "./MenuItemForm";
import PromotionForm from "./PromotionForm";

const MenuManagement = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('repas');
  const [showItemForm, setShowItemForm] = useState(false);
  const [showPromotionForm, setShowPromotionForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingPromotion, setEditingPromotion] = useState(null);

  // État local pour le menu - en production, ceci viendrait du backend
  const [menuItems, setMenuItems] = useState({
    repas: [
      {
        id: 1,
        name: "Burger Classique",
        description: "Pain artisanal, steak haché, salade, tomate, oignon",
        price: 3500,
        image: "🍔",
        category: "repas",
        promotion: null
      },
      {
        id: 2,
        name: "Pizza Margherita",
        description: "Base tomate, mozzarella, basilic frais",
        price: 4000,
        image: "🍕",
        category: "repas",
        promotion: { discount: 15, endDate: "2025-06-15" }
      },
      {
        id: 3,
        name: "Salade César",
        description: "Salade romaine, poulet grillé, parmesan, croûtons",
        price: 2800,
        image: "🥗",
        category: "repas",
        promotion: null
      }
    ],
    boissons: [
      {
        id: 101,
        name: "Coca-Cola",
        description: "Boisson gazeuse rafraîchissante",
        price: 800,
        image: "🥤",
        category: "boissons",
        promotion: { discount: 10, endDate: "2025-06-10" }
      },
      {
        id: 102,
        name: "Jus d'Orange",
        description: "Jus d'orange frais pressé",
        price: 1000,
        image: "🍊",
        category: "boissons",
        promotion: null
      }
    ]
  });

  const handleAddItem = () => {
    setEditingItem(null);
    setShowItemForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  const handleDeleteItem = (itemId) => {
    setMenuItems(prev => ({
      ...prev,
      [activeCategory]: prev[activeCategory].filter(item => item.id !== itemId)
    }));
    
    toast({
      title: "Article supprimé",
      description: "L'article a été supprimé du menu",
    });
  };

  const handleSaveItem = (itemData) => {
    if (editingItem) {
      // Modifier l'article existant
      setMenuItems(prev => ({
        ...prev,
        [activeCategory]: prev[activeCategory].map(item => 
          item.id === editingItem.id ? { ...itemData, id: editingItem.id } : item
        )
      }));
      
      toast({
        title: "Article modifié",
        description: "L'article a été mis à jour avec succès",
      });
    } else {
      // Ajouter un nouvel article
      const newItem = {
        ...itemData,
        id: Date.now(),
        category: activeCategory
      };
      
      setMenuItems(prev => ({
        ...prev,
        [activeCategory]: [...prev[activeCategory], newItem]
      }));
      
      toast({
        title: "Article ajouté",
        description: "Le nouvel article a été ajouté au menu",
      });
    }
    
    setShowItemForm(false);
    setEditingItem(null);
  };

  const handleAddPromotion = (item) => {
    setEditingItem(item);
    setEditingPromotion(item.promotion);
    setShowPromotionForm(true);
  };

  const handleSavePromotion = (promotionData) => {
    setMenuItems(prev => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map(item => 
        item.id === editingItem.id 
          ? { ...item, promotion: promotionData } 
          : item
      )
    }));
    
    toast({
      title: "Promotion mise à jour",
      description: "La promotion a été appliquée avec succès",
    });
    
    setShowPromotionForm(false);
    setEditingItem(null);
    setEditingPromotion(null);
  };

  const handleRemovePromotion = (itemId) => {
    setMenuItems(prev => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map(item => 
        item.id === itemId ? { ...item, promotion: null } : item
      )
    }));
    
    toast({
      title: "Promotion supprimée",
      description: "La promotion a été retirée de l'article",
    });
  };

  const getDiscountedPrice = (item) => {
    if (item.promotion) {
      return item.price - (item.price * item.promotion.discount / 100);
    }
    return item.price;
  };

  const currentItems = menuItems[activeCategory] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
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
          
          <h1 className="text-3xl font-bold text-gray-800">Gestion du Menu</h1>
          
          <Button
            onClick={handleAddItem}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Article
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <Button
              onClick={() => setActiveCategory('repas')}
              variant={activeCategory === 'repas' ? 'default' : 'ghost'}
              className={`mr-2 ${activeCategory === 'repas' ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
            >
              🍽️ Repas
            </Button>
            <Button
              onClick={() => setActiveCategory('boissons')}
              variant={activeCategory === 'boissons' ? 'default' : 'ghost'}
              className={activeCategory === 'boissons' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            >
              🥤 Boissons
            </Button>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-2">
                <div className="text-4xl mb-2 relative">
                  {item.image}
                  {item.promotion && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                      <Percent className="h-3 w-3 mr-1" />
                      -{item.promotion.discount}%
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm mb-4 h-12 flex items-center justify-center">
                  {item.description}
                </p>
                
                <div className="mb-4">
                  {item.promotion ? (
                    <div className="flex flex-col items-center">
                      <span className="text-lg text-gray-500 line-through">
                        {item.price.toLocaleString()} FCFA
                      </span>
                      <span className="text-2xl font-bold text-red-600">
                        {getDiscountedPrice(item).toLocaleString()} FCFA
                      </span>
                      <span className="text-xs text-red-500">
                        Jusqu'au {new Date(item.promotion.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-purple-600">
                      {item.price.toLocaleString()} FCFA
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    onClick={() => handleEditItem(item)}
                    size="sm"
                    variant="outline"
                    className="border-blue-500 text-blue-600"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Modifier
                  </Button>
                  
                  <Button
                    onClick={() => handleDeleteItem(item.id)}
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-600"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Supprimer
                  </Button>
                  
                  {item.promotion ? (
                    <Button
                      onClick={() => handleRemovePromotion(item.id)}
                      size="sm"
                      variant="outline"
                      className="border-orange-500 text-orange-600"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Retirer Promo
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleAddPromotion(item)}
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <Percent className="h-3 w-3 mr-1" />
                      Promotion
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Formulaire d'ajout/modification d'article */}
        <Dialog open={showItemForm} onOpenChange={setShowItemForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Modifier l\'article' : 'Ajouter un article'}
              </DialogTitle>
            </DialogHeader>
            <MenuItemForm
              item={editingItem}
              category={activeCategory}
              onSave={handleSaveItem}
              onCancel={() => setShowItemForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Formulaire de promotion */}
        <Dialog open={showPromotionForm} onOpenChange={setShowPromotionForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Gérer la promotion</DialogTitle>
            </DialogHeader>
            <PromotionForm
              promotion={editingPromotion}
              onSave={handleSavePromotion}
              onCancel={() => setShowPromotionForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MenuManagement;
