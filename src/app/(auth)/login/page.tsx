
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogInIcon } from 'lucide-react';
import type { AuthError } from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { logIn, role, user, loading } = useAuth(); // Added user and loading
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      await logIn(data.email, data.password);
      
      toast({
        title: "Logged In!",
        description: "Welcome back to Buildly!",
      });
      
      // We don't need to handle redirection here anymore
      // The useEffect will handle redirection based on authentication state
      // This avoids race conditions and duplicate redirects
      console.log("Login successful - useEffect will handle redirection");
      
      // Note: We're not manually redirecting here anymore.
      // The useEffect hook will detect the authentication state change
      // and redirect appropriately based on role and any redirect parameters.

    } catch (error) {
      const firebaseError = error as AuthError;
      let errorMessage = "Login failed. Please check your credentials and try again.";
      if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password.";
      } else if (firebaseError.code === 'auth/too-many-requests') {
        errorMessage = "Too many login attempts. Please try again later.";
      }
      console.error("Login error:", firebaseError);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Effect to redirect if user is already authenticated or becomes authenticated
  useEffect(() => {
    // Check URL for redirect parameter
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');
    
    console.log("Login page: Auth state changed", { 
      isAuthenticated: !!user,
      role, 
      redirectPath,
      loading
    });
    
    // Only proceed if authentication check is complete
    if (!loading && user) {
      if (redirectPath) {
        // If there's a redirect path in the URL, use that
        console.log(`Login page: Redirecting to ${redirectPath}`);
        router.push(redirectPath);
      } else if (role === 'expert') {
        console.log("Login page: Redirecting to expert profile");
        router.push('/profile/expert');
      } else if (role === 'customer') {
        console.log("Login page: Redirecting to customer profile");
        router.push('/profile/customer');
      } else {
        // If role is not yet available but user is authenticated
        console.log("Login page: User authenticated but role not yet available");
        // Wait a bit longer for role to be set
        setTimeout(() => {
          if (role) {
            const profilePath = role === 'expert' ? '/profile/expert' : '/profile/customer';
            router.push(profilePath);
          } else {
            // Fallback to home if role still not available
            router.push('/');
          }
        }, 1000); // Give more time for role to be set
      }
    }
  }, [user, role, router, loading]);


  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <LogInIcon className="mx-auto h-10 w-10 text-primary mb-3" />
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription>Sign in to your Buildly account.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Log In
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
