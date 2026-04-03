'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeProviderProps {
  clientSecret: string;
  children: React.ReactNode;
}

export function StripeProvider({ clientSecret, children }: StripeProviderProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#1e3a5f',
            colorBackground: '#ffffff',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '8px',
          },
        },
        locale: 'es',
      }}
    >
      {children}
    </Elements>
  );
}
