
'use server';

/**
 * @fileOverview An AI-powered scheduling tool that automatically books contractors for appointments.
 *
 * - scheduleContractor - A function that handles the scheduling process.
 * - ScheduleContractorInput - The input type for the scheduleContractor function.
 * - ScheduleContractorOutput - The return type for the scheduleContractor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScheduleContractorInputSchema = z.object({
  userDetails: z
    .string()
    .describe('Details of the user, including their preferences and requirements.'),
  contractorDetails: z
    .string()
    .describe('Details of the contractor, including their skills and availability.'),
  appointmentPreferences: z
    .string()
    .describe('The appointment preferences, including date, time, and duration.'),
});
export type ScheduleContractorInput = z.infer<typeof ScheduleContractorInputSchema>;

const ScheduleContractorOutputSchema = z.object({
  confirmation: z
    .string()
    .describe('A confirmation message with the scheduled appointment details.'),
  contractorAssigned: z
    .string()
    .describe('The name of the contractor assigned to the job.'),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .describe('A score from 0.0 to 1.0 indicating the confidence in the scheduled appointment.'),
  reasoning: z
    .string()
    .describe('A brief explanation of why this particular schedule and contractor were chosen.'),
});
export type ScheduleContractorOutput = z.infer<typeof ScheduleContractorOutputSchema>;

export async function scheduleContractor(input: ScheduleContractorInput): Promise<ScheduleContractorOutput> {
  return scheduleContractorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scheduleContractorPrompt',
  input: {schema: ScheduleContractorInputSchema},
  output: {schema: ScheduleContractorOutputSchema},
  prompt: `You are an AI assistant scheduling tool that books contractors for appointments.

  Given the user details, contractor details, and appointment preferences, schedule the appointment.
  Your response MUST include a confirmation message, the assigned contractor, a confidence score (a number between 0.0 and 1.0) for your proposed schedule, and a brief reasoning for your choice based on the provided inputs.

  User Details: {{{userDetails}}}
  Contractor Details: {{{contractorDetails}}}
  Appointment Preferences: {{{appointmentPreferences}}}
  `,
});

const scheduleContractorFlow = ai.defineFlow(
  {
    name: 'scheduleContractorFlow',
    inputSchema: ScheduleContractorInputSchema,
    outputSchema: ScheduleContractorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI scheduling failed to produce an output.');
    }
    // Ensure confidenceScore is a number, default to 0 if not present or NaN
    if (typeof output.confidenceScore !== 'number' || isNaN(output.confidenceScore)) {
        console.warn('Confidence score was not a number, defaulting to 0.')
        output.confidenceScore = 0;
    }
    return output;
  }
);
