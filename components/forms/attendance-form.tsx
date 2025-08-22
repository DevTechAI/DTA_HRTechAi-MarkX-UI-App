'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
    attendanceFormSchema,
    AttendanceFormValues,
    defaultAttendanceValues
} from '@/lib/validations/attendance';
import { useAttendanceStore } from '@/store/attendance';
import { AttendanceLocation } from '@/types/attendance';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function AttendanceForm() {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(true);
  
  const { 
    currentSession,
    setCurrentSession,
    addToHistory,
    isLoading,
    error,
    setLoading,
    setError
  } = useAttendanceStore();

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: defaultAttendanceValues,
  });

  const handlePunchIn = async (data: AttendanceFormValues) => {
    if (currentSession) {
      toast({
        title: "Already punched in",
        description: "Please punch out first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real application, we would save to Firebase here
      const newSession = {
        id: crypto.randomUUID(),
        userId: 'current-user-id', // In a real app, this would come from Firebase Auth
        start: new Date(),
        mode: data.mode,
        location: data.mode === 'Offline' && data.location ? data.location as AttendanceLocation : undefined,
        notes: data.notes,
      };
      
      setCurrentSession(newSession);
      
      toast({ 
        title: "Punched in", 
        description: `${data.mode}${data.location ? ` • ${data.location}` : ""}` 
      });
    } catch (err) {
      console.error('Error punching in:', err);
      setError(err instanceof Error ? err.message : 'Failed to punch in');
      toast({
        title: "Error punching in",
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePunchOut = async () => {
    if (!currentSession) {
      toast({ 
        title: "Not punched in", 
        description: "Please punch in first." 
      });
      return;
    }

    try {
      setLoading(true);
      
      // In a real application, we would update Firebase here
      const completedSession = { 
        ...currentSession, 
        end: new Date() 
      };
      
      addToHistory(completedSession);
      setCurrentSession(null);
      
      toast({ 
        title: "Punched out", 
        description: "Session saved to history." 
      });
    } catch (err) {
      console.error('Error punching out:', err);
      setError(err instanceof Error ? err.message : 'Failed to punch out');
      toast({
        title: "Error punching out",
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: AttendanceFormValues) => {
    if (currentSession) {
      handlePunchOut();
    } else {
      handlePunchIn(data);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Working Mode</FormLabel>
                    <FormDescription>
                      Are you working online or at the office?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === 'Online'}
                      onCheckedChange={(checked) => {
                        setIsOnline(checked);
                        field.onChange(checked ? 'Online' : 'Offline');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isOnline && (
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Office 1">Office 1</SelectItem>
                        <SelectItem value="Office 2">Office 2</SelectItem>
                        <SelectItem value="Office 3">Office 3</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the location you are working from
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about your work day"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can add any details about your work day
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {currentSession ? "Punch Out" : "Punch In"}
              </Button>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
