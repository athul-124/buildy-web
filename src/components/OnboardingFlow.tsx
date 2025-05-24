"use client";

import type { OnboardingData, OnboardingStep } from '@/types';
import { onboardingSteps } from '@/lib/data';
import { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

// Dynamically create Zod schema from onboardingSteps
const generateSchema = (steps: OnboardingStep[]) => {
  const schemaObject: { [key: string]: z.ZodTypeAny } = {};
  steps.forEach(step => {
    if (step.inputType === 'text' || step.inputType === 'textarea') {
      schemaObject[step.fieldName] = z.string().min(1, { message: `${step.question.replace(':', '')} is required.` });
    } else {
      schemaObject[step.fieldName] = z.string().min(1, { message: `Please select an option for ${step.question.replace(':', '')}.` });
    }
  });
  return z.object(schemaObject);
};

const onboardingSchema = generateSchema(onboardingSteps);

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { control, handleSubmit, trigger, getValues, setValue, formState: { errors, touchedFields }, watch } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange', // Validate on change for better UX
  });

  // Pre-fill serviceCategory if 'service' query param exists
  useEffect(() => {
    const initialServiceId = searchParams.get('service');
    if (initialServiceId) {
      const serviceMap: {[key:string]: string} = { 's1': 'electrical', 's2': 'plumbing', 's3': 'carpentry', 's4': 'appliance_repair'};
      if (serviceMap[initialServiceId]) {
         setValue('serviceCategory', serviceMap[initialServiceId]);
      }
    }
  }, [searchParams, setValue]);


  const step = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const handleNext = async () => {
    const isValid = await trigger(step.fieldName as keyof OnboardingData);
    if (isValid) {
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit(onSubmit)();
      }
    } else {
       // Focus on the first error field if validation fails
       const fieldWithError = Object.keys(errors).find(key => key === step.fieldName);
       if (fieldWithError) {
         const element = document.getElementById(step.fieldName);
         element?.focus();
       }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit: SubmitHandler<OnboardingData> = (data) => {
    console.log('Onboarding data submitted:', data);
    toast({
      title: "Thank you!",
      description: "We've received your request. We'll match you with experts shortly.",
      action: <Sparkles className="text-yellow-400" />,
    });
    router.push(`/experts?serviceCategory=${data.serviceCategory}&location=${data.location}&urgency=${data.urgency}`);
  };
  
  const renderInput = (step: OnboardingStep) => {
    const fieldName = step.fieldName as keyof OnboardingData;
    return (
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => {
          switch (step.inputType) {
            case 'text':
              return <Input {...field} id={fieldName} placeholder={step.description || `Enter ${step.question.toLowerCase().replace(':', '')}`} className={cn(errors[fieldName] && "border-destructive")} aria-describedby={`${fieldName}-error`} />;
            case 'textarea': 
               return <Textarea {...field} id={fieldName} placeholder={step.description || `Describe ${step.question.toLowerCase().replace(':', '')}`} rows={4} className={cn(errors[fieldName] && "border-destructive")} aria-describedby={`${fieldName}-error`} />;
            case 'radio':
              return (
                <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {step.options?.map(option => (
                    <Label
                      key={option.value}
                      htmlFor={`${fieldName}-${option.value}`}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 sm:p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all",
                        field.value === option.value && "border-primary ring-2 ring-primary shadow-md",
                        errors[fieldName] && "border-destructive"
                      )}
                      aria-describedby={`${fieldName}-error`}
                    >
                      <RadioGroupItem value={option.value} id={`${fieldName}-${option.value}`} className="sr-only" />
                      {option.icon && <option.icon className={cn("mb-2 h-6 w-6 sm:h-7 sm:w-7", field.value === option.value ? "text-primary" : "text-muted-foreground" )} />}
                      <span className="text-xs sm:text-sm font-medium text-center">{option.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              );
            case 'select':
              return (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id={fieldName} className={cn(errors[fieldName] && "border-destructive")} aria-describedby={`${fieldName}-error`}>
                    <SelectValue placeholder={step.description || "Select an option"} />
                  </SelectTrigger>
                  <SelectContent>
                    {step.options?.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            default:
              return <Input {...field} id={fieldName} aria-describedby={`${fieldName}-error`} />;
          }
        }}
      />
    );
  };

  return (
    <Card className="w-full shadow-2xl border-border">
      <CardHeader className="text-center border-b border-border pb-6">
        {step.icon && <step.icon className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2 sm:mb-3" />}
        <CardTitle className="text-xl sm:text-2xl">{step.title}</CardTitle>
        {step.description && !step.options && <CardDescription className="text-sm sm:text-base">{step.description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        <Progress value={progress} className="w-full mb-6 sm:mb-8 h-2" />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          <div>
            <Label htmlFor={step.fieldName} className="text-base sm:text-md font-medium mb-2 sm:mb-3 block">{step.question}</Label>
            {renderInput(step)}
            {errors[step.fieldName] && (
              <p id={`${step.fieldName}-error`} className="text-sm text-destructive mt-1 sm:mt-2">{(errors[step.fieldName] as any)?.message}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between pt-6 sm:pt-8 border-t border-border">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0} className="text-base py-2.5 px-5">
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={handleNext} className="text-base py-2.5 px-5 bg-primary hover:bg-primary/90 text-primary-foreground">
          {currentStep === onboardingSteps.length - 1 ? 'Submit & Find Experts' : 'Next'}
          {currentStep < onboardingSteps.length -1 && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
