
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail, Phone, MapPin, UserCircle, LogOut, ShoppingBag } from 'lucide-react';

export default function CustomerProfilePage() {
  const { user, userDoc, role, loading, logOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Add debug logging
    console.log("Customer profile state:", { 
      loading, 
      userAuthenticated: !!user,
      userRole: role,
      userDocExists: !!userDoc
    });
    
    // Only take action when loading is complete
    if (!loading) {
      if (!user) {
        console.log("Customer profile: User not authenticated, redirecting to login");
        router.push('/login?redirect=/profile/customer');
      } else if (role && role !== 'customer') {
        console.log("Customer profile: User has wrong role, redirecting");
        // If logged in user is not a customer, redirect them appropriately
        router.push(role === 'expert' ? '/profile/expert' : '/');
      }
    }
  }, [user, role, loading, router, userDoc]);
  
  // Additional effect to handle case where user is authenticated but userDoc is not yet loaded
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (user && !userDoc && !loading) {
      console.log("Customer profile: User authenticated but userDoc not loaded, waiting...");
      
      // Set a timeout to check if userDoc gets loaded
      timeoutId = setTimeout(() => {
        if (!userDoc) {
          console.log("Customer profile: userDoc still not loaded after timeout, refreshing auth state");
          // If userDoc is still not loaded after timeout, we might need to refresh the page
          // or implement a retry mechanism in the AuthContext
          window.location.reload();
        }
      }, 3000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, userDoc, loading]);

  if (loading || !userDoc || role !== 'customer') {
    // Show loading or redirecting state, or if role is incorrect (handled by useEffect)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        {/* Loading spinner or message */}
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 rounded-lg shadow">
        <div className="container mx-auto text-center">
          <UserCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">My Profile</h1>
          <p className="text-lg text-muted-foreground">Manage your Buildly account details.</p>
        </div>
      </section>
      
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-4 pb-4">
          <Avatar className="h-20 w-20 border-2 border-primary">
            {/* Placeholder for actual avatar image if available */}
            <AvatarImage src={userDoc.avatarUrl || `https://placehold.co/100x100.png?text=${getInitials(userDoc.name)}`} alt={userDoc.name} data-ai-hint="person avatar" />
            <AvatarFallback>{getInitials(userDoc.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{userDoc.name}</CardTitle>
            <CardDescription className="capitalize">{userDoc.role}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {userDoc.email && (
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-muted-foreground mr-3" />
              <span className="text-foreground">{userDoc.email}</span>
            </div>
          )}
          {userDoc.phone && (
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-muted-foreground mr-3" />
              <span className="text-foreground">{userDoc.phone}</span>
            </div>
          )}
          {userDoc.address && (
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
              <span className="text-foreground">{userDoc.address}</span>
            </div>
          )}
          <div className="border-t pt-6 space-y-3">
             <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/my-bookings">
                    <ShoppingBag className="mr-2 h-4 w-4" /> View My Bookings
                </Link>
             </Button>
            {/* Add link to edit profile if needed */}
            {/* <Button variant="outline" className="w-full">Edit Profile</Button> */}
            <Button variant="destructive" className="w-full justify-start" onClick={logOut}>
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
