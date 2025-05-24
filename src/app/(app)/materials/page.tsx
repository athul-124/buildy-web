import { mockMaterialTips } from '@/lib/data';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, MessageCircle, Video, Mic } from 'lucide-react';
import Link from 'next/link';

export default function MaterialAdvisorPage() {
  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-accent/10 to-secondary/10 py-12 rounded-lg shadow">
        <div className="container mx-auto text-center">
          <Lightbulb className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Material Advisor</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert advice to help you choose the best quality materials for your home projects at fair prices. Build with confidence.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {mockMaterialTips.map((tip) => (
          <Card key={tip.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            {tip.mediaType === 'video' && tip.mediaUrl && (
              <div className="relative h-48 w-full bg-muted flex items-center justify-center">
                {/* Placeholder for video thumbnail or player */}
                <Image 
                  src={tip.dataAiHint ? `https://placehold.co/400x225.png` : "https://placehold.co/400x225.png"} 
                  alt={`Video tip for ${tip.materialName}`}
                  data-ai-hint={tip.dataAiHint || 'construction material'}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Video className="h-16 w-16 text-white/80" />
                </div>
                <Badge className="absolute bottom-2 right-2" variant="destructive">Video</Badge>
              </div>
            )}
            {tip.mediaType === 'audio' && tip.mediaUrl && (
               <div className="relative h-48 w-full bg-muted flex items-center justify-center">
                <Image 
                  src={tip.dataAiHint ? `https://placehold.co/400x225.png` : "https://placehold.co/400x225.png"} 
                  alt={`Audio tip for ${tip.materialName}`}
                  data-ai-hint={tip.dataAiHint || 'sound waves'}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Mic className="h-16 w-16 text-white/80" />
                </div>
                 <Badge className="absolute bottom-2 right-2" variant="destructive">Audio</Badge>
               </div>
            )}
             {tip.mediaType === 'text' && tip.dataAiHint && (
               <div className="relative h-48 w-full bg-muted flex items-center justify-center">
                <Image 
                  src={`https://placehold.co/400x225.png`} 
                  alt={`Tip for ${tip.materialName}`}
                  data-ai-hint={tip.dataAiHint}
                  layout="fill"
                  objectFit="cover"
                />
                 <Badge className="absolute bottom-2 right-2" variant="secondary">Article</Badge>
               </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{tip.title}</CardTitle>
              <Badge variant="outline" className="w-fit mt-1">{tip.materialName}</Badge>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-4">{tip.content}</p>
            </CardContent>
            <CardFooter className="p-4 bg-muted/30 border-t flex-col items-start space-y-3">
              <div className="flex items-center space-x-2">
                {tip.expertAvatarUrl && (
                  <Image 
                    src={tip.expertAvatarUrl} 
                    alt={tip.expertName} 
                    data-ai-hint="person avatar"
                    width={32} height={32} 
                    className="rounded-full" 
                  />
                )}
                <p className="text-xs font-medium text-foreground">By {tip.expertName}</p>
              </div>
              {(tip.mediaType === 'video' || tip.mediaType === 'audio') && tip.mediaUrl && tip.mediaUrl !== '#' && (
                <Button variant="ghost" asChild className="w-full text-primary">
                  <Link href={tip.mediaUrl} target="_blank" rel="noopener noreferrer">
                    {tip.mediaType === 'video' ? <Video className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                    Watch/Listen Now
                  </Link>
                </Button>
              )}
              {tip.mediaType === 'text' && (
                 <Button variant="ghost" asChild className="w-full text-primary">
                  <Link href={`/materials/tip/${tip.id}`}> 
                    Read Full Tip
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
       <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            <MessageCircle className="mr-2 h-5 w-5" /> Ask Our Experts
          </Button>
          <p className="text-sm text-muted-foreground mt-2">Have specific material questions? Get personalized advice.</p>
        </div>
    </div>
  );
}

// You would also create a [id]/page.tsx for individual material tips if they are articles.
// e.g. src/app/(app)/materials/tip/[id]/page.tsx
