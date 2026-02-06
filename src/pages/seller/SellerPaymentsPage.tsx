import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { CreditCard, Package, Zap, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Get started with basic features',
    features: [
      'Up to 5 active listings',
      'Basic analytics',
      'Email support',
      'Standard visibility',
    ],
    cta: 'Current Plan',
    current: true,
  },
  {
    name: 'Premium',
    price: 29,
    description: 'Grow your business with advanced features',
    features: [
      'Unlimited listings',
      'Advanced analytics',
      'Priority support',
      'Featured visibility',
      '5 boosts/month included',
      'Lead management tools',
    ],
    cta: 'Upgrade to Premium',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    description: 'For high-volume sellers',
    features: [
      'Everything in Premium',
      'Dedicated account manager',
      'Custom integrations',
      'Unlimited boosts',
      'API access',
      'White-label options',
    ],
    cta: 'Contact Sales',
  },
];

const boostPackages = [
  { days: 7, price: 9.99, popular: false },
  { days: 14, price: 17.99, popular: true },
  { days: 30, price: 29.99, popular: false },
];

export default function SellerPaymentsPage() {
  const { isAuthenticated, isSeller, isLoading } = useAuth();

  if (isLoading) {
    return <div className="container-wide py-8">Loading...</div>;
  }

  if (!isAuthenticated || !isSeller) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container-wide py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Payments & Plans</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription and boost your listings
          </p>
        </div>

        {/* Subscription Plans */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-semibold mb-6">Subscription Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? 'border-accent shadow-glow' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 badge-featured">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="font-display">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'btn-gradient' : ''}`}
                    variant={plan.current ? 'secondary' : plan.popular ? 'default' : 'outline'}
                    disabled={plan.current}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Boost Packages */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-accent" />
            <h2 className="font-display text-2xl font-semibold">Boost Your Listings</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Boosted listings appear at the top of search results and category pages, 
            getting up to 5x more views and leads.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {boostPackages.map((pkg) => (
              <Card 
                key={pkg.days} 
                className={pkg.popular ? 'border-accent' : ''}
              >
                <CardContent className="p-6 text-center">
                  {pkg.popular && (
                    <Badge className="badge-featured mb-4">Best Value</Badge>
                  )}
                  <div className="text-4xl font-bold mb-2">{pkg.days}</div>
                  <div className="text-muted-foreground mb-4">days</div>
                  <div className="text-2xl font-semibold mb-4">${pkg.price}</div>
                  <Button 
                    className={`w-full ${pkg.popular ? 'btn-gradient' : ''}`}
                    variant={pkg.popular ? 'default' : 'outline'}
                  >
                    Purchase Boost
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Payment History */}
        <section>
          <h2 className="font-display text-2xl font-semibold mb-6">Payment History</h2>
          <Card>
            <CardContent className="p-6 text-center">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No payments yet</h3>
              <p className="text-muted-foreground text-sm">
                Your payment history will appear here once you make a purchase.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
