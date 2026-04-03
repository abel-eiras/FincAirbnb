'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Lock, Loader2 } from 'lucide-react';

interface PaymentFormProps {
  alugamentoId: string;
  total: number;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export function PaymentForm({ alugamentoId, total, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/alugamentos/${alugamentoId}/confirmacion`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message ?? 'Erro ao procesar o pago');
      } else {
        onSuccess();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-galician-blue hover:bg-blue-700 py-3 text-base"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Pagar {total.toFixed(2)} €
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Pago seguro con Stripe. Os teus datos están protexidos.
      </p>
    </form>
  );
}
