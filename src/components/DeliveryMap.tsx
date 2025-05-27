
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DeliveryMap = ({ onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchAddress, setSearchAddress] = useState('');
  
  // Simulated popular locations
  const popularLocations = [
    { id: 1, name: "Centre-ville", address: "Place de l'Indépendance, Lomé", coords: [1.2167, 6.1319] },
    { id: 2, name: "Université de Lomé", address: "Campus universitaire, Lomé", coords: [1.2194, 6.1708] },
    { id: 3, name: "Marché de Lomé", address: "Grand Marché, Lomé", coords: [1.2136, 6.1256] },
    { id: 4, name: "Aéroport", address: "Aéroport International Gnassingbé Eyadéma", coords: [1.2531, 6.1656] }
  ];

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  const handleConfirm = () => {
    if (!selectedLocation) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une adresse de livraison",
        variant: "destructive"
      });
      return;
    }
    
    onLocationSelect(selectedLocation);
  };

  const handleSearch = () => {
    if (searchAddress.trim()) {
      // Simulate search result
      const searchResult = {
        id: 'search',
        name: "Adresse recherchée",
        address: searchAddress,
        coords: [1.2167 + Math.random() * 0.1, 6.1319 + Math.random() * 0.1]
      };
      setSelectedLocation(searchResult);
      toast({
        title: "Adresse trouvée",
        description: `Livraison à: ${searchAddress}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Rechercher une adresse</Label>
        <div className="flex gap-2">
          <Input
            id="search"
            placeholder="Entrez votre adresse complète..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <Button onClick={handleSearch} variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">Carte interactive</p>
          <p className="text-sm text-gray-400">
            (Intégration Google Maps à faire côté back-end)
          </p>
        </div>
      </div>

      {/* Popular Locations */}
      <div>
        <h3 className="font-semibold mb-3">Adresses populaires</h3>
        <div className="grid grid-cols-2 gap-3">
          {popularLocations.map((location) => (
            <Card 
              key={location.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedLocation?.id === location.id ? 'ring-2 ring-orange-500 bg-orange-50' : ''
              }`}
              onClick={() => handleLocationClick(location)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{location.name}</p>
                    <p className="text-xs text-gray-600">{location.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Location */}
      {selectedLocation && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-800">Adresse sélectionnée</span>
          </div>
          <p className="text-sm">{selectedLocation.address}</p>
        </div>
      )}

      {/* Confirm Button */}
      <Button 
        onClick={handleConfirm}
        className="w-full bg-orange-500 hover:bg-orange-600"
        disabled={!selectedLocation}
      >
        Confirmer l'adresse de livraison
      </Button>
    </div>
  );
};

export default DeliveryMap;
