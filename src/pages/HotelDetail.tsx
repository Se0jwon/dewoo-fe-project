import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { Star, MapPin, Wifi, Coffee, Car, Dumbbell, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const HotelDetail = () => {
  const { id } = useParams();
  
  const { data: hotel, isLoading, error } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => api.getHotelById(Number(id)),
    enabled: !!id,
  });

  const amenityIcons: Record<string, any> = {
    wifi: Wifi,
    parking: Car,
    gym: Dumbbell,
    breakfast: Coffee,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Hotel Not Found</h2>
            <Link to="/hotels">
              <Button>Back to Hotels</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/hotels">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hotels
          </Button>
        </Link>

        {/* Hero Image */}
        <div className="relative h-[500px] rounded-2xl overflow-hidden mb-8 shadow-elegant">
          <img
            src={hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary text-primary-foreground">
                ${hotel.price}/night
              </Badge>
              <div className="flex items-center gap-1 bg-gold-light px-3 py-1 rounded-md">
                <Star className="w-5 h-5 fill-gold text-gold" />
                <span className="font-semibold text-navy">{hotel.rating}</span>
              </div>
            </div>
            <h1 className="font-display text-5xl font-bold text-white mb-2">
              {hotel.name}
            </h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{hotel.address}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="font-display text-2xl font-semibold mb-4">About This Hotel</h2>
              <p className="text-muted-foreground leading-relaxed">
                {hotel.description}
              </p>
            </div>

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="bg-card rounded-lg p-6 shadow-card">
                <h2 className="font-display text-2xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity, index) => {
                    const Icon = amenityIcons[amenity.toLowerCase()] || Coffee;
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium capitalize">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="font-display text-2xl font-semibold mb-4">Location</h2>
              <div className="space-y-2">
                <p className="text-muted-foreground">{hotel.address}</p>
                <p className="text-muted-foreground">{hotel.city}, {hotel.country}</p>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-elegant sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-primary">${hotel.price}</span>
                  <span className="text-muted-foreground">/night</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="font-semibold">{hotel.rating}</span>
                  <span className="text-sm text-muted-foreground ml-1">(128 reviews)</span>
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6">
                Book Now
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Free cancellation available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
