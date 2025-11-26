import { useLocation, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Calendar, Users, Mail, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Booking, Hotel } from "@/lib/api";

interface LocationState {
  booking: Booking;
  hotel: Hotel;
}

const BookingSuccess = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  if (!state?.booking || !state?.hotel) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
            <Link to="/hotels">
              <Button>Browse Hotels</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { booking, hotel } = state;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="font-display text-4xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-lg text-muted-foreground">
              Your reservation has been successfully confirmed
            </p>
            {booking.id && (
              <Badge className="mt-4 text-base px-4 py-2">
                Booking ID: #{booking.id}
              </Badge>
            )}
          </div>

          {/* Booking Details */}
          <Card className="shadow-elegant">
            <CardContent className="p-6">
              {/* Hotel Information */}
              <div className="mb-6">
                <h2 className="font-display text-2xl font-semibold mb-4">Hotel Details</h2>
                <div className="flex gap-4">
                  <img
                    src={hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"}
                    alt={hotel.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold mb-2">{hotel.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{hotel.address}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {hotel.city}, {hotel.country}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Booking Information */}
              <div className="mb-6">
                <h2 className="font-display text-2xl font-semibold mb-4">Reservation Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium mb-1">Check-in</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(booking.checkIn), "PPP")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium mb-1">Check-out</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(booking.checkOut), "PPP")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Users className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium mb-1">Guests</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.guests} guest(s)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Badge className="text-base px-4 py-2 mt-1">
                      ${booking.totalPrice}
                    </Badge>
                    <div>
                      <div className="font-medium mb-1">Total Price</div>
                      <div className="text-sm text-muted-foreground">
                        Payment pending
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Guest Information */}
              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">Guest Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium">{booking.guestEmail}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="font-medium">{booking.guestPhone}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Link to="/hotels">
              <Button variant="outline" size="lg">
                Browse More Hotels
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Confirmation Email Notice */}
          <div className="mt-8 p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to <span className="font-medium text-foreground">{booking.guestEmail}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
