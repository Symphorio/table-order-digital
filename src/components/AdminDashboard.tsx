
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, CheckCircle, Clock, Truck, MapPin, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = ({ orders, updateOrderStatus, onBack }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const handleValidateOrder = (orderId) => {
    updateOrderStatus(orderId, 'passé');
    toast({
      title: "Commande validée",
      description: "La commande est maintenant marquée comme servie",
    });
  };

  const handleViewDelivery = (order) => {
    setSelectedOrder(order);
  };

  const getActionButton = (order) => {
    if (order.status === 'commande en cours') {
      return (
        <Button
          onClick={() => handleValidateOrder(order.id)}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Valider
        </Button>
      );
    } else if (order.status === 'livraison') {
      return (
        <Button
          onClick={() => handleViewDelivery(order)}
          size="sm"
          variant="outline"
          className="border-blue-500 text-blue-600"
        >
          <MapPin className="h-4 w-4 mr-1" />
          Voir
        </Button>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-800">
          Terminé
        </Badge>
      );
    }
  };

  const pendingOrders = orders.filter(order => order.status !== 'passé');
  const completedOrders = orders.filter(order => order.status === 'passé');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
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
          
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Responsable</h1>
          
          <div className="w-20"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {orders.length}
              </div>
              <div className="text-gray-600">Total Commandes</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {orders.filter(o => o.status === 'commande en cours').length}
              </div>
              <div className="text-gray-600">En Préparation</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {orders.filter(o => o.status === 'livraison').length}
              </div>
              <div className="text-gray-600">En Livraison</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {completedOrders.length}
              </div>
              <div className="text-gray-600">Terminées</div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pending Orders */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Commandes en cours ({pendingOrders.length})
            </h2>
            
            {pendingOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold mb-2">Aucune commande en cours</h3>
                  <p className="text-gray-600">Les nouvelles commandes apparaîtront ici</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {order.tableNumber} - #{order.id}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-4">
                        <span>⏰ {order.timestamp}</span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {order.paymentPhone}
                        </span>
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
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="font-bold text-lg">
                          Total: {order.total.toLocaleString()} FCFA
                        </div>
                        {getActionButton(order)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Completed Orders */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Commandes terminées ({completedOrders.length})
            </h2>
            
            {completedOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-lg font-semibold mb-2">Aucune commande terminée</h3>
                  <p className="text-gray-600">Les commandes validées apparaîtront ici</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {completedOrders.map((order) => (
                  <Card key={order.id} className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{order.tableNumber} - #{order.id}</span>
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Terminé
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        ⏰ {order.timestamp} | Total: {order.total.toLocaleString()} FCFA
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.items.length} article(s)
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delivery Location Modal */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Informations de livraison</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Commande #{selectedOrder.id}</h3>
                  <p className="text-sm text-gray-600 mb-1">{selectedOrder.tableNumber}</p>
                  <p className="text-sm text-gray-600">Total: {selectedOrder.total.toLocaleString()} FCFA</p>
                </div>
                
                {selectedOrder.deliveryLocation && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold">Adresse de livraison</span>
                    </div>
                    <p className="text-sm">{selectedOrder.deliveryLocation.address}</p>
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">Contact client</span>
                  </div>
                  <p className="text-sm">{selectedOrder.paymentPhone}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;
