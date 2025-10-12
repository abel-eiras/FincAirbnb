/**
 * Mock Service para Alugamentos - FincAirbnb
 * 
 * Servicio mock para gestionar alugamentos de fincas por labregos
 * Adaptado ao contexto rural gallego con alugamentos por meses
 */

import { delay, loadMockData } from './utils';

export interface Alugamento {
  id: string;
  propertyId: string;
  labregoId: string;
  ownerId: string;
  inicioCultivo: string;
  finCultivo: string;
  meses: number;
  detallesCultivo: {
    tipoCultivo: string;
    experiencia: 'principiante' | 'intermedio' | 'avanzado' | 'experto';
    herramientasPropias: boolean;
    mascotas: number;
  };
  prezos: {
    prezoMes: number;
    meses: number;
    subtotal: number;
    taxaLimpeza: number;
    taxaServizo: number;
    impostos: number;
    total: number;
  };
  status: 'confirmado' | 'completado' | 'cancelado';
  estadoPago: 'pagado' | 'pendente' | 'reembolsado';
  solicitudesEspeciais?: string;
  politicaCancelacion: 'flexible' | 'moderada' | 'estrita';
  creado: string;
  confirmado: string;
  pagado: string;
  completado?: string;
  cancelado?: string;
  detallesCancelacion?: {
    canceladoPor: 'labrego' | 'propietario' | 'sistema';
    motivo: string;
    importeReembolso: number;
  };
}

/**
 * Obter todos os alugamentos dun labrego
 */
export async function getAlugamentosByLabrego(labregoId: string): Promise<Alugamento[]> {
  await delay(500);
  const allAlugamentos = await loadMockData<Alugamento>('alugamentos');
  return allAlugamentos.filter(alugamento => alugamento.labregoId === labregoId);
}

/**
 * Obter alugamentos próximos (confirmados e futuros)
 */
export async function getProximosAlugamentos(labregoId: string): Promise<Alugamento[]> {
  await delay(300);
  const alugamentos = await getAlugamentosByLabrego(labregoId);
  const agora = new Date();
  
  return alugamentos.filter(alugamento => {
    if (alugamento.status !== 'confirmado') return false;
    const inicioCultivo = new Date(alugamento.inicioCultivo);
    return inicioCultivo > agora;
  });
}

/**
 * Obter alugamentos pasados (completados)
 */
export async function getAlugamentosPasados(labregoId: string): Promise<Alugamento[]> {
  await delay(300);
  const alugamentos = await getAlugamentosByLabrego(labregoId);
  const agora = new Date();
  
  return alugamentos.filter(alugamento => {
    if (alugamento.status !== 'completado') return false;
    const finCultivo = new Date(alugamento.finCultivo);
    return finCultivo < agora;
  });
}

/**
 * Obter alugamentos cancelados
 */
export async function getAlugamentosCancelados(labregoId: string): Promise<Alugamento[]> {
  await delay(300);
  const alugamentos = await getAlugamentosByLabrego(labregoId);
  return alugamentos.filter(alugamento => alugamento.status === 'cancelado');
}

/**
 * Obter un alugamento por ID
 */
export async function getAlugamentoById(alugamentoId: string): Promise<Alugamento | null> {
  await delay(200);
  const allAlugamentos = await loadMockData<Alugamento>('alugamentos');
  return allAlugamentos.find(alugamento => alugamento.id === alugamentoId) || null;
}

/**
 * Cancelar un alugamento
 */
export async function cancelarAlugamento(alugamentoId: string, motivo: string): Promise<void> {
  await delay(1000);
  
  // En unha implementación real, aquí actualizaríase a base de datos
  console.log(`Alugamento ${alugamentoId} cancelado. Motivo: ${motivo}`);
  
  // Mock: simular éxito
  if (Math.random() < 0.1) {
    throw new Error('Non se puido cancelar o alugamento. Tenta de novo.');
  }
}

/**
 * Obter estatísticas dun labrego
 */
export async function getEstatisticasLabrego(labregoId: string) {
  await delay(400);
  const alugamentos = await getAlugamentosByLabrego(labregoId);
  
  const proximos = alugamentos.filter(a => a.status === 'confirmado').length;
  const completados = alugamentos.filter(a => a.status === 'completado').length;
  const cancelados = alugamentos.filter(a => a.status === 'cancelado').length;
  
  const totalGasto = alugamentos
    .filter(a => a.estadoPago === 'pagado')
    .reduce((sum, a) => sum + a.prezos.total, 0);
  
  const mesesCultivados = alugamentos
    .filter(a => a.status === 'completado')
    .reduce((sum, a) => sum + a.meses, 0);
  
  return {
    totalAlugamentos: alugamentos.length,
    proximos,
    completados,
    cancelados,
    totalGasto,
    mesesCultivados,
    gastoMedio: alugamentos.length > 0 ? totalGasto / alugamentos.length : 0
  };
}
