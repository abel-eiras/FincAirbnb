import Link from 'next/link';

export default function FavoritasPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Fincas favoritas</h1>
        <p className="text-gray-700 mb-8">
          Esta sección centraliza as fincas que gardaches como favoritas para revisalas máis tarde.
        </p>
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 mb-4">
            Podes seguir xestionándoas desde o panel principal mentres completamos esta vista dedicada.
          </p>
          <Link href="/taboleiro" className="text-galician-blue hover:underline">
            Volver ao taboleiro
          </Link>
        </div>
      </div>
    </main>
  );
}
