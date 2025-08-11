"use client";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`loading loading-spinner ${sizeClasses[size]} text-primary mb-4`}></div>
      {message && (
        <p className="text-base-content/60 text-center">{message}</p>
      )}
    </div>
  );
}

// Composant de chargement pleine page
export function FullPageLoader({ message = "Chargement..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">
          CV<span className="text-secondary">Générateur</span>
        </h1>
        <LoadingSpinner size="lg" message={message} />
      </div>
    </div>
  );
}
