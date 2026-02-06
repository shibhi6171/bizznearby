import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <Store className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-display font-bold text-xl">
                LocalMart
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm">
              Your hyperlocal marketplace for services and products. Connect with local sellers and find what you need.
            </p>
          </div>

          {/* For Consumers */}
          <div>
            <h4 className="font-display font-semibold mb-4">For Consumers</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/listings" className="hover:text-accent transition-colors">Browse Listings</Link></li>
              <li><Link to="/categories" className="hover:text-accent transition-colors">Categories</Link></li>
              <li><Link to="/wishlist" className="hover:text-accent transition-colors">Wishlist</Link></li>
              <li><Link to="/auth" className="hover:text-accent transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h4 className="font-display font-semibold mb-4">For Sellers</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/seller" className="hover:text-accent transition-colors">Seller Dashboard</Link></li>
              <li><Link to="/seller/listings/new" className="hover:text-accent transition-colors">Create Listing</Link></li>
              <li><Link to="/seller/leads" className="hover:text-accent transition-colors">Manage Leads</Link></li>
              <li><Link to="/seller/payments" className="hover:text-accent transition-colors">Payments</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:support@localmart.com" className="hover:text-accent transition-colors">
                  support@localmart.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+1234567890" className="hover:text-accent transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} LocalMart. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/50">
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
