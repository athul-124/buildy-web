
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const { user, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Add debug logging
    console.log("Profile layout state:", { 
      loading, 
      userAuthenticated: !!user,
      userRole: role
    });
    
    // Only redirect if we're sure the user is not authenticated (loading is complete)
    if (!loading && !user) {
      console.log("Profile layout: User not authenticated, redirecting to login");
      // Store the current URL to redirect back after login
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [user, loading, router, role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by the redirect,
    // but as a fallback or during brief state transitions:
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  // This layout can host common elements for all profile types if needed
  return <>{children}</>;
}
