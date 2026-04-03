'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, CreditCard, Loader2, Shield } from 'lucide-react';
import { StripeProvider } from '@/components/payments/StripeProvider';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { createPaymentIntent } from '@/services/payments';
import { getAlugamentoById } from '@/services/mockAlugamentos';

export default function PagarAlugamentoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [propertyTitle, setPropertyTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);

        const alugamento = await getAlugamentoById(id);
        if (!alugamento) {
          router.push('/taboleiro/mos-alugamentos');
          return;
        }

        const alugamentoAny = alugamento as any;
        const importeTotal = alugamentoAny.pricing?.total ?? alugamentoAny.prezos?.total ?? 0;
        setTotal(importeTotal);
        setPropertyTitle(alugamentoAny.propertyTitle ?? '');

        const { clientSecret: secret } = await createPaymentIntent(id);
        setClientSecret(secret);
      } catch (err: any) {
        setError(err?.message ?? 'Non se puido iniciar o pago');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [id, router]);

  const handleSuccess = () => {
    router.push(`/alugamentos/${id}/confirmacion`);
  };

  const handleError = (msg: string) => {
    setError(msg);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-galician-blue mx-auto mb-4" />
            <p className="text-gray-600">Preparando o pago...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!clientSecret) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-900 mb-2">Erro ao iniciar o pago</h2>
              <p className="text-red-600 mb-4">{error ?? 'Non se puido preparar o formulario de pago.'}</p>
              <Button onClick={() => router.push('/taboleiro/mos-alugamentos')}>
                Voltar aos meus alugamentos
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-galician-blue"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-galician-blue">Completar Pago</h1>
            {propertyTitle && (
              <p className="text-gray-600 mt-0.5">{propertyTitle}</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Resumo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <CreditCard className="h-5 w-5 mr-2 text-galician-blue" />
                Resumo do pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total a pagar</span>
                <span className="text-galician-blue">{total.toFixed(2)} €</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                O cargo realizarase de forma segura a través de Stripe
              </p>
            </CardContent>
          </Card>

          {/* Formulario de pago */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Shield className="h-5 w-5 mr-2 text-galician-green" />
                Datos de pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <StripeProvider clientSecret={clientSecret}>
                <PaymentForm
                  alugamentoId={id}
                  total={total}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </StripeProvider>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  );
}
