export function LoadingSpinner({ size = "default", className = "" }: { 
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-8 w-8",
    xl: "h-32 w-32"
  };
  
  return (
    <div className={`animate-spin rounded-full border-b-2 border-foreground ${sizeClasses[size]} ${className}`}></div>
  );
}

export function LoadingPage({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="xl" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}