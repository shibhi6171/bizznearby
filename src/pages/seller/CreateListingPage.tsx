import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/hooks/useCategories';
import { useLocation } from '@/contexts/LocationContext';
import { useCreateListing } from '@/hooks/useListings';
import { toast } from 'sonner';

const listingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  category_id: z.string().min(1, 'Please select a category'),
  location_id: z.string().min(1, 'Please select a location'),
  listing_type: z.enum(['service', 'product']),
  price: z.coerce.number().min(0).optional(),
  price_unit: z.string().optional(),
});

type ListingForm = z.infer<typeof listingSchema>;

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isSeller, isLoading: authLoading } = useAuth();
  const { data: categories } = useCategories();
  const { locations } = useLocation();
  const createListing = useCreateListing();

  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<ListingForm>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      description: '',
      category_id: '',
      location_id: '',
      listing_type: 'service',
      price: undefined,
      price_unit: 'fixed',
    },
  });

  if (authLoading) {
    return <div className="container-wide py-8">Loading...</div>;
  }

  if (!isAuthenticated || !isSeller) {
    return <Navigate to="/auth" replace />;
  }

  const handleAddFeature = () => {
    if (newFeature.trim() && features.length < 10) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      setImages([...images, url.trim()]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ListingForm, status: 'draft' | 'active') => {
    try {
      await createListing.mutateAsync({
        title: data.title,
        description: data.description,
        category_id: data.category_id,
        location_id: data.location_id,
        listing_type: data.listing_type,
        price: data.price,
        price_unit: data.price_unit,
        features,
        images,
        status,
      });
      toast.success(status === 'active' ? 'Listing published!' : 'Draft saved!');
      navigate('/seller/listings');
    } catch (error) {
      toast.error('Failed to create listing');
    }
  };

  const serviceCategories = categories?.filter(c => c.listing_type === 'service') || [];
  const productCategories = categories?.filter(c => c.listing_type === 'product') || [];
  const listingType = form.watch('listing_type');
  const relevantCategories = listingType === 'service' ? serviceCategories : productCategories;

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container-wide py-8">
        {/* Back */}
        <Button variant="ghost" size="sm" asChild className="gap-2 mb-6">
          <Link to="/seller/listings">
            <ArrowLeft className="w-4 h-4" />
            Back to Listings
          </Link>
        </Button>

        <div className="max-w-3xl">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold">Create New Listing</h1>
            <p className="text-muted-foreground mt-1">
              Fill in the details to list your service or product
            </p>
          </div>

          <form className="space-y-8">
            {/* Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Listing Type</CardTitle>
                <CardDescription>What are you offering?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={form.watch('listing_type')}
                  onValueChange={(value) => {
                    form.setValue('listing_type', value as 'service' | 'product');
                    form.setValue('category_id', ''); // Reset category when type changes
                  }}
                  className="grid grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="type-service"
                    className={`flex flex-col items-center gap-2 p-6 border rounded-xl cursor-pointer transition-all ${
                      listingType === 'service'
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <RadioGroupItem value="service" id="type-service" className="sr-only" />
                    <span className="text-3xl">🛠️</span>
                    <span className="font-semibold">Service</span>
                    <span className="text-xs text-muted-foreground text-center">
                      Plumbing, tutoring, cleaning, etc.
                    </span>
                  </Label>
                  <Label
                    htmlFor="type-product"
                    className={`flex flex-col items-center gap-2 p-6 border rounded-xl cursor-pointer transition-all ${
                      listingType === 'product'
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <RadioGroupItem value="product" id="type-product" className="sr-only" />
                    <span className="text-3xl">📦</span>
                    <span className="font-semibold">Product</span>
                    <span className="text-xs text-muted-foreground text-center">
                      Goods, items, handmade products
                    </span>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Professional Home Cleaning Service"
                    {...form.register('title')}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your service or product in detail..."
                    rows={5}
                    {...form.register('description')}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={form.watch('category_id')}
                      onValueChange={(value) => form.setValue('category_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {relevantCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.category_id && (
                      <p className="text-sm text-destructive">{form.formState.errors.category_id.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Select
                      value={form.watch('location_id')}
                      onValueChange={(value) => form.setValue('location_id', value)}
                    >
                      <SelectTrigger>
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
                    {form.formState.errors.location_id && (
                      <p className="text-sm text-destructive">{form.formState.errors.location_id.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...form.register('price')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price_unit">Price Unit</Label>
                    <Select
                      value={form.watch('price_unit')}
                      onValueChange={(value) => form.setValue('price_unit', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Price</SelectItem>
                        <SelectItem value="hour">Per Hour</SelectItem>
                        <SelectItem value="day">Per Day</SelectItem>
                        <SelectItem value="project">Per Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Add images to showcase your listing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 w-6 h-6"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {images.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-accent flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-xs">Add Image URL</span>
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>Highlight key features of your listing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Free consultation"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddFeature} disabled={features.length >= 10}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={form.handleSubmit((data) => onSubmit(data, 'draft'))}
                disabled={createListing.isPending}
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                className="btn-gradient"
                onClick={form.handleSubmit((data) => onSubmit(data, 'active'))}
                disabled={createListing.isPending}
              >
                {createListing.isPending ? 'Publishing...' : 'Publish Listing'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
