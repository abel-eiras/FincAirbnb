import Link from 'next/link';

export default function PoliticaPrivacidadePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Politica de privacidade</h1>
        <p className="text-gray-700 leading-7 mb-4">
          En FincAirbnb tratamos os teus datos para xestionar a túa conta, as reservas e a comunicación
          entre usuarios. Non compartimos información persoal con terceiros fóra dos casos necesarios para
          prestar o servizo e cumprir obrigas legais.
        </p>
        <p className="text-gray-700 leading-7 mb-8">
          Para exercer dereitos de acceso, rectificación, cancelación ou oposición, contacta con
          <span className="font-medium"> hola@fincairbnb.gal</span>.
        </p>
        <Link href="/" className="text-galician-blue hover:underline">
          Volver ao inicio
        </Link>
      </div>
    </main>
  );
}
