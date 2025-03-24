import { cn } from '@/lib/utils';

const TrafficLightGlow = ({ isTop = false }: { isTop?: boolean }) => {
  return (
    <div
      className={cn(
        'absolute z-0 w-full flex justify-center',
        isTop ? 'top-[40px]' : 'bottom-[40px]'
      )}
    >
      <div className="flex items-center w-[90%] h-[21px] blur-2xl">
        <div className="relative flex flex-1 bg-[#70B015] h-full"></div>
        <div className="relative flex flex-1 bg-[#E67F22] h-full"></div>
        <div className="relative flex flex-1 bg-[#E94141] h-full"></div>
      </div>
    </div>
  );
};

export default TrafficLightGlow;
