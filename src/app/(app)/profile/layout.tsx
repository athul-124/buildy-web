
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const { user, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile"); // Redirect to login if not authenticated
    }
  }, [user, loading, router]);

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
