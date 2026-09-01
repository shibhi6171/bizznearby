import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { AppLayout } from "@/components/layout/AppLayout";

import HomePage from "@/pages/HomePage";
import AuthPage from "@/pages/AuthPage";
import ListingsPage from "@/pages/ListingsPage";
import ListingDetailPage from "@/pages/ListingDetailPage";
import WishlistPage from "@/pages/WishlistPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SellerDashboardPage from "@/pages/seller/SellerDashboardPage";
import SellerListingsPage from "@/pages/seller/SellerListingsPage";
import CreateListingPage from "@/pages/seller/CreateListingPage";
import SellerLeadsPage from "@/pages/seller/SellerLeadsPage";
import SellerPaymentsPage from "@/pages/seller/SellerPaymentsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <LocationProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />

              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/listings" element={<ListingsPage />} />
                <Route path="/listings/:id" element={<ListingDetailPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/seller" element={<SellerDashboardPage />} />
                <Route path="/seller/listings" element={<SellerListingsPage />} />
                <Route path="/seller/listings/new" element={<CreateListingPage />} />
                <Route path="/seller/leads" element={<SellerLeadsPage />} />
                <Route path="/seller/payments" element={<SellerPaymentsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </LocationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
