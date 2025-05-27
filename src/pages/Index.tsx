
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RestaurantMenu from "@/components/RestaurantMenu";
import Cart from "@/components/Cart";
import AdminDashboard from "@/components/AdminDashboard";
import { ShoppingCart, Users, Utensils } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartItem = (id, quantity) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const placeOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: orderData.type === 'delivery' ? 'livraison' : 'commande en cours',
      tableNumber: 'Table 5', // Simulé
      timestamp: new Date().toLocaleTimeString(),
      paymentPhone: orderData.phone,
      deliveryLocation: orderData.deliveryLocation || null
    };
    
    setOrders(prev => [...prev, newOrder]);
    setCartItems([]);
    setCurrentView('home');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  if (currentView === 'admin') {
    return (
      <AdminDashboard 
        orders={orders} 
        updateOrderStatus={updateOrderStatus}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'menu') {
    return (
      <RestaurantMenu 
        onAddToCart={addToCart}
        onBack={() => setCurrentView('home')}
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onViewCart={() => setCurrentView('cart')}
      />
    );
  }

  if (currentView === 'cart') {
    return (
      <Cart 
        items={cartItems}
        onUpdateItem={updateCartItem}
        onBack={() => setCurrentView('menu')}
        onPlaceOrder={placeOrder}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🍽️ Restaurant Digital
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Commandez facilement depuis votre table
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-8 text-center">
              <Utensils className="mx-auto mb-4 h-16 w-16 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold mb-4">Interface Client</h2>
              <p className="mb-6 opacity-90">
                Découvrez notre menu et passez votre commande
              </p>
              <Button 
                onClick={() => setCurrentView('menu')}
                size="lg"
                variant="secondary"
                className="w-full text-lg py-6 bg-white text-orange-600 hover:bg-gray-100"
              >
                Voir le Menu
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-blue-500 to-purple-500 text-white border-0">
            <CardContent className="p-8 text-center">
              <Users className="mx-auto mb-4 h-16 w-16 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold mb-4">Interface Responsable</h2>
              <p className="mb-6 opacity-90">
                Gérez les commandes et validez les préparations
              </p>
              <Button 
                onClick={() => setCurrentView('admin')}
                size="lg"
                variant="secondary"
                className="w-full text-lg py-6 bg-white text-blue-600 hover:bg-gray-100"
              >
                Dashboard Admin
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
            <div className="text-gray-600">Articles au panier</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {orders.length}
            </div>
            <div className="text-gray-600">Commandes passées</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {orders.filter(order => order.status === 'passé').length}
            </div>
            <div className="text-gray-600">Commandes servies</div>
          </div>
        </div>

        {/* Cart Float Button */}
        {cartItems.length > 0 && currentView === 'home' && (
          <Button
            onClick={() => setCurrentView('cart')}
            className="fixed bottom-6 right-6 rounded-full h-16 w-16 bg-orange-500 hover:bg-orange-600 shadow-lg"
            size="lg"
          >
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </Badge>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Index;
