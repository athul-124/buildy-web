
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertTriangle, Info, Sparkles } from 'lucide-react'; // Added Sparkles
import { scheduleContractor, ScheduleContractorInput, ScheduleContractorOutput } from '@/ai/flows/schedule-contractors'; 

const formSchema = z.object({
  userDetails: z.string().min(10, "User details must be at least 10 characters."),
  contractorDetails: z.string().min(10, "Contractor details must be at least 10 characters."),
  appointmentPreferences: z.string().min(10, "Appointment preferences must be at least 10 characters."),
});

type FormData = z.infer<typeof formSchema>;

export function AdminSchedulerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScheduleContractorOutput | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const scheduleInput: ScheduleContractorInput = data;
      const response = await scheduleContractor(scheduleInput);
      setResult(response);
      toast({
        title: "Scheduling Suggestion Ready!",
        description: `AI has proposed a schedule for ${response.contractorAssigned}. Confidence: ${(response.confidenceScore * 100).toFixed(0)}%`,
        action: <Sparkles className="text-yellow-400" />, // Using Sparkles for AI success
      });
      // reset(); // Commented out to allow admin to review and re-submit if needed
    } catch (error) {
      console.error("AI Scheduling failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "AI Scheduling Issue",
        description: `The AI couldn't complete the schedule. ${errorMessage} Please review inputs or try manual scheduling.`,
        variant: "destructive",
        action: <AlertTriangle className="text-destructive-foreground" />
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-border">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">AI-Powered Contractor Scheduler</CardTitle>
        <CardDescription> {/* Removed text-muted-foreground to allow default paragraph styling */}
          Enter user details, contractor availability, and appointment preferences. Our AI will find the best slot.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userDetails" className="font-medium text-foreground">User Details & Requirements</Label>
            <Textarea
              id="userDetails"
              {...register("userDetails")}
              placeholder="e.g., John Doe, 123 Main St, needs plumbing for leaky faucet. Prefers mornings. Has a dog."
              rows={4}
              className={errors.userDetails ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.userDetails && <p className="text-sm text-destructive">{errors.userDetails.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractorDetails" className="font-medium text-foreground">Contractor Details & Availability</Label>
            <Textarea
              id="contractorDetails"
              {...register("contractorDetails")}
              placeholder="e.g., Plumber Pete, available Mon-Fri 9am-5pm, except Wed afternoon. Skills: leak repair, pipe installation. Avoids houses with cats."
              rows={4}
              className={errors.contractorDetails ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.contractorDetails && <p className="text-sm text-destructive">{errors.contractorDetails.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="appointmentPreferences" className="font-medium text-foreground">Appointment Preferences</Label>
            <Textarea
              id="appointmentPreferences"
              {...register("appointmentPreferences")}
              placeholder="e.g., Schedule for next week, ideally Tuesday or Thursday morning. Appointment duration approx 2 hours."
              rows={3}
              className={errors.appointmentPreferences ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.appointmentPreferences && <p className="text-sm text-destructive">{errors.appointmentPreferences.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4 pt-6 border-t border-border">
          <Button type="submit" disabled={isLoading} className="w-full text-base py-3 h-auto"> {/* Removed explicit bg-primary, relies on default variant */}
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Thinking...
              </>
            ) : (
              "Get AI Scheduling Suggestion"
            )}
          </Button>
          {result && (
            <Card className="bg-primary/10 border-primary/30 p-4 shadow-sm mt-4"> {/* Changed to use primary for positive AI result */}
              <CardHeader className="p-0 mb-3">
                 <CardTitle className="text-lg text-primary flex items-center">
                    <Sparkles className="mr-2 h-5 w-5"/> AI Suggestion Received!
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-sm space-y-2">
                <p className="text-primary/90"><strong className="text-primary">Contractor Suggested:</strong> {result.contractorAssigned}</p>
                <p className="text-primary/90"><strong className="text-primary">Proposed Schedule:</strong> {result.confirmation}</p>
                <div className="mt-2 pt-2 border-t border-primary/20">
                    <p className="text-xs text-primary/80 flex items-start">
                        <Info size={14} className="mr-2 mt-0.5 shrink-0"/>
                        <span>
                            <strong className="block">AI Reasoning:</strong> {result.reasoning}
                            <strong className="block mt-1">Confidence:</strong> {(result.confidenceScore * 100).toFixed(0)}%
                        </span>
                    </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
