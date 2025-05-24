
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Zap, ShieldCheck, MessageSquareHeart, Sparkles, Wrench } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const features = [
  {
    icon: Users,
    title: 'Expert Connect',
    description: 'Find pre-vetted electricians, plumbers, carpenters & more in Thrissur.',
    color: 'text-accent', // Using accent (Trust Blue) for these icons
  },
  {
    icon: MessageSquareHeart,
    title: 'Emotion-First UX',
    description: 'A friendly onboarding experience that guides you to the right expert.',
    color: 'text-pink-500', // Keeping pink for this one as it's specific
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Scheduling',
    description: 'Smart scheduling assistant for finding the best appointment times.',
    color: 'text-purple-500', // Keeping purple for this one
  },
  {
    icon: Wrench,
    title: 'Transparent Pricing',
    description: 'Clear, upfront costs for common services. No hidden fees.',
    color: 'text-primary', // Using primary (Kerala Green) for this
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-secondary/30">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative inline-block mb-6">
               <MessageSquareHeart className="h-24 w-24 text-primary animate-pulse" /> {/* primary is green */}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
              Welcome to <span className="text-primary">Buildly</span> {/* primary is green */}
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10">
              Your trusted partner for all home service needs in Thrissur. Connect with skilled professionals, get transparent pricing, and enjoy peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Link href="/onboarding">
                  <Sparkles className="mr-2 h-5 w-5" /> Get Started Now {/* Default variant: Kerala Green */}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Link href="/services">
                  Explore Services
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              How <span className="text-primary">Buildly</span> Works {/* primary is green */}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4"> {/* primary is green */}
                    <Zap className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">1. Tell Us Your Need</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Use our simple onboarding to describe your requirement or choose a service.</p>
                </CardContent>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4"> {/* primary is green */}
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">2. Connect With Experts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">We match you with qualified, local professionals with ratings and reviews.</p>
                </CardContent>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4"> {/* primary is green */}
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">3. Get It Done</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Book a consultation, get transparent pricing, and enjoy quality service.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Overview Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start space-x-4 p-1">
                  <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg ${feature.color === 'text-primary' ? 'bg-primary/10' : (feature.color === 'text-accent' ? 'bg-accent/10' : 'bg-gray-200')} ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Placeholder Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Loved by <span className="text-primary">Homeowners</span> in Thrissur {/* primary is green */}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="shadow-md">
                <CardContent className="pt-6">
                  <blockquote className="text-muted-foreground">
                    "Finding a reliable plumber in Thrissur was always a hassle. Buildly made it so easy! Professional service and fair pricing. Highly recommend."
                  </blockquote>
                  <div className="mt-4 flex items-center">
                    <Image data-ai-hint="person portrait" src="https://placehold.co/40x40.png" alt="User Maya R." width={40} height={40} className="rounded-full" />
                    <p className="ml-3 font-semibold text-foreground">Maya R.</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardContent className="pt-6">
                  <blockquote className="text-muted-foreground">
                    "The electrician assigned was very skilled and polite. The transparent pricing was a big plus. Finally, a service I can trust for my home repairs."
                  </blockquote>
                  <div className="mt-4 flex items-center">
                    <Image data-ai-hint="person smiling" src="https://placehold.co/40x40.png" alt="User Suresh K." width={40} height={40} className="rounded-full" />
                    <p className="ml-3 font-semibold text-foreground">Suresh K.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
