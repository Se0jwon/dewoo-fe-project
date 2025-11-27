import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api, Hotel } from "@/lib/api";
import { ArrowLeft, Calendar, Users, Mail, Phone, User } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface LocationState {
  hotel: Hotel;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
}

const BookingConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const state = location.state as LocationState;

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Load user profile data
    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setGuestName(data.full_name || "");
        setGuestEmail(data.email || user.email || "");
        setGuestPhone(data.phone || "");
      }
    };

    loadProfile();
  }, [user, navigate]);

  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          hotel_id: state.hotel.id,
          hotel_name: state.hotel.name,
          hotel_image: state.hotel.image,
          hotel_city: state.hotel.city,
          hotel_country: state.hotel.country,
          guest_name: guestName,
          guest_email: guestEmail,
          guest_phone: guestPhone,
          check_in: state.checkIn,
          check_out: state.checkOut,
          guests: state.guests,
          total_price: state.totalPrice,
          status: "confirmed",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      navigate('/booking/success', {
        state: {
          booking: data,
          hotel: state.hotel,
        }
      });
    },
    onError: (error) => {
      toast({
        title: "예약 실패",
        description: error instanceof Error ? error.message : "예약 생성에 실패했습니다",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookingMutation.mutate();
  };

  if (!state?.hotel) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Invalid Booking Request</h2>
            <Link to="/hotels">
              <Button>Browse Hotels</Button>
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
        <Link to={`/hotel/${state.hotel.id}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hotel
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl font-bold mb-8">Confirm Your Booking</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Guest Information Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Guest Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          required
                          placeholder="John Doe"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          required
                          type="email"
                          placeholder="john@example.com"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          required
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 mt-6"
                      disabled={bookingMutation.isPending}
                    >
                      {bookingMutation.isPending ? "Processing..." : "Confirm Booking"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="shadow-elegant sticky top-24">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <img
                      src={state.hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"}
                      alt={state.hotel.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-display text-xl font-semibold">{state.hotel.name}</h3>
                    <p className="text-sm text-muted-foreground">{state.hotel.city}, {state.hotel.country}</p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Check-in</div>
                        <div className="text-muted-foreground">
                          {format(new Date(state.checkIn), "PPP")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Check-out</div>
                        <div className="text-muted-foreground">
                          {format(new Date(state.checkOut), "PPP")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Guests</div>
                        <div className="text-muted-foreground">{state.guests} guest(s)</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price per night</span>
                      <span>${state.hotel.price}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <Badge className="text-lg px-3 py-1">
                        ${state.totalPrice}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirm;
