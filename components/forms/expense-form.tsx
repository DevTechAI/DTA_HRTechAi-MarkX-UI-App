'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
    defaultExpenseFormValues,
    expenseFormSchema,
    ExpenseFormValues
} from '@/lib/validations/expenses';
import { useExpenseStore } from '@/store/expenses';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

export function ExpenseForm() {
  const { toast } = useToast();
  const { 
    addClaim,
    isLoading,
    error,
    setLoading,
    setError
  } = useExpenseStore();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: defaultExpenseFormValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleSubmit = async (data: ExpenseFormValues) => {
    try {
      setLoading(true);
      
      // Calculate the total amount
      const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0);
      
      // In a real application, we would save to Firebase here
      const newClaim = {
        id: crypto.randomUUID(),
        userId: 'current-user-id', // In a real app, this would come from Firebase Auth
        title: data.title,
        submissionDate: new Date(),
        status: 'draft' as const,
        totalAmount,
        items: data.items.map(item => ({
          id: crypto.randomUUID(),
          description: item.description,
          amount: item.amount,
          date: item.date,
          category: item.category,
          notes: item.notes
          // In a real app, we would upload the receipt to storage and get the URL
        })),
        comments: data.comments,
      };
      
      addClaim(newClaim);
      
      toast({ 
        title: "Expense claim created", 
        description: `Your draft for "${data.title}" has been saved.` 
      });
      
      form.reset(defaultExpenseFormValues);
    } catch (err) {
      console.error('Error creating expense claim:', err);
      setError(err instanceof Error ? err.message : 'Failed to create expense claim');
      toast({
        title: "Error creating claim",
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addExpenseItem = () => {
    append({
      description: '',
      amount: 0,
      date: new Date(),
      category: 'other',
      receipt: null,
      notes: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Expense Claim</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Claim Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Business Trip to New York" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive title for this expense claim
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Expense Items</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addExpenseItem}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <div 
                  key={field.id} 
                  className="p-4 border rounded-md space-y-4 relative"
                >
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Taxi from airport" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`items.${index}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="0.00" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.date`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`items.${index}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="travel">Travel</SelectItem>
                              <SelectItem value="meals">Meals</SelectItem>
                              <SelectItem value="accommodation">Accommodation</SelectItem>
                              <SelectItem value="supplies">Supplies</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name={`items.${index}.notes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional details about this expense"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information about this expense claim"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Save Claim"}
            </Button>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
