
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus } from 'lucide-react';
import type { UserRole } from '@/types';
import type { AuthError } from 'firebase/auth';

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }).optional(),
  role: z.enum(['customer', 'expert'], { required_error: "Please select your role." }),
  address: z.string().optional(), // Optional, primarily for customers
});

type SignUpFormInputs = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, role: authRoleFromContext } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: 'customer', // Default role
    }
  });

  const selectedRole = watch("role");

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      await signUp(data.name, data.email, data.password, data.phone || '', data.role as UserRole, data.address);
      toast({
        title: "Account Created!",
        description: "Welcome to Buildly! You can now log in.",
      });
      // Redirect based on role after successful signup
      if (data.role === 'expert') {
        router.push('/profile/expert'); // Or a specific expert onboarding step
      } else {
        router.push('/profile/customer'); // Or customer dashboard
      }
    } catch (error) {
      const firebaseError = error as AuthError;
      let errorMessage = "Sign up failed. Please try again.";
      if (firebaseError.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Try logging in.";
      } else if (firebaseError.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please choose a stronger password.";
      }
      console.error("Signup error:", firebaseError);
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Effect to redirect if role becomes available after signup (e.g. if context updates)
  useEffect(() => {
    if (authRoleFromContext) {
      if (authRoleFromContext === 'expert') {
        router.push('/profile/expert');
      } else if (authRoleFromContext === 'customer') {
        router.push('/profile/customer');
      }
    }
  }, [authRoleFromContext, router]);


  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <UserPlus className="mx-auto h-10 w-10 text-primary mb-3" />
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>Join Buildly to connect with home service experts.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register("name")} className={errors.name ? "border-destructive" : ""} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} className={errors.email ? "border-destructive" : ""} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} className={errors.password ? "border-destructive" : ""} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input id="phone" type="tel" {...register("phone")} className={errors.phone ? "border-destructive" : ""} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="role">I am a...</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="role" className={errors.role ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Homeowner / Customer</SelectItem>
                    <SelectItem value="expert">Service Expert / Contractor</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
          </div>
          {selectedRole === 'customer' && (
            <div className="space-y-1">
              <Label htmlFor="address">Address (Optional for Customers)</Label>
              <Input id="address" {...register("address")} placeholder="Your street address" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sign Up
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log In
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
