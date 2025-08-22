"use client";

import { useEffect, useState } from "react";

export function DateTimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    // Get day with ordinal suffix
    const day = date.getDate();
    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    // Get month abbreviation
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];

    // Get year
    const year = date.getFullYear();

    // Get time in 12-hour format
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format time with leading zeros for minutes and seconds
    const timeString = `${hours}.${minutes.toString().padStart(2, '0')}.${seconds.toString().padStart(2, '0')} ${ampm}`;

    // Combine all parts
    return `${day}${getOrdinalSuffix(day)}-${month}-${year} ${timeString} IST`;
  };

  return (
    <div className="text-sm text-muted-foreground font-mono">
      {formatDateTime(currentTime)}
    </div>
  );
}
