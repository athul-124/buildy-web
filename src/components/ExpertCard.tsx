import type { Expert } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, MessageSquare } from 'lucide-react';
import { RatingDisplay } from './RatingDisplay';

interface ExpertCardProps {
  expert: Expert;
}

export function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        {expert.projectPhotos.length > 0 && (
          <Image
            src={expert.projectPhotos[0].url}
            alt={expert.projectPhotos[0].caption || `Project by ${expert.name}`}
            data-ai-hint={expert.projectPhotos[0].dataAiHint || 'construction work'}
            width={400}
            height={250}
            className="w-full h-48 object-cover"
          />
        )}
         <div className="absolute top-2 right-2">
            <RatingDisplay rating={expert.rating} reviewCount={expert.reviewCount} showText={false} starSize={18} className="bg-black/50 text-white px-2 py-1 rounded-md"/>
         </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <div className="flex items-start gap-4 mb-3">
          {expert.avatarUrl && (
            <Image
              src={expert.avatarUrl}
              alt={expert.name}
              data-ai-hint="person portrait"
              width={64}
              height={64}
              className="rounded-full border-2 border-primary"
            />
          )}
          <div className="flex-grow">
            <CardTitle className="text-xl mb-1">{expert.name}</CardTitle>
            <CardDescription className="text-primary font-medium">{expert.specialty}</CardDescription>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{expert.bio}</p>
        
        {expert.location && (
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <MapPin size={14} className="mr-2 text-primary" />
            {expert.location}
          </div>
        )}

        <div className="mt-3">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {expert.servicesOffered.slice(0, 3).map((service) => (
              <Badge key={service} variant="secondary" className="text-xs">{service}</Badge>
            ))}
            {expert.servicesOffered.length > 3 && <Badge variant="outline" className="text-xs">+{expert.servicesOffered.length - 3} more</Badge>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/30 border-t flex flex-col sm:flex-row gap-2">
        <Button asChild className="flex-1 w-full sm:w-auto">
          <Link href={`/experts/${expert.id}`}>View Profile</Link>
        </Button>
        {expert.contact.whatsapp && (
          <Button variant="outline" asChild className="flex-1 w-full sm:w-auto">
            <a href={`https://wa.me/${expert.contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
              <MessageSquare size={16} className="mr-2" /> WhatsApp
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
