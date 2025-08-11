'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-base-100 p-8 rounded-lg shadow-xl max-w-md">
          <h2 className="text-2xl font-bold text-error mb-4">
            Une erreur s&apos;est produite !
          </h2>
          <p className="text-base-content/70 mb-6">
            Quelque chose s&apos;est mal passé. Veuillez réessayer.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={reset}
              className="btn btn-primary"
            >
              Réessayer
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="btn btn-ghost"
            >
              Retour à l&apos;accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
