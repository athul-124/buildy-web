import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40 text-muted-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="text-lg font-semibold text-foreground mb-4">Buildly</h5>
            <p className="text-sm">
              Connecting you with trusted home service professionals in Thrissur. Quality service, transparent pricing, and peace of mind.
            </p>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-foreground mb-4">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-foreground mb-4">Connect With Us</h5>
            <div className="flex space-x-4 mb-4">
              <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={20} /></Link>
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={20} /></Link>
              <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></Link>
              <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin size={20} /></Link>
            </div>
            <p className="text-sm">Get updates and tips straight to your inbox.</p>
            {/* Placeholder for newsletter signup */}
            {/* <form className="mt-2 flex">
              <Input type="email" placeholder="Enter your email" className="flex-grow" />
              <Button type="submit" className="ml-2">Subscribe</Button>
            </form> */}
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-sm">
          <p>&copy; {currentYear} Buildly. All rights reserved.</p>
          <p className="mt-1">Designed with care in Thrissur, Kerala.</p>
        </div>
      </div>
    </footer>
  );
}
