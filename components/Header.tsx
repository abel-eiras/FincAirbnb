import { Tractor } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-galician-blue rounded-xl p-2">
              <Tractor className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-galician-blue">FincAirbnb</h1>
              <p className="text-xs text-gray-500">Farming como un pro</p>
            </div>
          </div>

          {/* TODO: Engadir menú de navegación se fose necesario */}
          <nav className="hidden md:flex space-x-8">
            <a href="#beneficios" className="text-gray-700 hover:text-galician-blue transition-colors">
              Beneficios
            </a>
            <a href="#testemuños" className="text-gray-700 hover:text-galician-blue transition-colors">
              Testemuños
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}