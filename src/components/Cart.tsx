
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Minus, Plus, Trash2, CreditCard, Truck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import DeliveryMap from "@/components/DeliveryMap";

const Cart = ({ items, onUpdateItem, onBack, onPlaceOrder }) => {
  const [paymentPhone, setPaymentPhone] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [orderType, setOrderType] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 0) {
      onUpdateItem(id, newQuantity);
    }
  };

  const handlePayment = () => {
    if (!paymentPhone) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre numéro de téléphone",
        variant: "destructive"
      });
      return;
    }

    // Simulation de l'API Mobile Money
    toast({
      title: "Paiement en cours...",
      description: "Vérifiez votre téléphone pour valider le paiement",
    });

    setTimeout(() => {
      toast({
        title: "Paiement réussi !",
        description: "Votre commande a été confirmée",
      });
      
      onPlaceOrder({
        type: orderType,
        phone: paymentPhone,
        deliveryLocation: deliveryLocation
      });
      
      setShowPaymentModal(false);
      setPaymentPhone('');
    }, 3000);
  };

  const handleOrderClick = (type) => {
    setOrderType(type);
    if (type === 'delivery') {
      setShowDeliveryModal(true);
    } else {
      setShowPaymentModal(true);
    }
  };

  const handleDeliveryConfirm = (location) => {
    setDeliveryLocation(location);
    setShowDeliveryModal(false);
    setShowPaymentModal(true);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
            <p className="text-gray-600 mb-6">Ajoutez des articles depuis le menu</p>
            <Button onClick={onBack} className="bg-orange-500 hover:bg-orange-600">
              Retour au menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au menu
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Votre Panier</h1>
          <div className="w-20"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{item.image}</div>
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-orange-600 font-bold">
                          {item.price.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onUpdateItem(item.id, 0)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{(item.price * item.quantity).toLocaleString()} FCFA</span>
                    </div>
                  ))}
                </div>
                
                <hr />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-600">{total.toLocaleString()} FCFA</span>
                </div>
                
                <div className="space-y-3 pt-4">
                  <Button 
                    onClick={() => handleOrderClick('dine-in')}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    size="lg"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Commander sur place
                  </Button>
                  
                  <Button 
                    onClick={() => handleOrderClick('delivery')}
                    variant="outline"
                    className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
                    size="lg"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Commander en livraison
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Modal */}
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Paiement Mobile Money</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  placeholder="Ex: 70123456"
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Montant à payer:</p>
                <p className="text-2xl font-bold text-orange-600">
                  {total.toLocaleString()} FCFA
                </p>
              </div>
              
              {deliveryLocation && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Livraison à:</p>
                  <p className="font-semibold">{deliveryLocation.address}</p>
                </div>
              )}
              
              <Button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700">
                Confirmer le paiement
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delivery Modal */}
        <Dialog open={showDeliveryModal} onOpenChange={setShowDeliveryModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Choisir l'adresse de livraison</DialogTitle>
            </DialogHeader>
            <DeliveryMap onLocationSelect={handleDeliveryConfirm} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Cart;
