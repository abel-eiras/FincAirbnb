import Link from 'next/link';

export default function TermosCondicionsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Termos e condicións</h1>
        <p className="text-gray-700 leading-7 mb-4">
          O uso da plataforma implica aceptar as condicións de contratación, normas de convivencia entre
          propietarios e labregos, e as políticas de cancelación vixentes.
        </p>
        <p className="text-gray-700 leading-7 mb-8">
          As reservas e pagamentos están suxeitos á verificación de dispoñibilidade e ás condicións
          particulares de cada finca.
        </p>
        <Link href="/" className="text-galician-blue hover:underline">
          Volver ao inicio
        </Link>
      </div>
    </main>
  );
}
