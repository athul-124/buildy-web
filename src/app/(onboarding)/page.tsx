import { OnboardingFlow } from '@/components/OnboardingFlow';
import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function OnboardingLoading() {
  return (
    <Card className="w-full max-w-2xl shadow-2xl">
      <CardContent className="flex flex-col items-center justify-center p-10 min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your personalized experience...</p>
      </CardContent>
    </Card>
  );
}

function OnboardingContent() {
  return <OnboardingFlow />;
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingLoading />}>
      <OnboardingContent />
    </Suspense>
  );
}
