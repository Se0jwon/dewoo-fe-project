import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Calendar as CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { SearchFilters } from "@/lib/api";

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    onSearch({
      city: city || undefined,
      checkIn: checkIn ? format(checkIn, "yyyy-MM-dd") : undefined,
      checkOut: checkOut ? format(checkOut, "yyyy-MM-dd") : undefined,
      guests: guests || undefined,
    });
  };

  return (
    <div className="bg-card shadow-card rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Location</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="City or hotel name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Check-in</label>
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
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Check-out</label>
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
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                initialFocus
                disabled={(date) => checkIn ? date < checkIn : false}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Guests</label>
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

      <Button 
        onClick={handleSearch} 
        className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Search className="mr-2 h-4 w-4" />
        Search Hotels
      </Button>
    </div>
  );
};
