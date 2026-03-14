/**
 * ReviewResponse Component - FincAirbnb
 * 
 * Componente para que los propietarios respondan a las reseñas
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { respondToReview } from '@/services/mockReviews';
import { Send, X, AlertCircle } from 'lucide-react';

interface ReviewResponseProps {
  reviewId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewResponse({ reviewId, onSuccess, onCancel }: ReviewResponseProps) {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (response.trim().length < 10) {
      setError('A resposta debe ter polo menos 10 caracteres');
      return;
    }

    if (response.trim().length > 500) {
      setError('A resposta non pode ter máis de 500 caracteres');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Obtener el ownerId del contexto de autenticación
      const ownerId = 'owner-1'; // Por ahora hardcodeado
      
      await respondToReview(reviewId, response.trim(), ownerId);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error respondiendo a reseña:', error);
      setError('Erro ao enviar a resposta. Téntao de novo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setResponse('');
    setError(null);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-blue-900">Responder á valoración</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="text-blue-600 hover:text-blue-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="response" className="text-blue-900">
            A túa resposta
          </Label>
          <Textarea
            id="response"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Agradece a valoración ou aclara calquera cuestión..."
            rows={3}
            minLength={10}
            maxLength={500}
            className="resize-none border-blue-300 focus:border-blue-500"
          />
          <div className="flex justify-between text-xs text-blue-600">
            <span>Mínimo 10 caracteres</span>
            <span className={response.length > 500 ? 'text-red-500' : ''}>
              {response.length}/500 caracteres
            </span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || response.trim().length < 10 || response.trim().length > 500}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                <span>Enviando...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Send className="h-3 w-3" />
                <span>Enviar resposta</span>
              </div>
            )}
          </Button>
        </div>
      </form>

      <div className="text-xs text-blue-600 bg-blue-100 rounded p-2">
        <p className="font-medium mb-1">Consellos para responder:</p>
        <ul className="space-y-1 text-xs">
          <li>• Agradece a valoración sincera</li>
          <li>• Responde de xeito profesional e cordial</li>
          <li>• Se hai queixas, explica como vas mellorar</li>
          <li>• Invita a visitar de novo a finca</li>
        </ul>
      </div>
    </div>
  );
}







