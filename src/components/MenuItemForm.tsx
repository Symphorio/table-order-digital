
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MenuItemForm = ({ item, category, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        image: item.image
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.image) {
      return;
    }

    onSave({
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      image: formData.image,
      category: category,
      promotion: item?.promotion || null
    });
  };

  const emojiSuggestions = category === 'repas' 
    ? ['🍔', '🍕', '🥗', '🍝', '🐟', '🍲', '🌮', '🍗', '🥙', '🍛']
    : ['🥤', '🍊', '💧', '☕', '🍵', '🧃', '🥛', '🍺', '🍷', '🥃'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom de l'article</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Burger Classique"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Ex: Pain artisanal, steak haché..."
          required
        />
      </div>

      <div>
        <Label htmlFor="price">Prix (FCFA)</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="Ex: 3500"
          required
        />
      </div>

      <div>
        <Label htmlFor="image">Emoji (Icône)</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="Choisissez un emoji"
          required
        />
        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {emojiSuggestions.map((emoji, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData({ ...formData, image: emoji })}
                className="text-lg p-2 h-auto"
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
          {item ? 'Modifier' : 'Ajouter'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default MenuItemForm;
