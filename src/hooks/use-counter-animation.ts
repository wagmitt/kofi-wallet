import { useState, useEffect } from 'react';

export const useCounterAnimation = (targetValue: number, duration: number = 200) => {
  const [currentValue, setCurrentValue] = useState(0);
  const stepInterval = 200; // Update every 200ms (5 times per second)

  useEffect(() => {
    if (targetValue === currentValue) return;

    const steps = duration / stepInterval;
    const increment = (targetValue - currentValue) / steps;

    const timer = setInterval(() => {
      setCurrentValue(current => {
        const nextValue = current + increment;
        if (increment > 0 && nextValue >= targetValue) {
          clearInterval(timer);
          return targetValue;
        }
        if (increment < 0 && nextValue <= targetValue) {
          clearInterval(timer);
          return targetValue;
        }
        return nextValue;
      });
    }, stepInterval);

    return () => clearInterval(timer);
  }, [targetValue, duration]);

  return currentValue;
};
