/**
 * Página de Mensaxes - FincAirbnb
 * 
 * Página para ver y gestionar mensajes entre propietarios y labregos
 * Ruta: /taboleiro/mensaxes
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Send, 
  MessageCircle, 
  User, 
  Calendar,
  Clock,
  Search,
  FileText,
  Settings
} from 'lucide-react';
import { TemplateSelector } from '@/components/messaging/TemplateSelector';
import { getConversations, sendMessage } from '@/services/mockMessages';
import { getProperty } from '@/services/mockProperties';
import { getUserById } from '@/services/mockUsers';

import type { Message } from '@/shared/types';

interface Conversation {
  id: string;
  bookingId?: string;
  propertyId: string;
  propertyTitle: string;
  otherUserName: string;
  otherUserRole: 'owner' | 'guest';
  messages: Message[];
  lastMessageAt: string;
  unreadCount: number;
}

export default function MensaxesPage() {
  const { getCurrentUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = getCurrentUser();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoading(true);
        
        if (!user) return;
        
        const userConversations = await getConversations(user.id);

        // Batch fetch propiedades e usuarios únicos en paralelo
        const uniquePropertyIds = Array.from(new Set(userConversations.map((c: any) => c.propertyId as string)));
        const uniqueOtherUserIds = Array.from(new Set(
          userConversations.map((c: any) => (user.role === 'owner' ? c.guestId : c.ownerId) as string)
        ));

        const [propertyEntries, userEntries] = await Promise.all([
          Promise.all(
            uniquePropertyIds.map(async (propId) => {
              const prop = await getProperty(propId as string).catch(() => null);
              return [propId, prop?.title ?? 'Finca'] as [string, string];
            })
          ),
          Promise.all(
            uniqueOtherUserIds.map(async (uid) => {
              const u = await getUserById(uid as string).catch(() => null);
              return [uid, u?.name ?? null] as [string, string | null];
            })
          ),
        ]);

        const propertyMap = Object.fromEntries(propertyEntries);
        const userMap = Object.fromEntries(userEntries);

        const enrichedConversations: Conversation[] = userConversations.map((conv: any) => {
          const otherUserId = user.role === 'owner' ? conv.guestId : conv.ownerId;
          const otherUserRole: 'owner' | 'guest' = user.role === 'owner' ? 'guest' : 'owner';

          const unreadCount = conv.messages.filter(
            (msg: any) => !msg.read && msg.senderId !== user.id
          ).length;

          const propertyTitle = propertyMap[conv.propertyId] ?? 'Finca';
          const alugamentoId = conv.bookingId ? ` (${conv.bookingId})` : '';

          return {
            id: conv.id,
            bookingId: conv.bookingId || undefined,
            propertyId: conv.propertyId,
            propertyTitle: `${propertyTitle}${alugamentoId}`,
            otherUserName: userMap[otherUserId] ?? (otherUserRole === 'owner' ? 'Propietario' : 'Labrego'),
            otherUserRole,
            messages: conv.messages,
            lastMessageAt: conv.messages[conv.messages.length - 1]?.createdAt || conv.createdAt,
            unreadCount
          };
        });
        
        // Ordenar por fecha del último mensaje
        enrichedConversations.sort((a, b) => 
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        );
        
        setConversations(enrichedConversations);
        
        // Si hay un parámetro de alugamento, seleccionar esa conversación
        const alugamentoParam = searchParams.get('alugamento');
        if (alugamentoParam) {
          const conversation = enrichedConversations.find(c => c.bookingId === alugamentoParam);
          if (conversation) {
            setSelectedConversation(conversation);
          }
        }
        
      } catch (error) {
        console.error('Error cargando conversaciones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadConversations();
    }
  }, [user, searchParams]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      const message = await sendMessage(selectedConversation.id, user.id, newMessage.trim());
      setSelectedConversation(prev =>
        prev ? { ...prev, messages: [...prev.messages, message] } : null
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error enviando mensaxe:', error);
    }
  };

  const handleTemplateSelect = (content: string) => {
    setNewMessage(content);
    setShowTemplateSelector(false);
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Hai poucos minutos';
    } else if (diffInHours < 24) {
      return `Hai ${Math.floor(diffInHours)} horas`;
    } else {
      return date.toLocaleDateString('gl-ES', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-galician-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando mensaxes...</p>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar</span>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Mensaxes</h1>
                  <p className="text-gray-600">Xestiona as túas conversas con {user?.role === 'owner' ? 'labregos' : 'propietarios'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Lista de conversaciones */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-galician-blue" />
                    <span>Conversas</span>
                    {conversations.length > 0 && (
                      <Badge className="bg-galician-blue text-white">
                        {conversations.length}
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar conversas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredConversations.length === 0 ? (
                    <div className="p-6 text-center">
                      <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        {searchQuery ? 'Non se atoparon conversas' : 'Non tes conversas aínda'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-[480px] overflow-y-auto">
                      {filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() => setSelectedConversation(conversation)}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-900 truncate">
                                  {conversation.otherUserName}
                                </span>
                                {conversation.unreadCount > 0 && (
                                  <Badge className="bg-red-500 text-white text-xs">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 truncate mb-1">
                                {conversation.propertyTitle}
                              </p>
                              <p className="text-sm text-gray-700 truncate">
                                {conversation.messages[conversation.messages.length - 1]?.content || 'Sen mensaxes'}
                              </p>
                            </div>
                            <div className="flex flex-col items-end space-y-1 ml-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(conversation.lastMessageAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Conversación seleccionada */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                {selectedConversation ? (
                  <>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-galician-blue" />
                            <span>{selectedConversation.otherUserName}</span>
                            <Badge variant="outline">
                              {selectedConversation.otherUserRole === 'owner' ? 'Propietario' : 'Labrego'}
                            </Badge>
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {selectedConversation.propertyTitle}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col h-[480px]">
                      {/* Mensajes */}
                      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                        {selectedConversation.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                message.senderId === user?.id
                                  ? 'bg-galician-blue text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.senderId === user?.id
                                  ? 'text-blue-100'
                                  : 'text-gray-500'
                              }`}>
                                {formatTimestamp(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Input para nuevo mensaje */}
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Textarea
                            placeholder="Escribe a túa mensaxe..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 min-h-[60px] resize-none"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="bg-galician-blue hover:bg-blue-700"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Botones de ayuda para propietarios */}
                        {user?.role === 'owner' && (
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowTemplateSelector(true)}
                              className="text-galician-blue border-galician-blue hover:bg-blue-50"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Plantillas
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push('/taboleiro/mensaxes/modelos')}
                              className="text-galician-blue border-galician-blue hover:bg-blue-50"
                            >
                              <Settings className="h-3 w-3 mr-1" />
                              Xestionar
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Selecciona unha conversa
                      </h3>
                      <p className="text-gray-500">
                        Elixe unha conversa da lista para comezar a escribir
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>

        {/* Modal del selector de plantillas */}
        {showTemplateSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <TemplateSelector
                isOwner={user?.role === 'owner'}
                conversationId={selectedConversation?.id}
                propertyId={selectedConversation?.propertyId}
                guestName={selectedConversation?.otherUserName}
                ownerName={user?.name}
                onTemplateSelect={handleTemplateSelect}
                onClose={() => setShowTemplateSelector(false)}
              />
            </div>
          </div>
        )}

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
