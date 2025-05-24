import { MessageSquareHeart } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4">
      <header className="absolute top-0 left-0 w-full p-4 sm:p-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary transition-colors">
          <MessageSquareHeart className="h-7 w-7 text-primary" />
          <span>Thrissur Home Joy</span>
        </Link>
      </header>
      <main className="w-full max-w-2xl">
        {children}
      </main>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Thrissur Home Joy. Your trusted home service partner.
      </footer>
    </div>
  );
}
