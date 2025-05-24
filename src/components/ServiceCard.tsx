
import type { Service } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import { Badge } from '@/components/ui/badge';
import { Info, Users, Tag } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils'; // Import cn for class merging

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {service.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={service.imageUrl}
            alt={service.name}
            data-ai-hint={service.dataAiHint || 'service related image'}
            layout="fill"
            objectFit="cover"
          />
           {service.category && (
            <Badge className="absolute top-2 left-2" variant="secondary">{service.category}</Badge>
          )}
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-xl mb-1">{service.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-baseline gap-2">
          <Tag size={18} className="text-primary" /> {/* primary is green */}
          <p className="text-2xl font-bold text-foreground">
            ₹{service.basePrice.toLocaleString()}
            {service.priceRange && ` - ₹${service.priceRange.max.toLocaleString()}`}
          </p>
        </div>
        {service.expertsAvailable !== undefined && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Users size={16} className="mr-2 text-primary" /> {/* primary is green */}
            <span>{service.expertsAvailable} Experts Available</span>
          </div>
        )}
        
        {service.priceExplanation && (
          <Accordion type="single" collapsible className="w-full text-sm">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="py-2 text-primary hover:no-underline [&[data-state=open]>svg]:text-primary"> {/* primary is green */}
                <Info size={16} className="mr-1 inline"/> Why this cost?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-1 pb-0">
                {service.priceExplanation}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-muted/30 border-t">
        <Link 
          href={`/onboarding?service=${service.id}`} 
          legacyBehavior 
          passHref
        >
          <a className={cn(buttonVariants({ variant: 'default', size: 'default' }), "w-full")}>
            Book This Service
          </a>
        </Link>
      </CardFooter>
    </Card>
  );
}
