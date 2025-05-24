
import { getExpertById, mockExperts } from '@/lib/data';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MapPin, Phone, Mail, MessageSquare, Star } from 'lucide-react';
import { ConsultationModal } from '@/components/ConsultationModal';
import { RatingDisplay } from '@/components/RatingDisplay';
import { Separator } from '@/components/ui/separator';

// This would typically come from an API call
async function getExpertDetails(id: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50));
  const expert = getExpertById(id);
  if (!expert) {
    return null; 
  }
  return expert;
}


export async function generateStaticParams() {
  return mockExperts.map(expert => ({
    id: expert.id,
  }));
}


export default async function ExpertDetailPage({ params }: { params: { id: string } }) {
  const expert = await getExpertDetails(params.id);

  if (!expert) {
    notFound(); 
  }

  const whatsAppMessage = expert.contact.whatsapp 
    ? encodeURIComponent(`Hi ${expert.name}, I found you on Buildly and I'd like to request a consultation for ${expert.specialty} services.`)
    : '';
  const whatsAppUrl = expert.contact.whatsapp 
    ? `https://wa.me/${expert.contact.whatsapp.replace(/\D/g, '')}?text=${whatsAppMessage}`
    : '#';


  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section className="relative rounded-lg overflow-hidden shadow-lg">
        <Image
          src={expert.projectPhotos.length > 0 ? expert.projectPhotos[0].url : "https://placehold.co/1200x400.png"}
          alt={`${expert.name}'s work`}
          data-ai-hint={expert.projectPhotos.length > 0 ? expert.projectPhotos[0].dataAiHint : "construction tools"}
          width={1200}
          height={400}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10">
          <div className="flex items-center space-x-4">
            {expert.avatarUrl && (
              <Image
                src={expert.avatarUrl}
                alt={expert.name}
                data-ai-hint="person portrait"
                width={100}
                height={100}
                className="rounded-full border-4 border-background shadow-md"
              />
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{expert.name}</h1>
              <p className="text-xl text-primary-foreground/90">{expert.specialty}</p>
              <RatingDisplay rating={expert.rating} reviewCount={expert.reviewCount} showText className="mt-1 text-white" starSize={20} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About {expert.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{expert.bio}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {expert.servicesOffered.map((service) => (
                  <li key={service} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-foreground">{service}</span>
                  </li>
                ))}
              </ul>
               {expert.tags && expert.tags.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {expert.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {expert.projectPhotos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Project Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {expert.projectPhotos.map((photo) => (
                    <div key={photo.id} className="rounded-lg overflow-hidden aspect-video shadow-sm">
                      <Image
                        src={photo.url}
                        alt={photo.caption || `Project by ${expert.name}`}
                        data-ai-hint={photo.dataAiHint || 'work site'}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      {photo.caption && <p className="text-xs text-muted-foreground mt-1 text-center">{photo.caption}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar / Contact Area */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="sticky top-24 shadow-lg"> {/* Sticky for larger screens */}
            <CardHeader className="bg-primary/10">
              <CardTitle className="text-primary">Contact & Consultation</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {expert.contact.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-muted-foreground mr-3" />
                  <a href={`tel:${expert.contact.phone}`} className="text-foreground hover:text-primary">{expert.contact.phone}</a>
                </div>
              )}
              {expert.contact.email && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-muted-foreground mr-3" />
                  <a href={`mailto:${expert.contact.email}`} className="text-foreground hover:text-primary">{expert.contact.email}</a>
                </div>
              )}
              {expert.contact.whatsapp && (
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-muted-foreground mr-3" />
                  <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">Chat on WhatsApp</a>
                </div>
              )}
              {expert.location && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
                  <span className="text-foreground">{expert.location}</span>
                </div>
              )}
              {expert.availability && (
                <>
                  <Separator className="my-3"/>
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground">Availability:</strong> {expert.availability}</p>
                </>
              )}
              
              <Separator className="my-4" />

              <ConsultationModal expert={expert} triggerButton={
                <Button size="lg" className="w-full">
                  <MessageSquare className="mr-2 h-5 w-5" /> Book Online Consultation
                </Button>
              }/>
              {expert.contact.whatsapp && (
                 <Button variant="outline" size="lg" className="w-full" asChild>
                    <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
                        Confirm via WhatsApp
                    </a>
                 </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
