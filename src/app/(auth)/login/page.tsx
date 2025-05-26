
"use client";

import { useState } from 'react';
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
  const { logIn, role } = useAuth(); // Removed userDoc as it's fetched post-login by context
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      await logIn(data.email, data.password);
      // The AuthContext useEffect will fetch userDoc and role.
      // We need to wait for the role to be set before redirecting.
      // A better approach might be to have logIn return the userDoc or for AuthContext to manage redirection.
      // For now, we'll use a timeout to give AuthContext time to update.
      // This is not ideal and should be refactored for production.
      toast({
        title: "Logged In!",
        description: "Welcome back to Buildly!",
      });
      
      // Attempt to redirect based on role, might need a slight delay or a more robust way
      // to wait for role to be populated in AuthContext
      setTimeout(() => {
        // Re-check role from context after login might be more reliable
        // This part is tricky as context update is async
        if (role === 'expert') {
            router.push('/profile/expert');
        } else if (role === 'customer') {
            router.push('/profile/customer');
        } else {
            // Fallback if role isn't immediately available, or a better check for role from useAuth()
             router.push('/'); 
        }
      }, 500); // Small delay, adjust as needed or implement a more robust solution

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
  
  // Effect to redirect if role becomes available after login
  useEffect(() => {
    if (role) {
      if (role === 'expert') {
        router.push('/profile/expert');
      } else if (role === 'customer') {
        router.push('/profile/customer');
      }
    }
  }, [role, router]);


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
