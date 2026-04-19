import Link from 'next/link';

export default function AvisoLegalPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Aviso legal</h1>
        <p className="text-gray-700 leading-7 mb-4">
          FincAirbnb Galicia S.L. é a titular deste sitio web e presta servizos dixitais de intermediación
          para aluguer temporal de fincas.
        </p>
        <p className="text-gray-700 leading-7 mb-8">
          O acceso e uso deste sitio está suxeito á normativa vixente e ás condicións de uso publicadas
          nesta web.
        </p>
        <Link href="/" className="text-galician-blue hover:underline">
          Volver ao inicio
        </Link>
      </div>
    </main>
  );
}
