'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-red-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Erreur critique !
              </h2>
              <p className="text-gray-600 mb-6">
                Une erreur inattendue s&apos;est produite.
              </p>
              <button
                onClick={reset}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
