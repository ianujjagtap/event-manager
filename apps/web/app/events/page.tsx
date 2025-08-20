'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/primitives/button';
import { Calendar } from '@/primitives/calender';
import { Card, CardContent, CardHeader, CardTitle } from '@/primitives/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/primitives/dialouge';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/primitives/form';
import { Input } from '@/primitives/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/primitives/popover';

interface Event {
  id: string;
  name: string;
  date: string;
}

// zod schema for event validation
const eventSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Event name must be at least 2 characters.' })
    .max(100, { message: 'Event name must be less than 100 characters.' })
    .refine((val) => val.trim(), { message: 'Event name cannot be empty.' }),
  date: z.date({
    required_error: 'Please select a date for the event.',
  }),
});

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      date: undefined,
    },
  });

  // loading events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        const sortedEvents = parsedEvents.sort(
          (a: Event, b: Event) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setEvents(sortedEvents);
      } catch {
        toast.error('Failed to load saved events');
      }
    }
  }, []);

  // save events to localStorage whenever events change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('events', JSON.stringify(events));
    }
  }, [events]);

  function onSubmit(values: z.infer<typeof eventSchema>) {
    setIsLoading(true);

    // delay
    setTimeout(() => {
      const newEvent: Event = {
        id: Date.now().toString(),
        name: values.name.trim(),
        date: format(values.date, 'yyyy-MM-dd'),
      };

      const updatedEvents = [...events, newEvent].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setEvents(updatedEvents);
      form.reset();
      setIsLoading(false);
      setConfirmationDialog(false);

      toast.success('Event added successfully!', {
        description: `${newEvent.name} scheduled for ${format(values.date, 'PPP')}`,
      });
    }, 800);
  }

  const deleteEvent = (id: string) => {
    const eventToDelete = events.find((e) => e.id === id);
    if (!eventToDelete) return;

    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents);

    if (updatedEvents.length === 0) {
      localStorage.removeItem('events');
    }

    setDeleteDialog(null);
    toast.success('Event deleted successfully!', {
      description: `${eventToDelete.name} has been removed`,
    });
  };

  return (
   <div className="min-h-screen w-full bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-white">Event Manager</h1>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="bg-secondary-foreground/50 border-secondary-foreground">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">Add New Event</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Event Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter event name"
                              {...field}
                              className="bg-black border-secondary-foreground text-white placeholder:text-secondary/50"
                            />
                          </FormControl>
                          <FormDescription className="text-secondary/50">
                            Enter a descriptive name for your event.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-white">Event Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={`w-full pl-3 text-left font-normal bg-black border-secondary-foreground text-secondary/50 hover:bg-black hover:text-secondary/50  ${
                                    !field.value && "text-secondary/50"
                                  }`}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-black border-secondary-foreground" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date("1900-01-01")}
                                className="text-white"
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription className="text-secondary/50">
                            Select the date when your event will take place.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-end">
                      <Dialog open={confirmationDialog} onOpenChange={setConfirmationDialog}>
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            onClick={() => setConfirmationDialog(true)}
                            disabled={!form.formState.isValid}
                            className="bg-white text-black hover:bg-secondary-foreground/20"
                          >
                            Add Event
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="w-[90vw] md:w-[30vw] bg-black border-secondary-foreground">
                          <DialogHeader>
                            <DialogTitle className="text-white">Confirm Event Creation</DialogTitle>
                            <DialogDescription className="text-secondary/50">
                              Are you sure you want to create this event?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="flex gap-4">
                            <Button
                              variant="outline"
                              onClick={() => setConfirmationDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="default"
                              onClick={() => {
                                form.handleSubmit(onSubmit)()
                              }}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Adding Event...
                                </>
                              ) : (
                                "Add Event"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="bg-secondary-foreground/50 border-secondary-foreground">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">Events ({events.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="mb-2 text-secondary/50">No events yet</p>
                    <p className="text-sm text-gray-500">Add your first event to get started!</p>
                  </div>
                ) : (
                  <div className="max-h-96 space-y-3 overflow-y-auto">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between rounded-lg border border-secondary-foreground bg-black p-4 transition-colors hover:bg-secondary-foreground/80"
                      >
                        <div className="flex-1">
                          <h3 className="mb-1 font-medium text-white">{event.name}</h3>
                          <p className="text-sm text-secondary/50">{format(new Date(event.date), "PPP")}</p>
                        </div>

                        <Dialog
                          open={deleteDialog === event.id}
                          onOpenChange={(open) => setDeleteDialog(open ? event.id : null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="default"
                              size="sm"
                              className="text-red-400 bg-red-500 hover:bg-red-500"
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black border-secondary-foreground">
                            <DialogHeader>
                              <DialogTitle className="text-white">Delete Event</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Are you sure you want to delete "{event.name}"? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="default"
                                onClick={() => setDeleteDialog(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteEvent(event.id)}
                                className="bg-red-500 text-white hover:bg-red-500"
                              >
                                Delete Event
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
