import Link from 'next/link';

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de cookies</h1>
        <p className="text-gray-700 leading-7 mb-4">
          Empregamos cookies técnicas para o funcionamento da plataforma e cookies analíticas para mellorar
          a experiencia de navegación.
        </p>
        <p className="text-gray-700 leading-7 mb-8">
          Podes configurar as túas preferencias de cookies no teu navegador en calquera momento.
        </p>
        <Link href="/" className="text-galician-blue hover:underline">
          Volver ao inicio
        </Link>
      </div>
    </main>
  );
}
