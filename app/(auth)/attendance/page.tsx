"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Loader2, MapPin, Pause, Play, RotateCcw, Square } from "lucide-react";
import { useEffect, useState } from "react";

type WorkMode = "Online" | "Offline";
type WorkStatus = "not_started" | "working" | "paused" | "stopped";

type WorkSession = {
  startTime: Date;
  endTime?: Date;
  pausedTime?: Date;
  resumedTime?: Date;
  totalDuration: number; // in minutes
  mode: WorkMode;
  location?: string;
  status: WorkStatus;
  pausedDurations: { pausedAt: Date; resumedAt?: Date }[];
};

export default function WorkDayPage() {
  const { toast } = useToast();
  const [workMode, setWorkMode] = useState<WorkMode>("Online");
  const [location, setLocation] = useState("");
  const [currentSession, setCurrentSession] = useState<WorkSession | null>(null);
  const [workStatus, setWorkStatus] = useState<WorkStatus>("not_started");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workHistory, setWorkHistory] = useState<WorkSession[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Simulate page loading delay and load data
  useEffect(() => {
    const loadPageData = async () => {
      setIsPageLoading(true);
      
      // Simulate loading delay (1.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Load work history from localStorage
      const savedHistory = localStorage.getItem("workday-history");
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory).map((session: any) => ({
            ...session,
            startTime: new Date(session.startTime),
            endTime: session.endTime ? new Date(session.endTime) : undefined,
            pausedDurations: session.pausedDurations.map((pause: any) => ({
              pausedAt: new Date(pause.pausedAt),
              resumedAt: pause.resumedAt ? new Date(pause.resumedAt) : undefined,
            })),
          }));
          setWorkHistory(parsedHistory);
        } catch (error) {
          console.error("Error loading work history:", error);
        }
      }
      
      setIsPageLoading(false);
    };

    loadPageData();
  }, []);

  // Update current time every second when working
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (workStatus === "working" || workStatus === "paused") {
      interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [workStatus]);

  // Calculate total logged time including pauses
  const calculateTotalLoggedTime = (session: WorkSession): number => {
    if (!session.startTime) return 0;

    let totalMinutes = 0;
    const now = new Date();

    if (session.status === "working") {
      // Currently working - calculate from start time minus paused durations
      totalMinutes = Math.floor((now.getTime() - session.startTime.getTime()) / (1000 * 60));
      
      // Subtract paused durations
      session.pausedDurations.forEach(pause => {
        if (pause.resumedAt) {
          const pausedMinutes = Math.floor((pause.resumedAt.getTime() - pause.pausedAt.getTime()) / (1000 * 60));
          totalMinutes -= pausedMinutes;
        }
      });
    } else if (session.status === "paused") {
      // Currently paused - calculate up to last pause
      const lastPause = session.pausedDurations[session.pausedDurations.length - 1];
      if (lastPause) {
        totalMinutes = Math.floor((lastPause.pausedAt.getTime() - session.startTime.getTime()) / (1000 * 60));
        
        // Subtract previous paused durations
        session.pausedDurations.slice(0, -1).forEach(pause => {
          if (pause.resumedAt) {
            const pausedMinutes = Math.floor((pause.resumedAt.getTime() - pause.pausedAt.getTime()) / (1000 * 60));
            totalMinutes -= pausedMinutes;
          }
        });
      }
    } else if (session.status === "stopped" && session.endTime) {
      // Work day ended - use stored total duration
      totalMinutes = session.totalDuration;
    }

    return Math.max(0, totalMinutes);
  };

  // Format duration as hh:mm
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Start work day
  const startWorkDay = () => {
    if (workMode === "Offline" && !location.trim()) {
      toast({
        title: "Location Required",
        description: "Please specify your work location for offline mode",
        variant: "destructive",
      });
      return;
    }

    const newSession: WorkSession = {
      startTime: new Date(),
      mode: workMode,
      location: workMode === "Offline" ? location : undefined,
      status: "working",
      totalDuration: 0,
      pausedDurations: [],
    };

    setCurrentSession(newSession);
    setWorkStatus("working");

    toast({
      title: "Work Day Started",
      description: `Started working in ${workMode} mode at ${format(new Date(), "HH:mm")}`,
    });
  };

  // Pause work day
  const pauseWorkDay = () => {
    if (!currentSession) return;

    const now = new Date();
    const updatedSession = {
      ...currentSession,
      status: "paused" as WorkStatus,
      pausedDurations: [
        ...currentSession.pausedDurations,
        { pausedAt: now }
      ]
    };

    setCurrentSession(updatedSession);
    setWorkStatus("paused");

    toast({
      title: "Work Day Paused",
      description: `Work paused at ${format(now, "HH:mm")}`,
    });
  };

  // Resume work day
  const resumeWorkDay = () => {
    if (!currentSession) return;

    const now = new Date();
    const updatedPausedDurations = [...currentSession.pausedDurations];
    const lastPause = updatedPausedDurations[updatedPausedDurations.length - 1];
    
    if (lastPause && !lastPause.resumedAt) {
      lastPause.resumedAt = now;
    }

    const updatedSession = {
      ...currentSession,
      status: "working" as WorkStatus,
      pausedDurations: updatedPausedDurations,
    };

    setCurrentSession(updatedSession);
    setWorkStatus("working");

    toast({
      title: "Work Day Resumed",
      description: `Work resumed at ${format(now, "HH:mm")}`,
    });
  };

  // End work day
  const stopWorkDay = () => {
    if (!currentSession) return;

    const now = new Date();
    let updatedPausedDurations = [...currentSession.pausedDurations];
    
    // If currently paused, close the last pause
    if (workStatus === "paused") {
      const lastPause = updatedPausedDurations[updatedPausedDurations.length - 1];
      if (lastPause && !lastPause.resumedAt) {
        lastPause.resumedAt = now;
      }
    }

    // Calculate total duration
    const totalMinutes = calculateTotalLoggedTime({
      ...currentSession,
      endTime: now,
      status: "stopped",
      pausedDurations: updatedPausedDurations,
    });

    const updatedSession = {
      ...currentSession,
      endTime: now,
      status: "stopped" as WorkStatus,
      totalDuration: totalMinutes,
      pausedDurations: updatedPausedDurations,
    };

    // Save to history
    const newHistory = [updatedSession, ...workHistory].slice(0, 20); // Keep only last 20 records
    setWorkHistory(newHistory);
    localStorage.setItem("workday-history", JSON.stringify(newHistory));

    setCurrentSession(updatedSession);
    setWorkStatus("stopped");

    toast({
      title: "Work Day Ended",
      description: `Work day completed with ${formatDuration(totalMinutes)} logged time`,
    });
  };

  // Restart work day
  const restartWorkDay = () => {
    setCurrentSession(null);
    setWorkStatus("not_started");
    setLocation("");

    toast({
      title: "Work Day Reset",
      description: "Ready to start a new work day",
    });
  };

  const getInstructionText = () => {
    switch (workStatus) {
      case "not_started":
        return "Select start work day option when you want to begin working";
      case "working":
        return "You can pause work day or end work day when finished";
      case "paused":
        return "Resume work day when you're ready to continue working";
      case "stopped":
        return "Work day completed - you can restart for a new session";
      default:
        return "";
    }
  };

  // Show loading spinner while page is loading
  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading WorkDay...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">WorkDay</h1>
        <p className="text-muted-foreground">{getInstructionText()}</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Working Mode Selection */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              <Switch
                id="work-mode"
                checked={workMode === "Online"}
                onCheckedChange={(checked) => setWorkMode(checked ? "Online" : "Offline")}
                disabled={workStatus === "working" || workStatus === "paused"}
              />
              <Label htmlFor="work-mode" className="font-medium">
                Working {workMode}
              </Label>
            </div>
          </div>

          {/* Location Selection for Offline Mode */}
          {workMode === "Offline" && workStatus === "not_started" && (
            <div className="flex justify-center">
              <div className="w-full max-w-md space-y-2">
                <Label htmlFor="location-select" className="text-sm font-medium">Work Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger id="location-select">
                    <SelectValue placeholder="Select work location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Office">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Office
                      </div>
                    </SelectItem>
                    <SelectItem value="Office 2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Office 2
                      </div>
                    </SelectItem>
                    <SelectItem value="Client Site">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Client Site
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center">
            <div className="space-y-3">
              {workStatus === "not_started" && (
                <Button
                  onClick={startWorkDay}
                  size="lg"
                  className="w-48 h-12 text-base font-medium bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Work Day
                </Button>
              )}

              {workStatus === "working" && (
                <div className="flex gap-3">
                  <Button
                    onClick={pauseWorkDay}
                    size="lg"
                    className="w-40 h-12 text-base font-medium bg-orange-500 hover:bg-orange-600 text-white border-0"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pause Work Day
                  </Button>
                  <Button
                    onClick={stopWorkDay}
                    size="lg"
                    className="w-40 h-12 text-base font-medium bg-red-300 hover:bg-red-400 text-red-900"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    End WorkDay
                  </Button>
                </div>
              )}

              {workStatus === "paused" && (
                <div className="flex gap-3">
                  <Button
                    onClick={resumeWorkDay}
                    size="lg"
                    className="w-40 h-12 text-base font-medium bg-gray-800 hover:bg-gray-900 text-white"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Resume Work Day
                  </Button>
                  <Button
                    onClick={stopWorkDay}
                    size="lg"
                    className="w-40 h-12 text-base font-medium bg-red-300 hover:bg-red-400 text-red-900"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    End WorkDay
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Current Session Info */}
          {(workStatus === "working" || workStatus === "paused") && currentSession && (
            <div className="flex justify-center">
              <div className="bg-muted/50 rounded-lg p-4 min-w-[300px] text-center space-y-2">
                <div className="text-sm text-muted-foreground">
                  Started at {format(currentSession.startTime, "HH:mm")}
                </div>
                <div className="text-lg font-semibold">
                  Current Duration: {formatDuration(calculateTotalLoggedTime(currentSession))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Status: {workStatus === "working" ? "🟢 Working" : "⏸️ Paused"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Mode: {currentSession.mode} {currentSession.location && `(${currentSession.location})`}
                </div>
              </div>
            </div>
          )}

          {/* Work Day Summary */}
          {workStatus === "stopped" && currentSession && (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center space-y-3">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                  Work Day Completed! 🎉
                </h3>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  Total Logged Time Duration: {formatDuration(currentSession.totalDuration)}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  on {format(currentSession.startTime, "dd/MM/yy")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(currentSession.startTime, "HH:mm")} - {currentSession.endTime && format(currentSession.endTime, "HH:mm")}
                  {currentSession.location && ` | ${currentSession.location}`}
                </div>
                {currentSession.pausedDurations.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {currentSession.pausedDurations.length} pause(s) taken
                  </div>
                )}
              </div>

              <Button
                onClick={restartWorkDay}
                size="lg"
                className="w-48 h-12 text-base font-medium bg-amber-500 hover:bg-amber-600 text-white"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Restart WorkDay
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* WorkDay Log History */}
      <Card>
        <CardHeader>
          <CardTitle>WorkDay Log</CardTitle>
        </CardHeader>
        <CardContent>
          {workHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No work sessions yet. Complete a work day to see your log history.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Pauses</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workHistory.slice(0, 5).map((session, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {format(session.startTime, "dd/MM/yy")}
                      </TableCell>
                      <TableCell>{format(session.startTime, "HH:mm")}</TableCell>
                      <TableCell>
                        {session.endTime ? format(session.endTime, "HH:mm") : "—"}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatDuration(session.totalDuration)}
                      </TableCell>
                      <TableCell>
                        <span className={session.mode === "Online" ? "text-green-600" : "text-blue-600"}>
                          {session.mode}
                        </span>
                      </TableCell>
                      <TableCell>{session.location || "—"}</TableCell>
                      <TableCell>
                        {session.pausedDurations.length > 0 ? (
                          <span className="text-amber-600">
                            {session.pausedDurations.length}
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
