
"use client";

import { useState, type FormEvent } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Expert } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ConsultationModalProps {
  expert: Expert;
  triggerButton?: React.ReactNode;
}

export function ConsultationModal({ expert, triggerButton }: ConsultationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !time) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name, phone, preferred date, and time.",
        variant: "destructive",
      });
      return;
    }

    const bookingDetails = {
      expertId: expert.id,
      expertName: expert.name,
      userName: name,
      userPhone: phone,
      preferredDate: date ? format(date, "PPP") : 'Not specified',
      preferredTime: time,
      notes,
    };
    console.log('Booking consultation:', bookingDetails);
    
    toast({
      title: "Consultation Requested!",
      description: `We've sent your request to ${expert.name}. They will contact you shortly.`,
    });

    // Pre-fill WhatsApp message if expert has WhatsApp
    if (expert.contact.whatsapp) {
      const message = encodeURIComponent(
        `Hi ${expert.name}, I just booked a consultation via Buildly for ${expert.specialty} services.\nMy details:\nName: ${name}\nPhone: ${phone}\nPreferred Date: ${bookingDetails.preferredDate}\nPreferred Time: ${time}${notes ? `\nNotes: ${notes}` : ''}`
      );
      const whatsappUrl = `https://wa.me/${expert.contact.whatsapp.replace(/\D/g, '')}?text=${message}`;
      // Optionally, redirect or offer to open WhatsApp
      // window.open(whatsappUrl, '_blank');
      console.log("WhatsApp URL for confirmation (optional):", whatsappUrl);
    }

    setIsOpen(false); 
    setName(''); setPhone(''); setDate(new Date()); setTime(''); setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || <Button>Book Consultation</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Book Consultation with {expert.name}</DialogTitle>
          <DialogDescription>
            Fill in your details to schedule a consultation for {expert.specialty} services.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your Phone Number" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Preferred Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() -1)) } // Disable past dates
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Preferred Time</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any specific details or questions?" />
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Request Consultation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
