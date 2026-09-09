import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store, Eye, EyeOff, ArrowLeft, User, Briefcase, MapPin, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AppRole } from '@/types/database';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['consumer', 'seller']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const initialRole = searchParams.get('role') as AppRole | null;
  const [activeTab, setActiveTab] = useState(initialMode);

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: initialRole === 'seller' ? 'seller' : 'consumer',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = async (data: SignInForm) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);

    if (error) {
      toast.error(error.message || 'Failed to sign in');
    } else {
      toast.success('Welcome back!');
      navigate('/');
    }
  };

  const handleSignUp = async (data: SignUpForm) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName, data.role);
    setIsLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered. Please sign in instead.');
      } else {
        toast.error(error.message || 'Failed to create account');
      }
    } else {
      toast.success('Account created! Please check your email to verify your account.');
      setActiveTab('signin');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left brand panel — hidden on small screens */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-hero-gradient p-12 text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>

        <Link to="/" className="relative inline-flex items-center gap-2 font-display text-xl font-bold z-10">
          <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          LocalMart
        </Link>

        <div className="relative z-10 space-y-8 max-w-sm">
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight mb-3">
              Your hyperlocal marketplace, in one place.
            </h1>
            <p className="text-primary-foreground/80">
              Discover trusted sellers nearby, or start listing your own services and products in minutes.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-sm text-primary-foreground/90">Find services and shops near you</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-sm text-primary-foreground/90">List and sell in a few clicks</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-sm text-primary-foreground/90">Secure, verified accounts</span>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} LocalMart. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="lg:hidden inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <Card className="border-border/60 shadow-xl rounded-2xl">
            <CardHeader className="text-center pb-2">
              <div className="lg:hidden mx-auto w-12 h-12 rounded-xl bg-hero-gradient flex items-center justify-center mb-4">
                <Store className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="font-display text-2xl">
                {activeTab === 'signin' ? 'Welcome back' : 'Create your account'}
              </CardTitle>
              <CardDescription>
                {activeTab === 'signin'
                  ? 'Sign in to your account to continue'
                  : 'Join LocalMart in under a minute'}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Sign In Form */}
                <TabsContent value="signin">
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        {...signInForm.register('email')}
                      />
                      {signInForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{signInForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password">Password</Label>
                      </div>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...signInForm.register('password')}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      {signInForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{signInForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full btn-gradient" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                {/* Sign Up Form */}
                <TabsContent value="signup">
                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        {...signUpForm.register('fullName')}
                      />
                      {signUpForm.formState.errors.fullName && (
                        <p className="text-sm text-destructive">{signUpForm.formState.errors.fullName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        {...signUpForm.register('email')}
                      />
                      {signUpForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{signUpForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...signUpForm.register('password')}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      {signUpForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{signUpForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm Password</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="••••••••"
                        {...signUpForm.register('confirmPassword')}
                      />
                      {signUpForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive">{signUpForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-3">
                      <Label>I want to:</Label>
                      <RadioGroup
                        value={signUpForm.watch('role')}
                        onValueChange={(value) => signUpForm.setValue('role', value as 'consumer' | 'seller')}
                        className="grid grid-cols-2 gap-4"
                      >
                        <Label
                          htmlFor="role-consumer"
                          className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all ${
                            signUpForm.watch('role') === 'consumer'
                              ? 'border-accent bg-accent/10'
                              : 'border-border hover:border-accent/50'
                          }`}
                        >
                          <RadioGroupItem value="consumer" id="role-consumer" className="sr-only" />
                          <User className="w-6 h-6" />
                          <span className="font-medium">Buy</span>
                          <span className="text-xs text-muted-foreground text-center">Find local services & products</span>
                        </Label>
                        <Label
                          htmlFor="role-seller"
                          className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all ${
                            signUpForm.watch('role') === 'seller'
                              ? 'border-accent bg-accent/10'
                              : 'border-border hover:border-accent/50'
                          }`}
                        >
                          <RadioGroupItem value="seller" id="role-seller" className="sr-only" />
                          <Briefcase className="w-6 h-6" />
                          <span className="font-medium">Sell</span>
                          <span className="text-xs text-muted-foreground text-center">List your services & products</span>
                        </Label>
                      </RadioGroup>
                    </div>

                    <Button type="submit" className="w-full btn-gradient" disabled={isLoading}>
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
