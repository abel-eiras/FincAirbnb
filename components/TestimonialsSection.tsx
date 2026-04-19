import { Star, Quote } from 'lucide-react';
import Link from 'next/link';

const testemuños = [
  {
    nome: 'Manolo de Ponteareas',
    ocupacion: 'Ex-programador, agora tomateiro profesional',
    foto: '👨‍💻',
    testimonio: 'Desde que planto tomates, xa non lle discuto á miña sogra. Agora só discuto cos caracois.',
    valoracion: 5,
    colleita: '47kg de tomates'
  },
  {
    nome: 'Carmiña da Coruña',
    ocupacion: 'Influencer de Instagram convertida a influencer de grelos',
    foto: '💃',
    testimonio: 'As miñas stories de antes e despois das leitugas teñen máis likes que os meus selfies. Quen o ía dicir!',
    valoracion: 5,
    colleita: '200 cabezas de leituga'
  },
  {
    nome: 'Pepe o Xornalista',
    ocupacion: 'Escribía de política, agora escribe sobre o tempo na horta',
    foto: '📝',
    testimonio: 'Cambiei os escándalos por espantallas. Menos estrés e máis vitaminados que nunca.',
    valoracion: 5,
    colleita: '12kg de pementos'
  },
  {
    nome: 'Rosa de Vigo',
    ocupacion: 'Contable que agora conta zanahorias',
    foto: '🧮',
    testimonio: 'Os meus Excel agora son de colleitas. E curiosamente, sempre me cadran os números!',
    valoracion: 5,
    colleita: '89 zanahorias perfectas'
  }
];

export function TestimonialsSection() {
  return (
    <section id="testemuños" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            O que din os nosos{' '}
            <span className="text-galician-green">labregos influencers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Testimonios reais* de xente que deixou a cidade para converterse 
            en auténticos farmers con stories épicas.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            *Bueno, case reais. Pero o sentimento é xenuíno.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {testemuños.map((testimonio, index) => (
            <div 
              key={index}
              className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Quote icon */}
              <Quote className="h-8 w-8 text-galician-blue mb-6 opacity-50" />
              
              {/* Testimonial text */}
              <blockquote className="text-lg text-gray-700 mb-8 italic leading-relaxed">
                &quot;{testimonio.testimonio}&quot;
              </blockquote>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonio.valoracion)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Author info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl bg-white p-2 rounded-full">
                    {testimonio.foto}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonio.nome}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonio.ocupacion}
                    </div>
                  </div>
                </div>
                
                {/* Achievement badge */}
                <div className="bg-galician-green text-white px-3 py-1 rounded-full text-sm font-medium">
                  {testimonio.colleita}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Box */}
        <div className="bg-gradient-to-r from-galician-blue to-blue-600 p-8 rounded-2xl text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            🌟 Queres ser o seguinte testimonio?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Únete á comunidade de labregos máis cool de Galicia. 
            Stories de colleita garantidas.
          </p>
          <Link
            href="/fincas"
            className="inline-flex items-center justify-center bg-white text-galician-blue px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Empezar a miña aventura rural
          </Link>
        </div>
      </div>
    </section>
  );
}