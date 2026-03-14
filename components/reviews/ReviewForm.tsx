/**
 * ReviewForm Component - FincAirbnb
 * 
 * Formulario completo para crear reseñas
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StarRating } from './StarRating';
import { CategoryRatings, CategoryRatingsData } from './CategoryRatings';
import { createReview } from '@/services/mockReviews';
import { 
  Star, 
  Image as ImageIcon, 
  Send, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ReviewFormProps {
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({ 
  propertyId, 
  propertyTitle, 
  propertyImage, 
  userId, 
  onSuccess,
  onCancel 
}: ReviewFormProps) {
  const router = useRouter();
  
  // Estados del formulario
  const [rating, setRating] = useState(5);
  const [categoryRatings, setCategoryRatings] = useState<CategoryRatingsData>({
    limpeza: 5,
    comunicacion: 5,
    precision: 5,
    localizacion: 5,
    calidadePrezo: 5
  });
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState(true);
  const [photos, setPhotos] = useState<{ url: string; caption?: string }[]>([]);
  
  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (comment.length < 50) {
      setError('O comentario debe ter polo menos 50 caracteres');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createReview({
        propertyId,
        userId,
        rating,
        categoryRatings,
        title: title.trim() || undefined,
        comment: comment.trim(),
        recommend,
        photos
      });

      setSuccess(true);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/taboleiro/mos-alugamentos');
        }
      }, 2000);

    } catch (error) {
      console.error('Error creando reseña:', error);
      setError('Erro ao crear a valoración. Téntao de novo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Valoración enviada!
            </h2>
            <p className="text-gray-600 mb-4">
              Grazas pola túa valoración. Axudará a outros labregos a tomar decisións.
            </p>
            <p className="text-sm text-gray-500">
              Redirixindo ao teu taboleiro...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-xl">Valorar finca</CardTitle>
              <p className="text-gray-600 mt-1">{propertyTitle}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Información de la propiedad */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg mb-6">
            <Image
              src={propertyImage}
              alt={propertyTitle}
              className="w-16 h-16 object-cover rounded-lg"
              width={64}
              height={64}
            />
            <div>
              <h3 className="font-medium text-gray-900">{propertyTitle}</h3>
              <p className="text-sm text-gray-600">Finca alugada recentemente</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating General */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Valoración xeral <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center space-x-4">
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  size="lg"
                />
                <span className="text-lg font-medium text-gray-700">
                  {rating} estrela{rating !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Ratings por Categorías */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Valoración por categorías <span className="text-red-500">*</span>
              </Label>
              <CategoryRatings
                ratings={categoryRatings}
                onRatingsChange={setCategoryRatings}
                size="md"
              />
            </div>

            {/* Título (opcional) */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Título (opcional)
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Unha finca maravillosa para cultivar"
                maxLength={100}
              />
              <p className="text-xs text-gray-500">
                {title.length}/100 caracteres
              </p>
            </div>

            {/* Comentario */}
            <div className="space-y-2">
              <Label htmlFor="comment">
                Comentario <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comparte a túa experiencia nesta finca. Describe o que máis che gustou, as instalacións, a localización, etc."
                rows={5}
                minLength={50}
                maxLength={1000}
                className="resize-none"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  Mínimo 50 caracteres
                </span>
                <span className={comment.length < 50 ? 'text-red-500' : ''}>
                  {comment.length}/1000 caracteres
                </span>
              </div>
            </div>

            {/* Recomendar */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-base font-medium">
                  Recomendarías esta finca?
                </Label>
                <p className="text-sm text-gray-600">
                  A túa recomendación axuda a outros labregos
                </p>
              </div>
              <Switch
                checked={recommend}
                onCheckedChange={setRecommend}
              />
            </div>

            {/* Fotos (mock) */}
            <div className="space-y-2">
              <Label>
                Fotos (próximamente)
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  A función de subir fotos estará dispoñible próximamente
                </p>
              </div>
            </div>

            {/* Errores */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Botones */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || comment.length < 50}
                className="flex-1 bg-galician-blue hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Enviando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Enviar valoración</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
