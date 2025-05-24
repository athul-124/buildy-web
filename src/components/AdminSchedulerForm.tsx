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
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { scheduleContractor, ScheduleContractorInput, ScheduleContractorOutput } from '@/ai/flows/schedule-contractors'; // Ensure correct path

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
        title: "Scheduling Successful!",
        description: `Contractor ${response.contractorAssigned} has been scheduled.`,
        action: <CheckCircle className="text-green-500" />,
      });
      reset(); // Reset form fields
    } catch (error) {
      console.error("Scheduling failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Scheduling Failed",
        description: `Could not schedule contractor. ${errorMessage}`,
        variant: "destructive",
        action: <AlertTriangle className="text-white" />
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-border">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">AI-Powered Contractor Scheduler</CardTitle>
        <CardDescription className="text-muted-foreground">
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
              className={errors.userDetails ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary"}
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
              className={errors.contractorDetails ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary"}
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
              className={errors.appointmentPreferences ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary"}
            />
            {errors.appointmentPreferences && <p className="text-sm text-destructive">{errors.appointmentPreferences.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4 pt-6 border-t border-border">
          <Button type="submit" disabled={isLoading} className="w-full text-base py-3 h-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Scheduling...
              </>
            ) : (
              "Schedule with AI"
            )}
          </Button>
          {result && (
            <Card className="bg-green-50 border-green-300 p-4 shadow-sm">
              <CardHeader className="p-0 mb-2">
                 <CardTitle className="text-lg text-green-700 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5"/> Scheduling Confirmed!
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-sm">
                <p className="text-green-600"><strong className="text-green-700">Contractor Assigned:</strong> {result.contractorAssigned}</p>
                <p className="text-green-600"><strong className="text-green-700">Confirmation:</strong> {result.confirmation}</p>
              </CardContent>
            </Card>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
