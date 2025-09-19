import { Tractor, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-galician-blue rounded-xl p-2">
                <Tractor className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">FincAirbnb</h3>
                <p className="text-sm text-gray-400">Farming como un pro</p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 max-w-md">
              A primeira plataforma de Galicia para alugar fincas por meses. 
              Porque a vida é máis que código e reunions de Zoom.
            </p>
            
            <div className="text-sm text-gray-500">
              <p>© 2025 FincAirbnb Galicia S.L.</p>
              <p>Rexistrada no Rexistro Mercantil de Santiago</p>
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces rápidos</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Como funciona</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fincas dispoñibles</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guía do labrego</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Comunidade</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hola@fincairbnb.gal</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+34 981 XXX XXX</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Santiago de Compostela</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos e Condicións</a>
            <a href="#" className="hover:text-white transition-colors">Aviso Legal</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
          
          <div className="text-sm text-gray-500">
            Feito con ❤️ en Galicia (e moito café)
          </div>
        </div>

        {/* Disclaimer divertido */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            * Non nos facemos responsables de adicción ao rural lifestyle, 
            aumento descontrolado de selfies con animais, nin de conversas sobre o tempo que duren máis de 2 horas. 
            As colleitas poden variar segundo a paciencia de cada un coa natureza.
          </p>
        </div>
      </div>
    </footer>
  );
}