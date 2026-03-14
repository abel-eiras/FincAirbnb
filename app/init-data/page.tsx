'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function InitDataPage() {
  const [isInitialized, setIsInitialized] = useState(false);

  const alugamentosData = [
    {
      "id": "alugamento-1760286331128",
      "propertyId": "prop-2",
      "propertyTitle": "Pazo de Salnés",
      "startDate": "2024-10-13",
      "endDate": "2024-04-13",
      "duration": 6,
      "people": 1,
      "cultivoType": "flores",
      "specialRequests": "Polo sitio",
      "pricing": {
        "basePrice": 450,
        "duration": 6,
        "subtotal": 2700,
        "serviceFee": 135,
        "total": 2835
      },
      "labregoData": {
        "name": "María Fernández",
        "email": "maria@correo.gal",
        "phone": "+34 611 222 333",
        "experience": "intermedio",
        "motivation": "Quero aprender máis sobre agricultura ecolóxica",
        "references": "Cultivei verduras nunha finca en Santiago o ano pasado"
      },
      "status": "accepted",
      "createdAt": "2024-10-12T10:00:00Z"
    },
    {
      "id": "alug-8",
      "propertyId": "prop-1",
      "propertyTitle": "Finca orgánica en Ponteareas",
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "duration": 12,
      "people": 2,
      "cultivoType": "hortalizas",
      "specialRequests": "Quero cultivar tomates, pementos e alfaces. É a miña segunda tempada nesta finca.",
      "pricing": {
        "basePrice": 120,
        "duration": 12,
        "subtotal": 1440,
        "serviceFee": 144,
        "total": 1584
      },
      "labregoData": {
        "name": "María Fernández",
        "email": "maria@correo.gal",
        "phone": "+34 611 222 333",
        "experience": "intermedio",
        "motivation": "Quero aprender máis sobre agricultura ecolóxica e cultivar os meus propios alimentos de forma sostible.",
        "references": "Cultivei verduras nunha finca en Santiago o ano pasado con excelentes resultados."
      },
      "status": "completed",
      "createdAt": "2023-12-15T09:30:00Z"
    }
  ];

  useEffect(() => {
    // Verificar si ya están inicializados
    const existing = localStorage.getItem('alugamentos');
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        const hasCompleted = parsed.some((a: any) => a.status === 'completed');
        setIsInitialized(hasCompleted);
      } catch (e) {
        setIsInitialized(false);
      }
    }
  }, []);

  const initializeData = () => {
    localStorage.setItem('alugamentos', JSON.stringify(alugamentosData));
    setIsInitialized(true);
    alert('✅ Datos inicializados correctamente!\n\nAhora puedes ir a "Os Meus Alugamentos" y filtrar por "Completado" para ver el alugamento alug-8.');
  };

  const clearData = () => {
    localStorage.removeItem('alugamentos');
    setIsInitialized(false);
    alert('🗑️ Datos eliminados de localStorage');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-galician-blue flex items-center">
              {isInitialized ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  Datos Mock Inicializados
                </>
              ) : (
                <>
                  <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
                  Inicializar Datos Mock
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🎯 Objetivo</h3>
              <p className="text-blue-700">
                Esta página inicializa los datos mock necesarios para probar el sistema de valoraciones.
                Se creará un alugamento con estado &quot;completed&quot; para el usuario María (maria@correo.gal).
              </p>
            </div>

            {isInitialized ? (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">✅ Estado Actual</h3>
                <p className="text-green-700 mb-4">
                  Los datos ya están inicializados en localStorage. Puedes proceder a probar el sistema.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-green-600">
                    <strong>Alugamento completado creado:</strong>
                  </p>
                  <ul className="text-sm text-green-600 ml-4 space-y-1">
                    <li>• ID: alug-8</li>
                    <li>• Propiedad: Finca orgánica en Ponteareas</li>
                    <li>• Usuario: María Fernández (maria@correo.gal)</li>
                    <li>• Estado: completed</li>
                    <li>• Duración: 12 meses (enero-diciembre 2024)</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Acción Requerida</h3>
                <p className="text-yellow-700">
                  Los datos mock no están inicializados. Haz click en el botón para crear el alugamento de prueba.
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <Button 
                onClick={initializeData}
                className="bg-galician-blue hover:bg-blue-700"
                disabled={isInitialized}
              >
                {isInitialized ? '✅ Ya Inicializado' : '🚀 Inicializar Datos Mock'}
              </Button>
              
              <Button 
                onClick={clearData}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                🗑️ Limpiar Datos
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">📋 Próximos Pasos</h3>
              <ol className="text-sm text-gray-700 space-y-1 ml-4">
                <li>1. Haz click en &quot;Inicializar Datos Mock&quot;</li>
                <li>2. Ve a <code className="bg-gray-200 px-1 rounded">/taboleiro/mos-alugamentos</code></li>
                <li>3. Filtra por estado &quot;Completado&quot;</li>
                <li>4. Busca el alugamento &quot;Finca orgánica en Ponteareas&quot;</li>
                <li>5. Haz click en &quot;Valorar Finca&quot;</li>
                <li>6. Completa el formulario de valoración</li>
              </ol>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">🔗 Enlaces Útiles</h3>
              <div className="space-y-2">
                <a 
                  href="/taboleiro/mos-alugamentos" 
                  className="block text-purple-600 hover:text-purple-800 underline"
                >
                  → Os Meus Alugamentos
                </a>
                <a 
                  href="/acceder" 
                  className="block text-purple-600 hover:text-purple-800 underline"
                >
                  → Iniciar Sesión (maria@correo.gal)
                </a>
                <a 
                  href="/fincas/prop-1" 
                  className="block text-purple-600 hover:text-purple-800 underline"
                >
                  → Ver Propiedad (para ver reviews)
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}







