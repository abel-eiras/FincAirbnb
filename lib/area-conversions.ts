/**
 * Sistema de Conversiones de Área - FincAirbnb
 * 
 * Maneja las conversiones entre diferentes unidades de medida
 * incluyendo las equivalencias específicas de ferrados por municipio
 */

// Equivalencias base (1 hectárea = X unidades)
const BASE_EQUIVALENCIES = {
  hectareas: 1,
  metros_cuadrados: 10000,
  ferrados: 1 // Valor base, se sobrescribe por municipio
};

// Equivalencias de ferrados por provincia y municipio de Galicia
// Datos reales proporcionados por el usuario (tabla completa)
// Estructura: provincia_municipio para evitar conflictos de nombres
// Valores en metros cuadrados por 1 ferrado
const FERRADOS_BY_LOCATION: Record<string, number | null> = {
  // Provincia de A Coruña
  'a_coruna_abegondo': 436,
  'a_coruna_ames': 639,
  'a_coruna_aranga': 436,
  'a_coruna_ares': 548,
  'a_coruna_arteixo': 444,
  'a_coruna_arzua': 536,
  'a_coruna_a_bana': 528,
  'a_coruna_bergondo': 436,
  'a_coruna_betanzos': 434,
  'a_coruna_boimorto': null, // Dato non dispoñible
  'a_coruna_boiro': 484,
  'a_coruna_boqueixon': 639,
  'a_coruna_brion': null, // Dato non dispoñible
  'a_coruna_cabana_de_bergantinos': null, // Dato non dispoñible
  'a_coruna_cabanas': null, // Dato non dispoñible
  'a_coruna_camarinhas': 424,
  'a_coruna_cambre': 444,
  'a_coruna_a_capela': 548,
  'a_coruna_carballo': 524,
  'a_coruna_carino': 444,
  'a_coruna_carnota': 400,
  'a_coruna_carral': 444,
  'a_coruna_cedeira': 509,
  'a_coruna_cee': 436,
  'a_coruna_cerceda': 639,
  'a_coruna_cerdido': 509,
  'a_coruna_coiros': 436,
  'a_coruna_corcubion': 424,
  'a_coruna_coristanco': 524,
  'a_coruna_a_coruna': 444,
  'a_coruna_culleredo': 444,
  'a_coruna_curtis': null, // Dato non dispoñible
  'a_coruna_dodro': 420,
  'a_coruna_dumbria': 424,
  'a_coruna_fene': null, // Dato non dispoñible
  'a_coruna_ferrol': 507,
  'a_coruna_fisterra': null, // Dato non dispoñible
  'a_coruna_frades': 636,
  'a_coruna_irixoa': 436,
  'a_coruna_a_laracha': 524,
  'a_coruna_laxe': 524,
  'a_coruna_lousame': 420,
  'a_coruna_malpica_de_bergantinos': 524,
  'a_coruna_manon': 548,
  'a_coruna_mazaricos': 424,
  'a_coruna_melide': 536,
  'a_coruna_mesia': 603,
  'a_coruna_mino': 548,
  'a_coruna_moeche': 509,
  'a_coruna_monfero': 548,
  'a_coruna_mugardos': 548,
  'a_coruna_muros': 335,
  'a_coruna_muxia': 424,
  'a_coruna_naron': 509,
  'a_coruna_neda': 509,
  'a_coruna_negreira': 528,
  'a_coruna_noia': 420,
  'a_coruna_oleiros': 444,
  'a_coruna_ordes': 639,
  'a_coruna_oroso': 639,
  'a_coruna_ortigueira': 444,
  'a_coruna_outes': 396,
  'a_coruna_paderne': 436,
  'a_coruna_padron': 420,
  'a_coruna_o_pino': 536,
  'a_coruna_a_pobra_do_caraminal': 484,
  'a_coruna_ponteceso': 524,
  'a_coruna_pontedeume': 548,
  'a_coruna_pontes_de_garcia_rodriguez': 548,
  'a_coruna_porto_do_son': 480,
  'a_coruna_rianxo': 484,
  'a_coruna_ribeira': 484,
  'a_coruna_rois': 424,
  'a_coruna_sada': 436,
  'a_coruna_san_sadurnino': 509,
  'a_coruna_santa_comba': 528,
  'a_coruna_santiago_de_compostela': 626,
  'a_coruna_santiso': 536,
  'a_coruna_sobrado': 536,
  'a_coruna_as_somozas': 509,
  'a_coruna_teo': 639,
  'a_coruna_toques': 536,
  'a_coruna_tordoia': 639,
  'a_coruna_touro': 536,
  'a_coruna_trazo': 640,
  'a_coruna_valdovino': 509,
  'a_coruna_vedra': 639,
  'a_coruna_vilasantar': 536,
  'a_coruna_vimianzo': 424,
  'a_coruna_zas': 424,

  // Provincia de Lugo
  'lugo_abadin': 504,
  'lugo_alfoz': 714,
  'lugo_antas_de_ulla': 604,
  'lugo_baleira': 714,
  'lugo_baralla': null, // Dato non dispoñible
  'lugo_barreiros': 714,
  'lugo_becerrea': 578,
  'lugo_begonte': 525,
  'lugo_boveda': 489,
  'lugo_castro_de_rei': 629,
  'lugo_castroverde': 496,
  'lugo_cervantes': 553,
  'lugo_cervo': 725,
  'lugo_o_corgo': 436,
  'lugo_cospeito': 525,
  'lugo_folgoso_do_courel': 436,
  'lugo_a_fonsagrada': 507,
  'lugo_foz': 714,
  'lugo_friol': 436,
  'lugo_guntin': 436,
  'lugo_guitiriz': null, // Dato non dispoñible
  'lugo_o_incio': 559,
  'lugo_lancara': 629,
  'lugo_lourenza': 638,
  'lugo_lugo': 352,
  'lugo_mantas': 514,
  'lugo_mondonedo': 612,
  'lugo_monforte_de_lemos': 489,
  'lugo_monterroso': 604,
  'lugo_muras': 548,
  'lugo_navia_de_suarna': 650,
  'lugo_negueira_de_muniz': 507,
  'lugo_as_nogais': 621,
  'lugo_outeiro_de_rei': 436,
  'lugo_ourol': 548,
  'lugo_palas_de_rei': 604,
  'lugo_panton': 489,
  'lugo_paradea': 559,
  'lugo_o_paramo': 559,
  'lugo_a_pastoriza': 504,
  'lugo_pedrafita_do_cebreiro': 578,
  'lugo_a_pobra_do_brollon': 465,
  'lugo_pol': 496,
  'lugo_a_pontenova': 504,
  'lugo_portomarin': 671,
  'lugo_quiroga': 465,
  'lugo_rabade': 436,
  'lugo_ribadeo': 612,
  'lugo_ribas_de_sil': 465,
  'lugo_ribeira_de_piquin': 514,
  'lugo_riotorto': 504,
  'lugo_samos': 559,
  'lugo_sarria': 629,
  'lugo_o_savinao': 559,
  'lugo_sober': 484,
  'lugo_taboada': 604,
  'lugo_trabada': 638,
  'lugo_triacastela': 430,
  'lugo_o_valadouro': 714,
  'lugo_valdovino': null, // Dato non dispoñible
  'lugo_vilalba': 546,
  'lugo_viveiro': 548,
  'lugo_xermade': 525,
  'lugo_xove': 725,

  // Provincia de Ourense
  'ourense_allariz': 629,
  'ourense_amoeiro': 629,
  'ourense_avion': 629,
  'ourense_a_arnoa': 629,
  'ourense_baltar': 629,
  'ourense_bande': 629,
  'ourense_banos_de_molgas': 629,
  'ourense_barbadas': 629,
  'ourense_o_barco_de_valdeorras': 629,
  'ourense_beade': 629,
  'ourense_beariz': 629,
  'ourense_os_blancos': 629,
  'ourense_boboras': 629,
  'ourense_a_bola': 629,
  'ourense_o_bolo': 629,
  'ourense_calvos_de_randin': 629,
  'ourense_carballeda_de_avia': 629,
  'ourense_carballeda_de_valdeorras': 629,
  'ourense_carballedo': 629,
  'ourense_o_carballino': 629,
  'ourense_cartelle': 629,
  'ourense_castrelo_de_mino': 629,
  'ourense_castrelo_do_val': 629,
  'ourense_castro_caldelas': 629,
  'ourense_celanova': 629,
  'ourense_cenlle': 629,
  'ourense_chandrexa_de_queixa': 629,
  'ourense_coles': 629,
  'ourense_cortegada': 629,
  'ourense_cualedro': 629,
  'ourense_entrimo': 629,
  'ourense_esgos': 629,
  'ourense_gomesende': 629,
  'ourense_a_gudina': 629,
  'ourense_o_irixo': 629,
  'ourense_larouco': 629,
  'ourense_laza': 629,
  'ourense_leiro': 629,
  'ourense_lobeira': 629,
  'ourense_lobios': 629,
  'ourense_maceda': 629,
  'ourense_manzaneda': 629,
  'ourense_maside': 629,
  'ourense_melon': 629,
  'ourense_a_merca': 629,
  'ourense_a_mezquita': 629,
  'ourense_montederramo': 629,
  'ourense_monterrei': 629,
  'ourense_ourense': 626,
  'ourense_paderne_de_allariz': 629,
  'ourense_padrenda': 629,
  'ourense_pereiro_de_aguiar': 629,
  'ourense_a_peroxa': 629,
  'ourense_pinor': 629,
  'ourense_a_pobra_de_trives': 629,
  'ourense_punxin': 629,
  'ourense_quintela_de_leirado': 629,
  'ourense_rairiz_de_veiga': 629,
  'ourense_ramiras': 629,
  'ourense_ribadavia': 629,
  'ourense_rios': 629,
  'ourense_a_rua': 629,
  'ourense_rubia': 629,
  'ourense_san_amaro': 629,
  'ourense_san_cibrao_das_vinas': 629,
  'ourense_san_cristovo_de_cea': 629,
  'ourense_san_xoan_de_rio': 629,
  'ourense_sandias': 629,
  'ourense_sarreaus': 629,
  'ourense_taboadela': 629,
  'ourense_toen': 629,
  'ourense_trasmiras': 629,
  'ourense_a_veiga': 629,
  'ourense_verea': 629,
  'ourense_verin': 626,
  'ourense_viana_do_bolo': 629,
  'ourense_vilamartin_de_valdeorras': 629,
  'ourense_vilamarin': 629,
  'ourense_vilar_de_barrio': 629,
  'ourense_vilar_de_santos': 629,
  'ourense_vilardevos': 629,
  'ourense_vilariño_de_conso': 629,
  'ourense_xunqueira_de_ambia': 629,
  'ourense_xunqueira_de_espadanedo': 629,

  // Provincia de Pontevedra
  'pontevedra_agolada': 536,
  'pontevedra_arbo': 437,
  'pontevedra_baiona': 539,
  'pontevedra_barro': null, // Dato non dispoñible
  'pontevedra_burela': null, // Dato non dispoñible
  'pontevedra_caldas_de_reis': 672,
  'pontevedra_cambados': 629,
  'pontevedra_campo_lameiro': 629,
  'pontevedra_cangas': 472,
  'pontevedra_a_caniza': 437,
  'pontevedra_catoira': 629,
  'pontevedra_cerdedo_cotobade': 528,
  'pontevedra_cuntis': 629,
  'pontevedra_dozon': 536,
  'pontevedra_a_estrada': 629,
  'pontevedra_forcarei': 500,
  'pontevedra_fornelos_de_montes': 74,
  'pontevedra_gondomar': 541,
  'pontevedra_o_grove': 629,
  'pontevedra_a_guarda': null, // Dato non dispoñible
  'pontevedra_a_illa_de_arousa': null, // Dato non dispoñible
  'pontevedra_lalin': 536,
  'pontevedra_a_lama': 217,
  'pontevedra_marin': 472,
  'pontevedra_meano': 629,
  'pontevedra_meis': 629,
  'pontevedra_moana': 472,
  'pontevedra_mondariz': 432,
  'pontevedra_mondariz_balneario': 432,
  'pontevedra_morana': 648,
  'pontevedra_mos': 497,
  'pontevedra_as_neves': 629,
  'pontevedra_nigran': 541,
  'pontevedra_oia': 402,
  'pontevedra_poio': 629,
  'pontevedra_ponteareas': 437,
  'pontevedra_ponte_caldelas': 629,
  'pontevedra_pontecesures': null, // Dato non dispoñible
  'pontevedra_pontevedra': 629,
  'pontevedra_o_porrino': 497,
  'pontevedra_portas': 629,
  'pontevedra_redondela': 69,
  'pontevedra_ribadumia': 629,
  'pontevedra_rodeiro': 536,
  'pontevedra_o_rosal': 629,
  'pontevedra_salceda_de_caselas': null, // Dato non dispoñible
  'pontevedra_salvaterra_de_mino': 437,
  'pontevedra_silleda': 536,
  'pontevedra_soutomaior': 64,
  'pontevedra_tomino': 629,
  'pontevedra_tui': 497,
  'pontevedra_valga': 629,
  'pontevedra_vigo': 541,
  'pontevedra_vilaboa': 629,
  'pontevedra_vilagarcia_de_arousa': 545,
  'pontevedra_vilanova_de_arousa': 672,

  // Valores por defecto para ubicaciones no especificadas
  'default': 629 // Valor más común en los datos
};

