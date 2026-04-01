'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Bell,
  Lock,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { changePassword, deleteAccount } from '@/services/mockAuth';

// ── Notification toggle row ────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          checked ? 'bg-galician-blue' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function ConfiguracionPage() {
  const router = useRouter();
  const { getCurrentUser, logout } = useAuth();
  const user = getCurrentUser();

  // ── Notifications state ────────────────────────────────────────────────
  const [emailBookings, setEmailBookings] = useState(true);
  const [emailMessages, setEmailMessages] = useState(true);
  const [emailReviews, setEmailReviews] = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(false);
  const [inAppBookings, setInAppBookings] = useState(true);
  const [inAppMessages, setInAppMessages] = useState(true);
  const [inAppReviews, setInAppReviews] = useState(true);
  const [notifSaved, setNotifSaved] = useState(false);

  const saveNotifications = () => {
    // En mock: só mostramos confirmación. En prod: PATCH /users/:id/notifications
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  };

  // ── Password change state ──────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  const handleChangePassword = async () => {
    setPwError(null);
    if (pwForm.next.length < 8) {
      setPwError('A nova contrasinal debe ter polo menos 8 caracteres');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('As contrasinais non coinciden');
      return;
    }
    if (!user) return;
    setPwSaving(true);
    try {
      await changePassword(user.id, pwForm.current, pwForm.next);
      setPwForm({ current: '', next: '', confirm: '' });
      setPwSuccess(true);
      setTimeout(() => setPwSuccess(false), 4000);
    } catch (err: any) {
      setPwError(err.message || 'Erro ao cambiar a contrasinal');
    } finally {
      setPwSaving(false);
    }
  };

  // ── Delete account state ───────────────────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user || deleteInput !== 'eliminar') return;
    setIsDeleting(true);
    try {
      await deleteAccount(user.id);
      logout();
      router.push('/');
    } catch {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <button onClick={() => router.push('/taboleiro')} className="text-gray-500 hover:text-galician-blue">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          </div>

          {/* Notificacións */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-galician-blue flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notificacións
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold text-gray-700 mb-2">Por correo electrónico</p>
              <Toggle
                checked={emailBookings}
                onChange={setEmailBookings}
                label="Reservas"
                description="Novas solicitudes, confirmacións e cancelacións"
              />
              <Toggle
                checked={emailMessages}
                onChange={setEmailMessages}
                label="Mensaxes"
                description="Novos mensaxes recibidos"
              />
              <Toggle
                checked={emailReviews}
                onChange={setEmailReviews}
                label="Valoracións"
                description="Novas avaliacións das túas fincas"
              />
              <Toggle
                checked={emailMarketing}
                onChange={setEmailMarketing}
                label="Novidades e ofertas"
                description="Novas funcionalidades e promocións de FincAirbnb"
              />

              <p className="text-sm font-semibold text-gray-700 mt-4 mb-2">Na app</p>
              <Toggle
                checked={inAppBookings}
                onChange={setInAppBookings}
                label="Reservas"
              />
              <Toggle
                checked={inAppMessages}
                onChange={setInAppMessages}
                label="Mensaxes"
              />
              <Toggle
                checked={inAppReviews}
                onChange={setInAppReviews}
                label="Valoracións"
              />

              {notifSaved && (
                <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Preferencias gardadas
                </div>
              )}

              <div className="flex justify-end mt-4">
                <Button onClick={saveNotifications} className="bg-galician-blue hover:bg-blue-700">
                  Gardar preferencias
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contrasinal */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-galician-blue flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Cambiar contrasinal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contrasinal actual</label>
                <div className="relative">
                  <Input
                    type={showPw ? 'text' : 'password'}
                    value={pwForm.current}
                    onChange={e => setPwForm(prev => ({ ...prev, current: e.target.value }))}
                    placeholder="Contrasinal actual"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPw(v => !v)}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nova contrasinal</label>
                  <Input
                    type={showPw ? 'text' : 'password'}
                    value={pwForm.next}
                    onChange={e => setPwForm(prev => ({ ...prev, next: e.target.value }))}
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contrasinal</label>
                  <Input
                    type={showPw ? 'text' : 'password'}
                    value={pwForm.confirm}
                    onChange={e => setPwForm(prev => ({ ...prev, confirm: e.target.value }))}
                    placeholder="Repite a nova contrasinal"
                  />
                </div>
              </div>

              {pwError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {pwError}
                </div>
              )}
              {pwSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Contrasinal cambiada correctamente
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleChangePassword}
                  disabled={pwSaving || !pwForm.current || !pwForm.next || !pwForm.confirm}
                  className="bg-galician-blue hover:bg-blue-700"
                >
                  {pwSaving ? 'Gardando...' : 'Cambiar contrasinal'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Eliminar conta */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center">
                <Trash2 className="h-5 w-5 mr-2" />
                Zona de perigo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Eliminar a túa conta é una acción permanente. Perderás todos os teus datos, alugamentos e mensaxes.
              </p>

              {!showDeleteConfirm ? (
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar conta
                </Button>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-medium">
                      Escribe &quot;eliminar&quot; para confirmar
                    </p>
                  </div>
                  <Input
                    value={deleteInput}
                    onChange={e => setDeleteInput(e.target.value)}
                    placeholder="eliminar"
                    className="border-red-300 focus:ring-red-500"
                  />
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      disabled={deleteInput !== 'eliminar' || isDeleting}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleDeleteAccount}
                    >
                      {isDeleting ? 'Eliminando...' : 'Eliminar definitivamente'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    </ProtectedRoute>
  );
}
