
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Truck, CheckCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import DeliveryMap from "./DeliveryMap";

const OrderHistory = ({ orders, onBack, onRequestDelivery }) => {
  const [showDeliveryMap, setShowDeliveryMap] = useState(false);
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'commande en cours':
        return 'bg-yellow-500';
      case 'livraison':
        return 'bg-blue-500';
      case 'passé':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'commande en cours':
        return <Clock className="h-4 w-4" />;
      case 'livraison':
        return <Truck className="h-4 w-4" />;
      case 'passé':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleRequestDelivery = (order) => {
    setSelectedOrderForDelivery(order);
    setShowDeliveryMap(true);
  };

  const handleDeliveryLocationSelect = (location) => {
    if (selectedOrderForDelivery) {
      onRequestDelivery(selectedOrderForDelivery.id, location);
      setShowDeliveryMap(false);
      setSelectedOrderForDelivery(null);
      toast({
        title: "Livraison demandée",
        description: "Votre demande de livraison a été envoyée",
      });
    }
  };

  if (showDeliveryMap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button 
              onClick={() => setShowDeliveryMap(false)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold">Choisir l'adresse de livraison</h1>
            <div className="w-20"></div>
          </div>
          
          <DeliveryMap onLocationSelect={handleDeliveryLocationSelect} />
        </div>
      </div>
    );
  }

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
          
          <h1 className="text-3xl font-bold text-gray-800">Mes Commandes</h1>
          
          <div className="w-20"></div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
              <p className="text-gray-600">Vos commandes passées apparaîtront ici</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Commande #{order.id}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    ⏰ {order.timestamp}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>{(item.price * item.quantity).toLocaleString()} FCFA</span>
                      </div>
                    ))}
                  </div>
                  
                  {order.deliveryLocation && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-sm">Livraison</span>
                      </div>
                      <p className="text-xs text-gray-600">{order.deliveryLocation.address}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="font-bold text-lg">
                      Total: {order.total.toLocaleString()} FCFA
                    </div>
                    
                    {order.status === 'commande en cours' && !order.deliveryLocation && (
                      <Button
                        onClick={() => handleRequestDelivery(order)}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Truck className="h-4 w-4 mr-1" />
                        Demander livraison
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
