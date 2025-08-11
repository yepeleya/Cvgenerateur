'use client';

export default function Loading() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
        <p className="text-base-content/60">Chargement...</p>
      </div>
    </div>
  );
}
