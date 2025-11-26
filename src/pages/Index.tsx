import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, Star, MapPin, Calendar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>
        
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
            Discover Your Perfect
            <span className="block text-gradient">Luxury Escape</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience world-class hospitality at the finest hotels and resorts around the globe
          </p>
          <Link to="/hotels">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 shadow-elegant">
              <Search className="mr-2 h-5 w-5" />
              Explore Hotels
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">Why Choose LuxeStay</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We offer the best selection of luxury accommodations with unmatched service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-8 shadow-card hover:shadow-elegant transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3">Best Price Guarantee</h3>
              <p className="text-muted-foreground">
                We guarantee the best rates for your stay with our price match promise
              </p>
            </div>

            <div className="bg-card rounded-lg p-8 shadow-card hover:shadow-elegant transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3">Prime Locations</h3>
              <p className="text-muted-foreground">
                Handpicked hotels in the most desirable destinations worldwide
              </p>
            </div>

            <div className="bg-card rounded-lg p-8 shadow-card hover:shadow-elegant transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3">Flexible Booking</h3>
              <p className="text-muted-foreground">
                Free cancellation and easy modifications for worry-free planning
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary via-gold to-primary rounded-2xl p-12 text-center shadow-elegant">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Ready to Book Your Dream Stay?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied guests who trust us for their luxury travel needs
            </p>
            <Link to="/hotels">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Browse All Hotels
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
