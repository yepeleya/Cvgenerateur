import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-base-100 p-8 rounded-lg shadow-xl max-w-md">
          <FileText className="w-24 h-24 mx-auto text-base-content/30 mb-6" />
          <h2 className="text-3xl font-bold text-primary mb-4">
            404
          </h2>
          <h3 className="text-xl font-semibold mb-2">
            Page introuvable
          </h3>
          <p className="text-base-content/70 mb-6">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="btn btn-primary">
              Retour à l&apos;accueil
            </Link>
            <Link href="/my-cvs" className="btn btn-ghost">
              Mes CV
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