/**
 * Convierte un valor de una unidad a otra
 */
export function convertArea(
  value: number,
  fromUnit: string,
  toUnit: string,
  provincia?: string,
  municipio?: string
): number | null {
  // Si las unidades son iguales, no hay conversión
  if (fromUnit === toUnit) {
    return value;
  }

  // Convertir todo a metros cuadrados primero
  let valueInSquareMeters: number;

  switch (fromUnit) {
    case 'hectareas':
      valueInSquareMeters = value * 10000; // 1 hectárea = 10,000 m²
      break;
    case 'metros_cuadrados':
      valueInSquareMeters = value;
      break;
    case 'ferrados':
      if (provincia && municipio) {
        const locationKey = `${provincia.toLowerCase().replace(/\s+/g, '_')}_${municipio.toLowerCase().replace(/\s+/g, '_')}`;
        const ferradoEquivalence = FERRADOS_BY_LOCATION[locationKey];
        
        if (ferradoEquivalence === null) {
          return null; // No hay datos para este municipio
        }
        
        valueInSquareMeters = value * ferradoEquivalence; // ferrados * m²/ferrado
      } else {
        return null; // Necesitamos ubicación para ferrados
      }
      break;
    default:
      return null;
  }

  // Convertir de metros cuadrados a la unidad destino
  switch (toUnit) {
    case 'hectareas':
      return valueInSquareMeters / 10000; // m² / 10,000 = hectáreas
    case 'metros_cuadrados':
      return valueInSquareMeters;
    case 'ferrados':
      if (provincia && municipio) {
        const locationKey = `${provincia.toLowerCase().replace(/\s+/g, '_')}_${municipio.toLowerCase().replace(/\s+/g, '_')}`;
        const ferradoEquivalence = FERRADOS_BY_LOCATION[locationKey];
        
        if (ferradoEquivalence === null) {
          return null; // No hay datos para este municipio
        }
        
        return valueInSquareMeters / ferradoEquivalence; // m² / m²/ferrado = ferrados
      } else {
        return null; // Necesitamos ubicación para ferrados
      }
    default:
      return null;
  }
}

