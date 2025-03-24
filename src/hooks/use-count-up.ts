import { useState, useEffect } from 'react';

interface UseInfiniteCountUpProps {
  startValue: number;
  increment: number;
  interval: number;
  decimals?: number;
  maxValue?: number;
}

export const useCountUp = ({
  startValue,
  increment,
  interval,
  decimals = 2,
  maxValue = Number.MAX_SAFE_INTEGER,
}: UseInfiniteCountUpProps) => {
  const [currentValue, setCurrentValue] = useState(startValue);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentValue(current => {
        const nextValue = current + increment;
        if (nextValue >= maxValue) {
          return startValue; // Reset to start value when reaching max
        }
        return Number(nextValue.toFixed(decimals));
      });
    }, interval);

    return () => clearInterval(timer);
  }, [startValue, increment, interval, decimals, maxValue]);

  return currentValue;
};
