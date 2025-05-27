
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PromotionForm = ({ promotion, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    discount: '',
    endDate: ''
  });

  useEffect(() => {
    if (promotion) {
      setFormData({
        discount: promotion.discount.toString(),
        endDate: promotion.endDate
      });
    } else {
      // Date par défaut: dans une semaine
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setFormData({
        discount: '',
        endDate: nextWeek.toISOString().split('T')[0]
      });
    }
  }, [promotion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.discount || !formData.endDate) {
      return;
    }

    const discountValue = parseInt(formData.discount);
    if (discountValue < 1 || discountValue > 90) {
      return;
    }

    onSave({
      discount: discountValue,
      endDate: formData.endDate
    });
  };

  const quickDiscounts = [5, 10, 15, 20, 25, 30];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="discount">Pourcentage de réduction (%)</Label>
        <Input
          id="discount"
          type="number"
          min="1"
          max="90"
          value={formData.discount}
          onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
          placeholder="Ex: 15"
          required
        />
        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-2">Réductions rapides:</p>
          <div className="flex flex-wrap gap-2">
            {quickDiscounts.map((discount) => (
              <Button
                key={discount}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData({ ...formData, discount: discount.toString() })}
                className="text-sm"
              >
                {discount}%
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="endDate">Date de fin de promotion</Label>
        <Input
          id="endDate"
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="font-semibold text-sm mb-1">Aperçu:</h4>
        <p className="text-sm text-gray-600">
          Réduction de <span className="font-semibold text-blue-600">{formData.discount || 0}%</span> 
          {formData.endDate && (
            <> jusqu'au <span className="font-semibold">{new Date(formData.endDate).toLocaleDateString()}</span></>
          )}
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
          Appliquer Promotion
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default PromotionForm;
