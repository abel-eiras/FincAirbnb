/**
 * Traducciones al gallego para la interfaz de usuario
 * 
 * Este archivo centraliza todas las traducciones para mantener
 * consistencia en el idioma de la interfaz
 */

/**
 * Traduce el rol del usuario al gallego sin distinción de género
 * Usa términos apropiados para el contexto agrícola y rural gallego
 * 
 * @param role - Rol del usuario en inglés
 * @returns Rol traducido al gallego
 */
export function translateUserRole(role: string): string {
  switch (role) {
    case 'owner':
      return 'Propietario/a';
    case 'guest':
      return 'Labrego/a'; // Término agrícola apropiado para quien alquila fincas
    case 'admin':
      return 'Administrador/a';
    default:
      return role;
  }
}

/**
 * Traduce el estado de una reserva al gallego
 * 
 * @param status - Estado de la reserva en inglés
 * @returns Estado traducido al gallego
 */
export function translateBookingStatus(status: string): string {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'confirmed':
      return 'Confirmada';
    case 'paid':
      return 'Pagada';
    case 'checked_in':
      return 'Aloxado/a';
    case 'checked_out':
      return 'Saído/a';
    case 'completed':
      return 'Completada';
    case 'cancelled':
      return 'Cancelada';
    case 'declined':
      return 'Rexeitada';
    default:
      return status;
  }
}

/**
 * Traduce el tipo de propiedad al gallego
 * 
 * @param type - Tipo de propiedad en inglés
 * @returns Tipo traducido al gallego
 */
export function translatePropertyType(type: string): string {
  switch (type) {
    case 'finca':
      return 'Finca';
    case 'pazo':
      return 'Pazo';
    case 'casa_rural':
      return 'Casa Rural';
    case 'horreo':
      return 'Hórreo';
    case 'cortina':
      return 'Cortiña';
    default:
      return type;
  }
}

/**
 * Traduce la provincia de Galicia al gallego
 * 
 * @param province - Provincia en español
 * @returns Provincia en gallego
 */
export function translateProvince(province: string): string {
  switch (province) {
    case 'Pontevedra':
      return 'Pontevedra';
    case 'A Coruña':
      return 'A Coruña';
    case 'Lugo':
      return 'Lugo';
    case 'Ourense':
      return 'Ourense';
    default:
      return province;
  }
}

/**
 * Traduce el plan de suscripción al gallego
 * 
 * @param plan - Plan de suscripción en inglés
 * @returns Plan traducido al gallego
 */
export function translateSubscriptionPlan(plan: string): string {
  switch (plan) {
    case 'basic':
      return 'Básico';
    case 'professional':
      return 'Profesional';
    case 'enterprise':
      return 'Empresarial';
    default:
      return plan;
  }
}

/**
 * Traduce el estado de la suscripción al gallego
 * 
 * @param status - Estado de la suscripción en inglés
 * @returns Estado traducido al gallego
 */
export function translateSubscriptionStatus(status: string): string {
  switch (status) {
    case 'active':
      return 'Activa';
    case 'cancelled':
      return 'Cancelada';
    case 'past_due':
      return 'Vencida';
    case 'trialing':
      return 'Proba';
    default:
      return status;
  }
}
