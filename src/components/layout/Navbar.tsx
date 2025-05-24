"use client";

import Link from 'next/link';
import { Home, Users, Wrench, Info, MessageCircle, Sparkles, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import * as React from 'react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/experts', label: 'Find Experts', icon: Users },
  { href: '/services', label: 'Services & Pricing', icon: Wrench },
  { href: '/materials', label: 'Material Advisor', icon: Info },
  { href: '/onboarding', label: 'Get Started', icon: Sparkles, isPrimary: true },
  { href: '/admin/scheduler', label: 'Admin Scheduler', icon: Building2, isAdmin: true }, // Example for conditional display
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
          <MessageCircle className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">Thrissur Home Joy</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {navLinks.map((link) => {
            // Simple logic to hide admin link if not on an admin path
            // In a real app, this would be based on user roles
            if (link.isAdmin && !pathname.startsWith('/admin')) {
              return null;
            }
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
              <div className="flex flex-col space-y-4">
                <Link href="/" className="flex items-center gap-2 mb-6" onClick={() => setIsMobileMenuOpen(false)}>
                  <MessageCircle className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold text-foreground">Thrissur Home Joy</span>
                </Link>
                {navLinks.map((link) => {
                  if (link.isAdmin && !pathname.startsWith('/admin')) {
                    return null;
                  }
                  return (
                    <Button
                      key={link.label}
                      variant={pathname === link.href ? 'secondary' : 'ghost'}
                      className="w-full justify-start text-left"
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
