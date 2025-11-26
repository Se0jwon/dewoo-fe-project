import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { Hotel } from "@/lib/api";
import { Link } from "react-router-dom";

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard = ({ hotel }: HotelCardProps) => {
  return (
    <Link to={`/hotel/${hotel.id}`}>
      <Card className="overflow-hidden hover:shadow-elegant transition-all duration-300 group cursor-pointer">
        <div className="relative h-64 overflow-hidden">
          <img
            src={hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground shadow-lg">
              ${hotel.price}/night
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-display text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 bg-gold-light px-2 py-1 rounded-md">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <span className="text-sm font-semibold text-navy">{hotel.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{hotel.city}, {hotel.country}</span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {hotel.description}
          </p>
          
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {hotel.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{hotel.amenities.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
