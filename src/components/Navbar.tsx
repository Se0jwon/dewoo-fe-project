import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hotel, Menu, User } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
        Home
      </Link>
      <Link to="/hotels" className="text-foreground hover:text-primary transition-colors font-medium">
        Hotels
      </Link>
      <Link to="/about" className="text-foreground hover:text-primary transition-colors font-medium">
        About
      </Link>
      <Link to="/contact" className="text-foreground hover:text-primary transition-colors font-medium">
        Contact
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-luxury p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Hotel className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">
              Luxe<span className="text-primary">Stay</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Sign In
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-6 mt-8">
                <NavLinks />
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Sign In
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
