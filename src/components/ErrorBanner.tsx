interface ErrorBannerProps {
  error: string;
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  return (
    <div className="w-full flex items-center border rounded-xl border-border-alpha-error bg-background-error p-2 gap-2">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.755 16.546H11.255L11.245 15.046H12.755V16.546ZM11.245 13.373H12.745V7.454H11.245V13.373ZM12 2.25C6.624 2.25 2.25 6.624 2.25 12C2.25 17.376 6.624 21.75 12 21.75C17.376 21.75 21.75 17.376 21.75 12C21.75 6.624 17.376 2.25 12 2.25Z"
          fill="#EA4343"
          fillOpacity="0.6"
        />
      </svg>
      <p className="text-text-primary text-[12px]">{error}</p>
    </div>
  );
}
