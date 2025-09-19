import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Background pattern - Simple geometric shapes representing fields */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-20 bg-galician-green rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-20 w-40 h-24 bg-galician-blue rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-shell-beige rounded-full blur-lg"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center bg-shell-beige text-galician-green px-4 py-2 rounded-full text-sm font-medium">
              <Users className="h-4 w-4 mr-2" />
              Xa máis de 1.000 labregos influencers
            </div>

            {/* Main Headline - TODO: Revisar copy para máis impacto */}
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Queres sentirte{' '}
              <span className="text-galician-blue">labrego</span>{' '}
              sen saír de{' '}
              <span className="text-pink-500">Instagram</span>?
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl">
              Aluga unha finca e planta o que che dea a gana. É como un FarmVille real, 
              pero con colleitas que podes comer e un moreno de calva e antebrazos incluído.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold text-galician-blue">500+</div>
                <div className="text-sm text-gray-600">Fincas dispoñibles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-galician-green">2.5k</div>
                <div className="text-sm text-gray-600">Kg de tomates colleitos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">98%</div>
                <div className="text-sm text-gray-600">Morenos conseguidos</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-galician-blue hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl group"
              >
                Proba agora, que as patacas non se plantan soas
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-galician-green text-galician-green hover:bg-galician-green hover:text-white px-8 py-4 text-lg rounded-xl"
              >
                Ver fincas dispoñibles
              </Button>
            </div>

            {/* Search preview - FIXME: Esto podería ser máis interactivo */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border max-w-2xl mx-auto lg:mx-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-galician-blue" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Onde</div>
                    <div className="text-sm text-gray-500">Ponteareas, A Coruña...</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-galician-blue" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Cando</div>
                    <div className="text-sm text-gray-500">Marzo - Outubro</div>
                  </div>
                </div>
                <Button className="bg-galician-blue hover:bg-blue-700">
                  Buscar fincas
                </Button>
              </div>
            </div>
          </div>

          {/* Visual - Simple illustration placeholder */}
          <div className="relative">
            <div className="bg-gradient-to-br from-galician-green to-green-600 rounded-3xl p-12 text-white text-center">
              {/* TODO: Substituír por ilustración real de finca galega */}
              <div className="space-y-6">
                <div className="text-6xl">🚜</div>
                <div className="text-4xl">🥕</div>
                <div className="grid grid-cols-3 gap-4 text-3xl">
                  <div>🌱</div>
                  <div>🐄</div>
                  <div>🌿</div>
                </div>
                <p className="text-lg opacity-90">
                  "Da cidade ao campo<br />nun click"
                </p>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 p-3 rounded-full text-sm font-bold animate-bounce">
              ☀️ Sol incluído*
            </div>
            <div className="absolute -bottom-4 -left-4 bg-shell-beige text-galician-green p-3 rounded-full text-sm font-bold">
              🥾 Botas non incluídas
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}