import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, User, Menu, X, Store, ShoppingBag, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { getInitials } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { isAuthenticated, profile, mode, setMode, isSeller, signOut } = useAuth();
  const { locations, selectedLocation, setSelectedLocation } = useLocation();
  const navigate = useNavigate();

  const handleModeToggle = async () => {
    const newMode = mode === 'consumer' ? 'seller' : 'consumer';
    await setMode(newMode);
    navigate(newMode === 'seller' ? '/seller' : '/');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-hero-gradient flex items-center justify-center">
              <Store className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl hidden sm:block">
              Local<span className="text-gradient">Mart</span>
            </span>
          </Link>

          {/* Location Selector */}
          <div className="hidden md:flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <Select
              value={selectedLocation?.id || ''}
              onValueChange={(value) => {
                const location = locations.find(l => l.id === value);
                setSelectedLocation(location || null);
              }}
            >
              <SelectTrigger className="w-[160px] border-none bg-transparent hover:bg-secondary/50">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/categories" className="text-sm font-medium hover:text-accent transition-colors">
              Categories
            </Link>
            <Link to="/shops" className="text-sm font-medium hover:text-accent transition-colors">
              Shops
            </Link>
            {isAuthenticated && isSeller && (

              <Button
                variant="ghost"
                size="sm"
                onClick={handleModeToggle}
                className="gap-2"
              >
                {mode === 'consumer' ? (
                  <>
                    <Store className="w-4 h-4" />
                    <span>Switch to Seller</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Switch to Consumer</span>
                  </>
                )}
              </Button>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-8 w-8">
  <AvatarImage src={profile?.avatar_url || undefined} />

  <AvatarFallback className="bg-accent text-accent-foreground text-xs font-semibold">
    {(profile?.full_name || 'Account').charAt(0).toUpperCase()}
  </AvatarFallback>
</Avatar>

<span className="hidden max-w-[140px] truncate font-medium lg:block">
  {profile?.full_name || 'Account'}
</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  {isSeller && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/seller">Seller Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/seller/listings">My Listings</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button size="sm" className="btn-gradient" asChild>
                  <Link to="/auth?mode=signup">Get Started</Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-2">
              {/* Mobile Location */}
              <div className="flex items-center gap-2 px-2 py-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <Select
                  value={selectedLocation?.id || ''}
                  onValueChange={(value) => {
                    const location = locations.find(l => l.id === value);
                    setSelectedLocation(location || null);
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="px-4 py-2 hover:bg-secondary rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/wishlist"
                    className="px-4 py-2 hover:bg-secondary rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  {isSeller && (
                    <>
                      <Link
                        to="/seller"
                        className="px-4 py-2 hover:bg-secondary rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Seller Dashboard
                      </Link>
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => {
                          handleModeToggle();
                          setMobileMenuOpen(false);
                        }}
                      >
                        {mode === 'consumer' ? 'Switch to Seller' : 'Switch to Consumer'}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    className="justify-start text-destructive"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="px-4 py-2 hover:bg-secondary rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <div className="px-2">
                    <Button className="w-full btn-gradient" asChild>
                      <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
