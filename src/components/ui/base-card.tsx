import { cn } from '@/lib/utils';
import React from 'react';
import TrafficLightGlow from './TrafficLightGlow';

const BaseCard = ({
  className,
  gradientBorder,
  topGlow,
  bottomGlow,
  children,
}: {
  className?: string;
  gradientBorder?: boolean;
  topGlow?: boolean;
  bottomGlow?: boolean;
  children?: React.ReactNode | React.ReactNode[];
}) => {
  return (
    <div
      className={cn(
        'relative w-full rounded-2xl p-[1px] box-border h-fit',
        gradientBorder
          ? 'bg-gradient-to-l from-white/0 via-white/30 to-white/0'
          : 'bg-border-alpha-light',
        className
      )}
    >
      <div className="relative z-10 w-full h-full bg-background-secondary rounded-2xl">
        {children}
      </div>

      {topGlow && <TrafficLightGlow isTop />}
      {bottomGlow && <TrafficLightGlow />}
    </div>
  );
};

export default BaseCard;
