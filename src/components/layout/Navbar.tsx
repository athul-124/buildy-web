
"use client";

import Link from 'next/link';
import { Home, Users, Wrench, Info, MessageCircle, Sparkles, Building2, Menu, LogIn, UserPlus, UserCircle2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter
import { cn } from '@/lib/utils';
import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const baseNavLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/experts', label: 'Find Experts', icon: Users },
  { href: '/services', label: 'Services & Pricing', icon: Wrench },
  { href: '/materials', label: 'Material Advisor', icon: Info },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter(); // Added router
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, role, loading, logOut } = useAuth(); // Get auth state

  const handleLogout = async () => {
    await logOut();
    setIsMobileMenuOpen(false); // Close menu on logout
    // router.push('/'); // AuthContext logOut already redirects
  };
  
  const getProfileLink = () => {
    if (role === 'expert') return '/profile/expert';
    if (role === 'customer') return '/profile/customer';
    return '/login'; // Fallback, should not happen if user is logged in with role
  };

  const navLinks = [
    ...baseNavLinks,
    ...(user 
      ? [
          { href: getProfileLink(), label: 'My Profile', icon: UserCircle2 },
          ...(role === 'customer' ? [{ href: '/my-bookings', label: 'My Bookings', icon: Sparkles }] : []), // Example for role specific link
        ]
      : [
          { href: '/login', label: 'Log In', icon: LogIn },
          { href: '/signup', label: 'Sign Up', icon: UserPlus, isPrimary: true },
        ]
    ),
    // Conditionally add Admin link if needed, or manage separately
    // { href: '/admin/scheduler', label: 'Admin Scheduler', icon: Building2, isAdmin: true },
  ];


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
          <MessageCircle className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">Buildly</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            // if (link.isAdmin && !pathname.startsWith('/admin')) {
            //   return null;
            // }
            if (!link.href) return null; // Skip if no href (e.g. for a logout button if structured differently)

            return (
              <Button
                key={link.label}
                variant={link.isPrimary ? "default" : "ghost"}
                asChild
                className={cn(
                  pathname === link.href && !link.isPrimary && "bg-accent text-accent-foreground",
                )}
              >
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            );
          })}
          {user && (
             <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          )}
        </nav>

        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background p-6">
              <SheetHeader className="mb-6 text-left">
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <MessageCircle className="h-8 w-8 text-primary" /> 
                    <span className="text-xl font-bold text-foreground">Buildly</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => {
                  // if (link.isAdmin && !pathname.startsWith('/admin')) {
                  //   return null;
                  // }
                   if (!link.href) return null;

                  return (
                    <Button
                      key={link.label}
                      variant={pathname === link.href ? (link.isPrimary ? 'default' : 'secondary') : 'ghost'}
                      className="w-full justify-start text-left py-3 h-auto text-base"
                      asChild
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href={link.href}>
                        <link.icon className="mr-3 h-5 w-5" />
                        {link.label}
                      </Link>
                    </Button>
                  );
                })}
                {user && (
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-left py-3 h-auto text-base text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-3 h-5 w-5" /> Logout
                    </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
