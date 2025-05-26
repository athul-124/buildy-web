
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // For image uploads later
import type { ExpertProfile } from '@/types';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCog, Save, LogOut, Briefcase } from 'lucide-react';

const expertProfileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters."),
  bio: z.string().optional(),
  specialties: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()).filter(s => s) : []), // Comma-separated string to array
  servicesOffered: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()).filter(s => s) : []),
  location: z.string().optional(),
  phone: z.string().optional(), // Stored in users collection, but could be displayed/updated here for convenience
  // avatarUrl will be handled separately
});

type ExpertProfileFormInputs = z.infer<typeof expertProfileSchema>;

export default function ExpertProfilePage() {
  const { user, userDoc, role, loading, logOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expertData, setExpertData] = useState<ExpertProfile | null>(null);
  // const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ExpertProfileFormInputs>({
    resolver: zodResolver(expertProfileSchema),
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=/profile/expert');
      } else if (role && role !== 'expert') {
        router.push(role === 'customer' ? '/profile/customer' : '/');
      } else if (user && role === 'expert') {
        // Fetch expert specific data
        const fetchExpertData = async () => {
          const expertRef = doc(db, 'experts', user.uid);
          const expertSnap = await getDoc(expertRef);
          if (expertSnap.exists()) {
            const data = expertSnap.data() as ExpertProfile;
            setExpertData(data);
            // Pre-fill form
            setValue('displayName', data.displayName || userDoc?.name || '');
            setValue('bio', data.bio || '');
            setValue('specialties', data.specialties?.join(', ') || '');
            setValue('servicesOffered', data.servicesOffered?.join(', ') || '');
            setValue('location', data.location || '');
            setValue('phone', userDoc?.phone || '');
          } else {
             // If expert doc doesn't exist, prefill with userDoc name
            setValue('displayName', userDoc?.name || '');
            setValue('phone', userDoc?.phone || '');
          }
        };
        fetchExpertData();
      }
    }
  }, [user, userDoc, role, loading, router, setValue]);

  const onSubmit: SubmitHandler<ExpertProfileFormInputs> = async (data) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      const expertRef = doc(db, 'experts', user.uid);
      // let newAvatarUrl = expertData?.avatarUrl;

      // Handle avatar upload - Placeholder for now
      // if (avatarFile) {
      //   const storageRef = ref(storage, `expert_avatars/${user.uid}/${avatarFile.name}`);
      //   const snapshot = await uploadBytes(storageRef, avatarFile);
      //   newAvatarUrl = await getDownloadURL(snapshot.ref);
      // }

      const profilePayload: Partial<ExpertProfile> = {
        displayName: data.displayName,
        bio: data.bio,
        specialties: data.specialties,
        servicesOffered: data.servicesOffered,
        location: data.location,
        // avatarUrl: newAvatarUrl,
        updatedAt: serverTimestamp(),
      };
      
      // Also update phone in users collection if changed
      if (userDoc && data.phone && data.phone !== userDoc.phone) {
        await updateDoc(doc(db, 'users', user.uid), { phone: data.phone });
      }


      if (expertData) { // If profile exists, update it
        await updateDoc(expertRef, profilePayload);
      } else { // If not, create it (setDoc with merge option also works)
        await setDoc(expertRef, { ...profilePayload, uid: user.uid, createdAt: serverTimestamp() }, { merge: true });
      }

      toast({
        title: "Profile Updated",
        description: "Your expert profile has been successfully updated.",
      });
      // Optionally re-fetch data or update local state
      const updatedExpertSnap = await getDoc(expertRef);
      if (updatedExpertSnap.exists()) setExpertData(updatedExpertSnap.data() as ExpertProfile);

    } catch (error) {
      console.error("Error updating expert profile:", error);
      toast({
        title: "Update Failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setAvatarFile(e.target.files[0]);
  //   }
  // };

  if (loading || !userDoc || role !== 'expert') {
    return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">{/* Loader */}</div>;
  }
  
  const getInitials = (name?: string) => {
    if (!name) return 'EX';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="space-y-8">
       <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 rounded-lg shadow">
        <div className="container mx-auto text-center">
          <UserCog className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Expert Profile</h1>
          <p className="text-lg text-muted-foreground">Manage your public presence and service details.</p>
        </div>
      </section>

      <Card className="max-w-3xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={expertData?.avatarUrl || `https://placehold.co/100x100.png?text=${getInitials(expertData?.displayName || userDoc.name)}`} alt={expertData?.displayName || userDoc.name} data-ai-hint="person avatar" />
                <AvatarFallback>{getInitials(expertData?.displayName || userDoc.name)}</AvatarFallback>
              </Avatar>
              {/* <Input 
                type="file" 
                id="avatarUpload" 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                accept="image/*"
                // onChange={handleAvatarChange} 
                // disabled //  Enable when upload logic is complete
              />
              <Label htmlFor="avatarUpload" className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full cursor-pointer hover:bg-primary/90">
                <Edit3 className="h-3 w-3" />
              </Label> */}
            </div>
            <div className="flex-grow">
              <Label htmlFor="displayName" className="text-xs text-muted-foreground">Display Name / Business Name</Label>
              <Input 
                id="displayName" 
                {...register("displayName")} 
                className={`text-2xl font-semibold p-1 border-0 focus-visible:ring-1 focus-visible:ring-primary ${errors.displayName ? "border-destructive ring-destructive" : ""}`}
              />
              {errors.displayName && <p className="text-sm text-destructive mt-1">{errors.displayName.message}</p>}
              <CardDescription className="mt-1">This name will be shown to customers.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-1">
              <Label htmlFor="bio">About You / Your Business (Bio)</Label>
              <Textarea id="bio" {...register("bio")} rows={4} placeholder="Tell customers about your experience, skills, and what makes your service great." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="specialties">Specialties (e.g., Residential Wiring, Bathroom Plumbing)</Label>
                <Input id="specialties" {...register("specialties")} placeholder="Comma-separated, e.g., Wiring, Fixture Installation" />
                <p className="text-xs text-muted-foreground">Main categories you specialize in.</p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="servicesOffered">Specific Services Offered</Label>
                <Input id="servicesOffered" {...register("servicesOffered")} placeholder="Comma-separated, e.g., Fan repair, Tap replacement" />
                <p className="text-xs text-muted-foreground">Detailed list of services.</p>
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <Label htmlFor="location">Service Area / Location</Label>
                    <Input id="location" {...register("location")} placeholder="e.g., Thrissur Town, Ollur" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="phone">Contact Phone (for customers)</Label>
                    <Input id="phone" type="tel" {...register("phone")} placeholder="Your contact number" />
                </div>
            </div>
            {/* Availability and Project Photos sections would go here - complex UI, defer for now */}
            {/* For now, just show what's in Firestore if available */}
            {expertData?.availability && (
                <div>
                    <Label>Current Availability (View Only)</Label>
                    <pre className="text-xs bg-muted p-2 rounded-md">{JSON.stringify(expertData.availability, null, 2)}</pre>
                    <p className="text-xs text-muted-foreground mt-1">Availability management coming soon.</p>
                </div>
            )}


          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t">
            <Button variant="outline" className="w-full sm:w-auto justify-start" onClick={logOut}>
                <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Profile
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
