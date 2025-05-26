
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { Booking } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Added
import Link from 'next/link'; // Added
import { ShoppingBag, CalendarDays, UserCheck, Loader2, AlertTriangle } from 'lucide-react'; // Added icons

export default function MyBookingsPage() {
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/my-bookings');
      } else if (role && role !== 'customer') {
        // Experts might have a different booking management view
        router.push('/profile/expert'); 
      } else if (user && role === 'customer') {
        const fetchBookings = async () => {
          setIsLoadingBookings(true);
          setError(null);
          try {
            const bookingsRef = collection(db, 'bookings');
            const q = query(bookingsRef, where('userId', '==', user.uid), orderBy('scheduledFor', 'desc'));
            const querySnapshot = await getDocs(q);
            const userBookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
            setBookings(userBookings);
          } catch (err) {
            console.error("Error fetching bookings:", err);
            setError("Could not load your bookings. Please try again later.");
          } finally {
            setIsLoadingBookings(false);
          }
        };
        fetchBookings();
      }
    }
  }, [user, role, authLoading, router]);

  if (authLoading || isLoadingBookings) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Oops! Something went wrong.</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }
  
  const getStatusVariant = (status: Booking['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed': return 'default'; // primary (green)
      case 'accepted': return 'secondary'; // a softer color
      case 'pending': return 'outline';
      case 'cancelled':
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 rounded-lg shadow">
        <div className="container mx-auto text-center">
          <ShoppingBag className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">My Bookings</h1>
          <p className="text-lg text-muted-foreground">View and manage your service appointments.</p>
        </div>
      </section>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <CalendarDays className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-3 text-foreground">No Bookings Yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You haven&apos;t scheduled any services. Ready to find an expert for your home needs?
          </p>
          <Button asChild size="lg">
            <Link href="/services">Explore Services</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {bookings.map(booking => (
            <Card key={booking.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl mb-1">{booking.serviceName || "Service Request"}</CardTitle>
                    <Badge variant={getStatusVariant(booking.status)} className="capitalize">{booking.status}</Badge>
                </div>
                <CardDescription className="text-sm">
                  Scheduled for: {new Date(booking.scheduledFor.toDate()).toLocaleDateString()} at {new Date(booking.scheduledFor.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                {booking.expertName && (
                  <div className="flex items-center text-sm">
                    <UserCheck className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-foreground">Expert: {booking.expertName}</span>
                  </div>
                )}
                 {booking.address && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Location: {booking.address}</span>
                  </div>
                )}
                {booking.notes && (
                  <p className="text-xs text-muted-foreground pt-1 border-t border-dashed line-clamp-2">Notes: {booking.notes}</p>
                )}
              </CardContent>
              {/* Add footer for actions if needed, e.g., cancel, reschedule */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
