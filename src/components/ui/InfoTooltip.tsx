import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

const InfoTooltip = ({ text }: { text: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info
          fill="rgba(255, 255, 255, 0.4)"
          stroke="hsla(0, 0%, 7%, 1)"
          className="h-5 w-5 text-icon-secondary"
        />
      </TooltipTrigger>
      <TooltipContent className="relative border-background-light border bg-background-tooltip rounded-lg py-[10px] px-3 max-w-[300px]">
        <p className="text-text-secondary text-sm">{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default InfoTooltip;