/**
 * Obtiene todas las conversiones para un valor dado
 */
export function getAllConversions(
  value: number,
  fromUnit: string,
  provincia?: string,
  municipio?: string
): Record<string, number | null> {
  const units = ['hectareas', 'metros_cuadrados', 'ferrados'];
  const conversions: Record<string, number | null> = {};

  units.forEach(unit => {
    if (unit !== fromUnit) {
      conversions[unit] = convertArea(value, fromUnit, unit, provincia, municipio);
    }
  });

  return conversions;
}

/**
 * Obtiene las equivalencias de ferrados para un municipio específico
 */
export function getFerradosEquivalence(provincia: string, municipio: string): number | null {
  const locationKey = `${provincia.toLowerCase().replace(/\s+/g, '_')}_${municipio.toLowerCase().replace(/\s+/g, '_')}`;
  return FERRADOS_BY_LOCATION[locationKey] ?? FERRADOS_BY_LOCATION.default;
}

/**
 * Formatea un número con la precisión apropiada según la unidad
 */
export function formatAreaValue(value: number, unit: string): string {
  switch (unit) {
    case 'hectareas':
      return value.toFixed(2);
    case 'metros_cuadrados':
      return Math.round(value).toLocaleString('es-ES');
    case 'ferrados':
      return value.toFixed(1);
    default:
      return value.toString();
  }
}

/**
 * Obtiene el símbolo o unidad de medida para mostrar
 */
export function getAreaUnitLabel(unit: string): string {
  switch (unit) {
    case 'hectareas':
      return 'ha';
    case 'metros_cuadrados':
      return 'm²';
    case 'ferrados':
      return 'ferrados';
    default:
      return unit;
  }
}

/**
 * Valida si un municipio tiene equivalencia específica de ferrados
 */
export function hasSpecificFerradosEquivalence(provincia: string, municipio: string): boolean {
  const locationKey = `${provincia.toLowerCase().replace(/\s+/g, '_')}_${municipio.toLowerCase().replace(/\s+/g, '_')}`;
  return locationKey in FERRADOS_BY_LOCATION && locationKey !== 'default';
}
