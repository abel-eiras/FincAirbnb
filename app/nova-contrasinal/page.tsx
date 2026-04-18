'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils';
import { apiClient } from '@/services/apiClient';
import { KeyRound, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';

const schema = z
  .object({
    newPassword: z.string().min(8, 'A contrasinal debe ter polo menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma a nova contrasinal'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'As contrasinais non coinciden',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

function NovaContrasinForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';

  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: 'onChange' });

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-galician-blue mb-4">Enlace inválido</h1>
          <p className="text-gray-600 mb-6">
            Este enlace non é válido. Solicita un novo correo de recuperación.
          </p>
          <Button onClick={() => router.push('/recuperar-contrasinal')} className="bg-galician-blue hover:bg-blue-700">
            Solicitar novo enlace
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'ok') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-galician-blue mb-2">Contrasinal cambiada</h1>
          <p className="text-gray-600 mb-8">
            A túa contrasinal foi actualizada correctamente. Xa podes iniciar sesión.
          </p>
          <Button onClick={() => router.push('/acceder')} className="bg-galician-blue hover:bg-blue-700">
            Ir ao login
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    setErrorMsg('');
    try {
      await apiClient.post('/auth/nova-contrasinal', {
        token,
        newPassword: data.newPassword,
      });
      setStatus('ok');
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Token inválido ou caducado. Solicita un novo enlace.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-galician-blue mb-4">
            <KeyRound className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-galician-blue mb-2">Nova contrasinal</h1>
          <p className="text-gray-600">Introduce a túa nova contrasinal. Mínimo 8 caracteres.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova contrasinal</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Mínimo 8 caracteres"
              className={cn(
                'w-full px-4 py-3 border border-gray-300 rounded-xl',
                errors.newPassword && 'border-red-500'
              )}
              {...register('newPassword')}
              disabled={isSubmitting}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-600">⚠️ {errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contrasinal</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repite a nova contrasinal"
              className={cn(
                'w-full px-4 py-3 border border-gray-300 rounded-xl',
                errors.confirmPassword && 'border-red-500'
              )}
              {...register('confirmPassword')}
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">⚠️ {errors.confirmPassword.message}</p>
            )}
          </div>

          {status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMsg}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-galician-blue hover:bg-blue-700 text-white font-medium rounded-xl disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" color="white" />
                Gardando...
              </span>
            ) : (
              'Cambiar contrasinal'
            )}
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => router.push('/recuperar-contrasinal')}
              className="text-galician-blue hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Solicitar outro enlace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NovaContrasinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-galician-blue" />
      </div>
    }>
      <NovaContrasinForm />
    </Suspense>
  );
}
