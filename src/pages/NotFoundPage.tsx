import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-display font-bold text-gradient mb-4">404</div>
        <h1 className="font-display text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link to="/" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Link>
          </Button>
          <Button className="btn-gradient" asChild>
            <Link to="/" className="gap-2">
              <Home className="w-4 h-4" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
