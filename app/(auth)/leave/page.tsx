"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { differenceInCalendarDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";

export default function LeavePage() {
  const { toast } = useToast();
  const [leaveType, setLeaveType] = useState<string>("paid");
  const [range, setRange] = useState<DateRange | undefined>();
  const [days, setDays] = useState<number>(0);
  const [reason, setReason] = useState<string>("");

  useEffect(() => {
    if (range?.from && range?.to) {
      setDays(differenceInCalendarDays(range.to, range.from) + 1);
    } else {
      setDays(0);
    }
  }, [range]);

  const prettyRange = range?.from
    ? range.to
      ? `${format(range.from, "PP")} – ${format(range.to, "PP")}`
      : format(range.from, "PP")
    : "Select dates";

  const onSubmit = () => {
    toast({
      title: "Leave request submitted",
      description: `${leaveType} • ${days} day(s) • ${prettyRange}`,
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Leave Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>New Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="leave-type">Leave type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger id="leave-type" aria-label="Leave type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sick">Sick</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {prettyRange}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={range}
                    onSelect={setRange}
                    numberOfMonths={2}
                    className="p-3 pointer-events-auto"
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">Select start and end dates.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="days">Number of leaves (days)</Label>
              <Input
                id="days"
                type="number"
                min={0}
                step={1}
                value={Number.isFinite(days) ? days : 0}
                onChange={(e) => setDays(parseInt(e.target.value || "0", 10))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Textarea
                id="reason"
                placeholder="Reason (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={onSubmit}>Submit Request</Button>
            <Button 
              variant="secondary" 
              onClick={() => { 
                setRange(undefined); 
                setDays(0); 
                setReason(""); 
              }}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
