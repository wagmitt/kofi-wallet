'use client';

import { useEffect, useRef, useMemo, useState } from 'react';

export type WheelSection = {
  points: number;
  percentage: number;
  color: string;
  label: string;
  text: string;
};

interface LotteryWheelProps {
  sections: WheelSection[];
  onSpinComplete: (result: WheelSection) => void;
  isSpinning: boolean;
  onSpinStart: () => void;
  winningAmount: string | null;
}

export default function LotteryWheel({
  sections,
  onSpinComplete,
  isSpinning,
  onSpinStart,
  winningAmount,
}: LotteryWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isSlowing, setIsSlowing] = useState(false);
  const rotationRef = useRef(0); // Use ref instead of state for rotation
  const startTimeRef = useRef<number | null>(null);
  const speedRef = useRef(360); // degrees per second
  const targetRotationRef = useRef<number | null>(null);

  // Calculate rotation angles for each section with useMemo to prevent recalculations
  const sectionsWithAngles = useMemo(() => {
    console.log('Calculating section angles with sections:', sections);
    if (!sections || sections.length === 0) {
      console.warn('No sections provided to LotteryWheel');
      return [];
    }

    let startAngle = 0;
    return sections.map(section => {
      const angle = (section.percentage / 100) * 360;
      const sectionData = {
        ...section,
        startAngle,
        endAngle: startAngle + angle,
        midAngle: startAngle + angle / 2,
      };
      startAngle += angle;
      return sectionData;
    });
  }, [sections]);

  // Handle spin button click
  const handleSpin = () => {
    console.log('handleSpin called, isSpinning:', isSpinning);
    if (!isSpinning) {
      onSpinStart();
    }
  };

  // Handle winning amount changes - start the slowing down sequence
  useEffect(() => {
    const startSlowingDown = (targetRotation: number) => {
      console.log('Starting slowing down sequence to', targetRotation);

      // Don't cancel the animation immediately
      const totalAnimationTime = 8000; // 8 seconds for smooth deceleration
      const startTime = performance.now();
      const startRotation = rotationRef.current;
      const startSpeed = Math.max(speedRef.current, 360); // Ensure minimum speed before slowing
      const rotationDifference = targetRotation - startRotation;

      // Enhanced easing function for smoother deceleration
      const easeOutQuart = (t: number) => {
        const t1 = t - 1;
        return 1 - t1 * t1 * t1 * t1;
      };

      const animate = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / totalAnimationTime, 1);
        const easedProgress = easeOutQuart(progress);

        // Gradually reduce speed with a minimum threshold
        speedRef.current = Math.max(startSpeed * (1 - easedProgress), 10);

        // Calculate new rotation with enhanced easing
        rotationRef.current = startRotation + rotationDifference * easedProgress;

        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          console.log('Slowing down complete, final rotation:', rotationRef.current);
          setIsSlowing(false);
          speedRef.current = 0;

          if (winningAmount) {
            const winningSection = sections.find(
              section => Math.abs(parseFloat(section.label) - parseFloat(winningAmount)) < 0.0001
            );
            if (winningSection) {
              onSpinComplete(winningSection);
            }
          }
        }
      };

      // Start the slowing down animation in the next frame
      requestAnimationFrame(() => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        animationRef.current = requestAnimationFrame(animate);
      });
    };

    if (winningAmount !== null && wheelRef.current && isSpinning) {
      console.log('🚀 | useEffect | winningAmount:', winningAmount);
      console.log('🚀 | useEffect | sections:', sections);
      console.log('Winning amount received, planning stop sequence:', winningAmount);

      // Find the winning section based on the amount
      const winningSection = sections.find(
        section => Math.abs(parseFloat(section.label) - parseFloat(winningAmount)) < 0.0001
      );

      if (winningSection) {
        console.log('🚀 | useEffect | winningSection:', winningSection);
        console.log('Found winning section:', winningSection);
        setIsSlowing(true);

        // Calculate final position
        const sectionIndex = sections.indexOf(winningSection);
        const targetAngle = sectionsWithAngles[sectionIndex].midAngle;
        console.log('Target section angle:', targetAngle);

        // Calculate how many full rotations to add for a nice effect
        const currentFullRotations = Math.floor(Math.abs(rotationRef.current) / 360);
        const additionalRotations = Math.max(5, currentFullRotations + 3); // Ensure at least 5 full rotations

        // Calculate the final rotation with added buffer
        const targetRotation = -(additionalRotations * 360 + ((targetAngle - 270 + 360) % 360));
        targetRotationRef.current = targetRotation;

        // Remove the delay and start slowing down immediately
        startSlowingDown(targetRotation);
      } else {
        console.warn('No matching section found for winning amount:', winningAmount);
      }
    }
  }, [winningAmount, sections, sectionsWithAngles, isSpinning, onSpinComplete]);

  // Start or stop spinning animation based on isSpinning prop
  useEffect(() => {
    // Start spinning animation
    const startSpinning = () => {
      console.log('Starting spinning animation');
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      startTimeRef.current = performance.now();
      speedRef.current = 360; // Reset to full speed
      targetRotationRef.current = null; // Clear any previous target

      const animate = (time: number) => {
        if (!startTimeRef.current) startTimeRef.current = time;
        const elapsed = time - startTimeRef.current;
        startTimeRef.current = time;

        // Calculate new rotation based on current speed
        rotationRef.current = rotationRef.current - (speedRef.current * elapsed) / 1000;

        // Apply rotation to the wheel
        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
        }

        // Continue animation if still spinning
        if (isSpinning && !isSlowing) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };
    console.log('isSpinning changed:', isSpinning);
    if (isSpinning && !isSlowing) {
      // Start spinning animation
      startSpinning();
    } else if (!isSpinning) {
      // Stop spinning animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      // Cleanup
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isSpinning, isSlowing]);

  return (
    <div className="relative w-full max-w-[400px] aspect-square mx-auto">
      {/* Background glow effect */}
      <div className="absolute inset-[-10%] rounded-full bg-[#8DC63F]/20 blur-xl z-0"></div>

      {/* Wheel container with 3D effect */}
      <div className="absolute inset-0 rounded-full bg-[#1a2b1a] shadow-[0_0_30px_rgba(141,198,63,0.5)] z-0"></div>

      {/* Inner shadow overlay for depth */}
      <div
        className="absolute inset-[2%] rounded-full z-30 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 40px 10px rgba(0,0,0,0.6), inset 0 0 15px 2px rgba(0,0,0,0.4)',
        }}
      ></div>

      {/* Outer rim */}
      <div className="absolute inset-0 rounded-full border-[12px] border-[#222] z-10 overflow-hidden">
        <div className="absolute inset-0 rounded-full border-[2px] border-[#444] opacity-70"></div>
      </div>

      {/* Light bulbs around the wheel */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i * 18 * Math.PI) / 180;
        const x = 50 + 49 * Math.cos(angle);
        const y = 50 + 49 * Math.sin(angle);

        return (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-[#d9f2b4] z-40"
            style={{
              left: `calc(${x}% - 6px)`,
              top: `calc(${y}% - 6px)`,
              boxShadow: '0 0 10px 2px rgba(141,198,63,0.8)',
              animation: `pulse 1.5s infinite ${i * 0.1}s`,
            }}
          />
        );
      })}

      {/* Inner wheel */}
      <div
        ref={wheelRef}
        className="absolute inset-[5%] rounded-full transform overflow-visible z-20"
        style={{
          transformOrigin: 'center',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
            </filter>
            <filter id="circleShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" in="SourceAlpha" result="blur" />
              <feOffset dx="0" dy="1" in="blur" result="offsetBlur" />
              <feFlood floodColor="#000" floodOpacity="0.4" result="shadowColor" />
              <feComposite in="shadowColor" in2="offsetBlur" operator="in" result="shadowBlur" />
              <feComposite in="SourceGraphic" in2="shadowBlur" operator="over" />
            </filter>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8DC63F" />
              <stop offset="50%" stopColor="#7ab62f" />
              <stop offset="100%" stopColor="#69a41f" />
            </linearGradient>
            <linearGradient id="whiteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f5f5f5" />
              <stop offset="100%" stopColor="#eeeeee" />
            </linearGradient>
            <filter id="innerShadow">
              <feOffset dx="0" dy="0" />
              <feGaussianBlur stdDeviation="1.5" result="offset-blur" />
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
              <feFlood floodColor="black" floodOpacity="0.6" result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>
          </defs>

          {/* Sections */}
          {sectionsWithAngles.map((section, index) => {
            const startAngle = section.startAngle;
            const endAngle = section.endAngle;

            // Calculate the SVG arc path
            const startRadians = (startAngle * Math.PI) / 180;
            const endRadians = (endAngle * Math.PI) / 180;

            const x1 = 50 + 50 * Math.cos(startRadians);
            const y1 = 50 + 50 * Math.sin(startRadians);

            const x2 = 50 + 50 * Math.cos(endRadians);
            const y2 = 50 + 50 * Math.sin(endRadians);

            const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

            // Path from center to arc edge and back to center
            const d = `
              M 50 50
              L ${x1} ${y1}
              A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}
              Z
            `;

            // Calculate text position
            const midAngle = (startAngle + endAngle) / 2;
            const midRadians = (midAngle * Math.PI) / 180;
            const textDistance = 30; // Distance from center
            const textX = 50 + textDistance * Math.cos(midRadians);
            const textY = 50 + textDistance * Math.sin(midRadians);

            // Alternate between green and white
            const fillColor = index % 2 === 0 ? 'url(#greenGradient)' : 'url(#whiteGradient)';

            // Text color based on section background
            const textColor = index % 2 === 0 ? 'white' : '#333';

            return (
              <g key={index}>
                {/* Section */}
                <path
                  d={d}
                  fill={fillColor}
                  stroke="#444"
                  strokeWidth="0.5"
                  filter="url(#innerShadow)"
                />

                {/* Label */}
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={textColor}
                  fontWeight="bold"
                  fontSize="6"
                  transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                  style={{
                    textShadow: index % 2 === 0 ? '0px 0px 2px rgba(0,0,0,0.8)' : 'none',
                  }}
                >
                  {section.text}
                </text>
              </g>
            );
          })}

          {/* Center circle */}
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="url(#greenGradient)"
            stroke="#222"
            strokeWidth="0.5"
            filter="url(#circleShadow)"
          />
          <circle cx="50" cy="50" r="5" fill="#8DC63F" stroke="#69a41f" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[50%] z-40">
        <div className="relative">
          <svg width="40" height="50" viewBox="0 0 40 50">
            <polygon
              points="20,50 40,20 20,30 0,20"
              fill="#f5f5f5"
              filter="url(#circleShadow)"
              stroke="#222"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>

      {/* Spin button overlay - invisible but clickable */}
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="absolute inset-0 w-full h-full rounded-full bg-transparent cursor-pointer focus:outline-none z-50"
        aria-label="Spin the wheel"
      />

      <style>
        {`
        @keyframes pulse {
          0% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.4;
          }
        }
        `}
      </style>
    </div>
  );
}
