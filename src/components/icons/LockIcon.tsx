import { cn } from '@/lib/utils';

interface LockIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function LockIcon({ className, ...props }: LockIconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('', className)}
      {...props}
    >
      <path
        d="M13.5 6H15C15.4142 6 15.75 6.33579 15.75 6.75V15.75C15.75 16.1642 15.4142 16.5 15 16.5H3C2.58579 16.5 2.25 16.1642 2.25 15.75V6.75C2.25 6.33579 2.58579 6 3 6H4.5V5.25C4.5 2.76472 6.51472 0.75 9 0.75C11.4853 0.75 13.5 2.76472 13.5 5.25V6ZM12 6V5.25C12 3.59314 10.6568 2.25 9 2.25C7.34314 2.25 6 3.59314 6 5.25V6H12ZM8.25 10.5V12H9.75V10.5H8.25ZM5.25 10.5V12H6.75V10.5H5.25ZM11.25 10.5V12H12.75V10.5H11.25Z"
        fill="currentColor"
        fillOpacity="0.64"
      />
    </svg>
  );
}
