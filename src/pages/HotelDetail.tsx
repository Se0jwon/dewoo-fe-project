import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/lib/api";
import { Star, MapPin, Wifi, Coffee, Car, Dumbbell, ArrowLeft, Calendar as CalendarIcon, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);
  
  const { data: hotel, isLoading, error } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => api.getHotelById(Number(id)),
    enabled: !!id,
  });

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut || !hotel) return 0;
    const nights = differenceInDays(checkOut, checkIn);
    return nights * hotel.price;
  };

  const handleBooking = () => {
    if (!user) {
      toast.error("예약하려면 로그인이 필요합니다");
      navigate("/auth");
      return;
    }

    if (!checkIn || !checkOut || !hotel) {
      return;
    }
    
    navigate('/booking/confirm', {
      state: {
        hotel,
        checkIn: format(checkIn, "yyyy-MM-dd"),
        checkOut: format(checkOut, "yyyy-MM-dd"),
        guests,
        totalPrice: calculateTotalPrice(),
      }
    });
  };

  const isBookingValid = checkIn && checkOut && checkIn < checkOut;

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

              {/* Booking Form */}
              <div className="space-y-4 mb-6">
                {/* Check-in Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-in</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkIn && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Check-out Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-out</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOut && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(date) => !checkIn || date <= checkIn}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guests */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="1"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              {checkIn && checkOut && (
                <div className="bg-muted p-4 rounded-lg mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ${hotel.price} x {differenceInDays(checkOut, checkIn)} nights
                    </span>
                    <span className="font-medium">${calculateTotalPrice()}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary">${calculateTotalPrice()}</span>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleBooking}
                disabled={!isBookingValid}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
              >
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
