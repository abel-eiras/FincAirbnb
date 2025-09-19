import { Smile, Sun, Activity, Heart } from 'lucide-react';

const beneficios = [
  {
    icon: '🥕',
    titulo: 'Comida real (non pixelada)',
    descripcion: 'Olvídate dos sprites de 8 bits. Aquí as zanahorias son laranxas de verdade e saben a terra.',
    color: 'bg-orange-100 text-orange-700'
  },
  {
    icon: '🌞',
    titulo: 'Bronceado de nuca garantido',
    descripcion: 'O moreno de labrego auténtico. Nuca tostada e antebrazos que dan envexa no bar.',
    color: 'bg-yellow-100 text-yellow-700'
  },
  {
    icon: '🌿',
    titulo: 'O mellor antiestrés: sachar herbas',
    descripcion: 'Olvídate das apps de meditación. Nada como sachar cardo para baleirar a mente.',
    color: 'bg-green-100 text-galician-green'
  },
  {
    icon: '💪',
    titulo: 'Ginasio ao aire libre',
    descripcion: 'Para que queres pesas se podes levar sacos de patacas? Músculos funcionais garantidos.',
    color: 'bg-blue-100 text-galician-blue'
  }
];

export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Por que escoller{' '}
            <span className="text-galician-blue">FincAirbnb</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Non é só alugar un terreo, é alugar unha experiencia. 
            E se non che gusta, sempre podes culpar ao tempo galego.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {beneficios.map((beneficio, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`inline-flex p-4 rounded-xl mb-6 ${beneficio.color} group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-3xl">{beneficio.icon}</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {beneficio.titulo}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {beneficio.descripcion}
              </p>
            </div>
          ))}
        </div>

        {/* Extra info box */}
        <div className="mt-16 bg-shell-beige p-8 rounded-2xl border-2 border-dashed border-galician-green">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-galician-green mb-4">
              🐄 Bonus extra: Contacto con animais
            </h3>
            <p className="text-galician-green text-lg">
              Moitas fincas inclúen veciños bovinos que non che van pedir wifi. 
              Ideal para desconectar... mentres eles te observan con curiosidade.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}