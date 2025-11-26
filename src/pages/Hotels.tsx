import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { HotelCard } from "@/components/HotelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { api, SearchFilters } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Hotels = () => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const { toast } = useToast();

  const { data: hotels, isLoading, error } = useQuery({
    queryKey: ['hotels', filters],
    queryFn: () => api.getHotels(filters),
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Connection Error",
        description: "Could not connect to the backend. Make sure your server is running on localhost:8080",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-gold-light/30 to-primary/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-4">
            Find Your Perfect Stay
          </h1>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover luxury hotels around the world with exceptional service and comfort
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Hotels Grid */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-lg mb-2">Backend Not Connected</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Make sure your Spring Boot server is running on localhost:8080
              </p>
              <code className="text-xs bg-muted px-3 py-1 rounded">
                ./mvnw spring-boot:run
              </code>
            </div>
          </div>
        ) : hotels && hotels.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-display font-semibold">
                {hotels.length} {hotels.length === 1 ? 'Hotel' : 'Hotels'} Found
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hotels found. Try adjusting your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;
