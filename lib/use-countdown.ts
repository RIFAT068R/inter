"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useCountdown({ duration, onComplete }: { duration: number; onComplete: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completionRef = useRef(onComplete);

  useEffect(() => {
    completionRef.current = onComplete;
  }, [onComplete]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    (nextDuration: number) => {
      clearTimer();
      setSecondsLeft(nextDuration);

      intervalRef.current = setInterval(() => {
        setSecondsLeft((current) => {
          if (current <= 1) {
            clearTimer();
            completionRef.current();
            return 0;
          }

          return current - 1;
        });
      }, 1000);
    },
    [clearTimer],
  );

  useEffect(() => {
    start(duration);
    return clearTimer;
  }, [clearTimer, duration, start]);

  return {
    secondsLeft,
    reset: start,
  };
}
