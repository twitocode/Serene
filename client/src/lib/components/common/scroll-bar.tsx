interface Props {
  duration?: string;
  className?: string;
}

export function ScrollBar({ children, duration = "15s", className = "" }: React.PropsWithChildren<Props>) {
  return (
    <div
      className={`w-full overflow-hidden bg-gray-800 py-6 mb-4 ${className}  overflow-y-visible`}
    >
      <div
        className="inline-block whitespace-nowrap pl-[100%] animate-scroll"
        style={{ "--duration": duration } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}