"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { addWeeks, eachDayOfInterval, endOfWeek, format, startOfWeek, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, Lock, Unlock } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type DailyHours = {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
};

type WeeklyAvailability = {
  id: string;
  weekStartDate: Date;
  weekEndDate: Date;
  isLocked: boolean;
  lockedAt?: Date;
  plannedHours: DailyHours;
  actualHours: DailyHours;
  totalPlannedHours: number;
  totalActualHours: number;
  dsuConfirmation: boolean;
  sundayMeetupConfirmation: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

const DAYS: (keyof DailyHours)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Validation constants
const MAX_DAILY_HOURS = 16;
const MAX_WEEKLY_HOURS = 80;

export default function WeeklyAvailabilityPage() {
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [weeklyData, setWeeklyData] = useState<WeeklyAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const weekStart = useMemo(() => startOfWeek(currentWeek, { weekStartsOn: 1 }), [currentWeek]);
  const weekEnd = useMemo(() => endOfWeek(currentWeek, { weekStartsOn: 1 }), [currentWeek]);
  const weekDays = useMemo(() => eachDayOfInterval({ start: weekStart, end: weekEnd }), [weekStart, weekEnd]);

  // Initialize empty weekly data
  const initializeWeeklyData = useCallback((): WeeklyAvailability => {
    const emptyHours: DailyHours = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    };

    return {
      id: `week-${format(weekStart, 'yyyy-MM-dd')}`,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      isLocked: false,
      plannedHours: emptyHours,
      actualHours: emptyHours,
      totalPlannedHours: 0,
      totalActualHours: 0,
      dsuConfirmation: false,
      sundayMeetupConfirmation: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }, [weekStart, weekEnd]);

  // Load weekly data (from localStorage for now)
  useEffect(() => {
    const weekKey = `weekly-availability-${format(weekStart, 'yyyy-MM-dd')}`;
    const savedData = localStorage.getItem(weekKey);
    
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Convert date strings back to Date objects
      parsed.weekStartDate = new Date(parsed.weekStartDate);
      parsed.weekEndDate = new Date(parsed.weekEndDate);
      if (parsed.lockedAt) parsed.lockedAt = new Date(parsed.lockedAt);
      parsed.createdAt = new Date(parsed.createdAt);
      parsed.updatedAt = new Date(parsed.updatedAt);
      setWeeklyData(parsed);
    } else {
      setWeeklyData(initializeWeeklyData());
    }
  }, [weekStart, initializeWeeklyData]);

  // Save weekly data to localStorage
  const saveWeeklyData = useCallback((data: WeeklyAvailability) => {
    const weekKey = `weekly-availability-${format(weekStart, 'yyyy-MM-dd')}`;
    const updatedData = {
      ...data,
      updatedAt: new Date(),
    };
    localStorage.setItem(weekKey, JSON.stringify(updatedData));
    setWeeklyData(updatedData);
  }, [weekStart]);

  // Calculate totals
  const calculateTotals = useCallback((hours: DailyHours): number => {
    return Object.values(hours).reduce((sum, h) => sum + (h || 0), 0);
  }, []);

  // Update planned hours
  const updatePlannedHours = useCallback((day: keyof DailyHours, hours: number) => {
    if (!weeklyData || weeklyData.isLocked) return;

    // Validation
    if (hours < 0) {
      toast({
        title: "Invalid Input",
        description: "Hours cannot be negative",
        variant: "destructive",
      });
      return;
    }

    if (hours > MAX_DAILY_HOURS) {
      toast({
        title: "Maximum Exceeded",
        description: `Daily hours cannot exceed ${MAX_DAILY_HOURS}`,
        variant: "destructive",
      });
      return;
    }

    const newPlannedHours = { ...weeklyData.plannedHours, [day]: hours };
    const newTotal = calculateTotals(newPlannedHours);

    if (newTotal > MAX_WEEKLY_HOURS) {
      toast({
        title: "Weekly Limit Exceeded",
        description: `Total weekly hours cannot exceed ${MAX_WEEKLY_HOURS}`,
        variant: "destructive",
      });
      return;
    }

    const updatedData = {
      ...weeklyData,
      plannedHours: newPlannedHours,
      totalPlannedHours: newTotal,
    };

    saveWeeklyData(updatedData);
  }, [weeklyData, calculateTotals, saveWeeklyData, toast]);

  // Update actual hours
  const updateActualHours = useCallback((day: keyof DailyHours, hours: number) => {
    if (!weeklyData) return;

    // Validation
    if (hours < 0) {
      toast({
        title: "Invalid Input",
        description: "Hours cannot be negative",
        variant: "destructive",
      });
      return;
    }

    if (hours > MAX_DAILY_HOURS) {
      toast({
        title: "Maximum Exceeded",
        description: `Daily hours cannot exceed ${MAX_DAILY_HOURS}`,
        variant: "destructive",
      });
      return;
    }

    const newActualHours = { ...weeklyData.actualHours, [day]: hours };
    const newTotal = calculateTotals(newActualHours);

    const updatedData = {
      ...weeklyData,
      actualHours: newActualHours,
      totalActualHours: newTotal,
    };

    saveWeeklyData(updatedData);
  }, [weeklyData, calculateTotals, saveWeeklyData, toast]);

  // Lock/unlock planned hours
  const toggleLock = useCallback(() => {
    if (!weeklyData) return;

    const updatedData = {
      ...weeklyData,
      isLocked: !weeklyData.isLocked,
      lockedAt: !weeklyData.isLocked ? new Date() : undefined,
    };

    saveWeeklyData(updatedData);
    
    toast({
      title: updatedData.isLocked ? "Planned Hours Locked" : "Planned Hours Unlocked",
      description: updatedData.isLocked ? "Planned hours can no longer be edited" : "You can now edit planned hours",
    });
  }, [weeklyData, saveWeeklyData, toast]);

  // Update meeting confirmations
  const updateDSUConfirmation = useCallback((confirmed: boolean) => {
    if (!weeklyData) return;
    saveWeeklyData({ ...weeklyData, dsuConfirmation: confirmed });
  }, [weeklyData, saveWeeklyData]);

  const updateSundayMeetupConfirmation = useCallback((confirmed: boolean) => {
    if (!weeklyData) return;
    saveWeeklyData({ ...weeklyData, sundayMeetupConfirmation: confirmed });
  }, [weeklyData, saveWeeklyData]);

  // Navigate weeks
  const navigateWeek = useCallback((direction: 'next' | 'prev') => {
    setCurrentWeek(direction === 'next' ? addWeeks(currentWeek, 1) : subWeeks(currentWeek, 1));
  }, [currentWeek]);

  if (!weeklyData) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Weekly Availability</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[200px] text-center font-medium">
            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Planned Hours Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Planned Hours
            {weeklyData.isLocked ? (
              <Lock className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Unlock className="h-4 w-4 text-muted-foreground" />
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLock}
            className="flex items-center gap-2"
          >
            {weeklyData.isLocked ? (
              <>
                <Unlock className="h-4 w-4" />
                Unlock
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Lock
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {DAYS.map((day, index) => (
              <div key={day} className="space-y-2">
                <Label className="text-sm font-medium">
                  {DAY_LABELS[index]}
                  <br />
                  <span className="text-xs text-muted-foreground">
                    {format(weekDays[index], "MMM d")}
                  </span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  max={MAX_DAILY_HOURS}
                  step="0.5"
                  value={weeklyData.plannedHours[day] || ""}
                  onChange={(e) => updatePlannedHours(day, parseFloat(e.target.value) || 0)}
                  disabled={weeklyData.isLocked}
                  className={weeklyData.isLocked ? "bg-muted" : ""}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-muted/50 rounded-md">
            <div className="flex justify-between text-sm">
              <span>Total Planned Hours:</span>
              <span className="font-semibold">{weeklyData.totalPlannedHours}h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actual Hours Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Actual Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {DAYS.map((day, index) => (
              <div key={day} className="space-y-2">
                <Label className="text-sm font-medium">
                  {DAY_LABELS[index]}
                  <br />
                  <span className="text-xs text-muted-foreground">
                    {format(weekDays[index], "MMM d")}
                  </span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  max={MAX_DAILY_HOURS}
                  step="0.5"
                  value={weeklyData.actualHours[day] || ""}
                  onChange={(e) => updateActualHours(day, parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-muted/50 rounded-md">
            <div className="flex justify-between text-sm">
              <span>Total Actual Hours:</span>
              <span className="font-semibold">{weeklyData.totalActualHours}h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Confirmations */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>DSU Meeting Confirmation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Daily Stand-up meeting at 9:00 PM every working day
              </p>
              <div className="flex items-center justify-between">
                <Label htmlFor="dsu-switch">I will attend DSU meetings this week</Label>
                <Switch
                  id="dsu-switch"
                  checked={weeklyData.dsuConfirmation}
                  onCheckedChange={updateDSUConfirmation}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Status: {weeklyData.dsuConfirmation ? "✅ Confirmed" : "⏳ Pending"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sunday Offline Meetup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Weekly offline meetup on {format(weekDays[6], "EEEE, MMM d")}
              </p>
              <div className="flex items-center justify-between">
                <Label htmlFor="sunday-switch">I can attend this Sunday's meetup</Label>
                <Switch
                  id="sunday-switch"
                  checked={weeklyData.sundayMeetupConfirmation}
                  onCheckedChange={updateSundayMeetupConfirmation}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Status: {weeklyData.sundayMeetupConfirmation ? "✅ Available" : "❌ Not Available"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
