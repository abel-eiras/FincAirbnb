import Link from 'next/link';

export default function AvaliacionsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Avaliacións pendentes</h1>
        <p className="text-gray-700 mb-8">
          Aquí atoparás o histórico de fincas por avaliar e o estado das túas valoracións.
        </p>
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 mb-4">
            Mentres finalizamos esta pantalla, podes avaliar directamente cada alugamento desde o taboleiro.
          </p>
          <Link href="/taboleiro" className="text-galician-blue hover:underline">
            Volver ao taboleiro
          </Link>
        </div>
      </div>
    </main>
  );
}
