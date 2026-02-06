import React, { createContext, useContext, useState, useEffect } from 'react';
import { Location } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

interface LocationContextType {
  locations: Location[];
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  isLoading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const LOCATION_STORAGE_KEY = 'localmart_selected_location';

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocationState] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (data) {
        setLocations(data as Location[]);

        // Try to restore saved location
        const savedLocationId = localStorage.getItem(LOCATION_STORAGE_KEY);
        if (savedLocationId) {
          const savedLocation = data.find(l => l.id === savedLocationId);
          if (savedLocation) {
            setSelectedLocationState(savedLocation as Location);
          }
        }
      }
      setIsLoading(false);
    };

    fetchLocations();
  }, []);

  const setSelectedLocation = (location: Location | null) => {
    setSelectedLocationState(location);
    if (location) {
      localStorage.setItem(LOCATION_STORAGE_KEY, location.id);
    } else {
      localStorage.removeItem(LOCATION_STORAGE_KEY);
    }
  };

  return (
    <LocationContext.Provider value={{ locations, selectedLocation, setSelectedLocation, isLoading }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
