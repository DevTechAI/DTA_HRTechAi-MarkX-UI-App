'use client';

import { useEffect, useState } from "react";

export function DateTimeDisplay() {
  const [dateTime, setDateTime] = useState('');
  
  useEffect(() => {
    // Update time immediately
    updateTime();
    
    // Then update every second
    const interval = setInterval(updateTime, 1000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);
  
  const updateTime = () => {
    const now = new Date();
    const options = { weekday: 'short' } as Intl.DateTimeFormatOptions;
    const day = now.toLocaleDateString('en-US', options);
    const date = now.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const time = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    setDateTime(`${day}, ${date}, ${time}`);
  };
  
  return (
    <div className="text-sm text-muted-foreground font-mono">
      {dateTime}
    </div>
  );
}
