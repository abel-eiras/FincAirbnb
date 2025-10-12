/**
 * MessageThread Component - FincAirbnb
 * 
 * Componente para la comunicación entre propietarios y labregos
 * Adaptado al contexto de fincas agrícolas
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  User, 
  Clock,
  CheckCircle,
  Wheat
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'owner' | 'guest';
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface MessageThreadProps {
  alugamentoId: string;
  currentUser: {
    id: string;
    name: string;
    role: 'owner' | 'guest';
  };
  otherUser: {
    id: string;
    name: string;
    role: 'owner' | 'guest';
  };
}

export function MessageThread({ alugamentoId, currentUser, otherUser }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar mensajes
  useEffect(() => {
    const loadMessages = () => {
      try {
        // Obtener mensajes del localStorage
        const allMessages = JSON.parse(localStorage.getItem(`messages-${alugamentoId}`) || '[]');
        setMessages(allMessages);
      } catch (error) {
        console.error('Error cargando mensajes:', error);
      }
    };

    loadMessages();
  }, [alugamentoId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);

    try {
      const message: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isRead: false
      };

      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      setNewMessage('');

      // Guardar en localStorage
      localStorage.setItem(`messages-${alugamentoId}`, JSON.stringify(updatedMessages));

    } catch (error) {
      console.error('Error enviando mensaje:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('gl-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays === 1) {
      return 'Onte ' + date.toLocaleTimeString('gl-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays < 7) {
      return date.toLocaleDateString('gl-ES', { 
        weekday: 'short',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('gl-ES');
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Propietario';
      case 'guest':
        return 'Labrego';
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return '🏡';
      case 'guest':
        return '🌱';
      default:
        return '👤';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center text-lg">
          <MessageCircle className="h-5 w-5 mr-2 text-galician-blue" />
          Conversación sobre o Alugamento
        </CardTitle>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{getRoleIcon(currentUser.role)} {currentUser.name}</span>
            <Badge variant="outline" className="text-xs">
              {getRoleLabel(currentUser.role)}
            </Badge>
          </div>
          <span>→</span>
          <div className="flex items-center space-x-2">
            <span className="font-medium">{getRoleIcon(otherUser.role)} {otherUser.name}</span>
            <Badge variant="outline" className="text-xs">
              {getRoleLabel(otherUser.role)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Lista de mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Non hai mensaxes aínda
              </h3>
              <p className="text-gray-600">
                Inicia a conversación sobre o alugamento da finca.
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.senderId === currentUser.id;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isOwnMessage
                        ? 'bg-galician-blue text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">
                        {getRoleIcon(message.senderRole)} {message.senderName}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          isOwnMessage 
                            ? 'bg-white bg-opacity-20 text-white' 
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {getRoleLabel(message.senderRole)}
                      </Badge>
                    </div>
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${
                        isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </span>
                      {isOwnMessage && (
                        <CheckCircle className={`h-3 w-3 ${
                          message.isRead ? 'text-green-300' : 'text-blue-100'
                        }`} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input de mensaje */}
        <div className="border-t p-4">
          <div className="flex space-x-3">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe unha mensaxe sobre o alugamento..."
              className="flex-1 min-h-[80px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || isLoading}
              className="bg-galician-blue hover:bg-blue-700 self-end"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            💡 Consello: Podes preguntar sobre acceso á auga, ferramentas dispoñibles, 
            normas da finca, ou calquera dúbida sobre o cultivo.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
