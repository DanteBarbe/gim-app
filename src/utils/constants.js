// Días de la semana
export const DAYS = [
    {key: 'lunes', name: 'Lunes', icon: '💪'},
    {key: 'martes', name: 'Martes', icon: '🏋️‍♂️'},
    {key: 'miercoles', name: 'Miércoles', icon: '🔥'},
    {key: 'jueves', name: 'Jueves', icon: '💯'},
    {key: 'viernes', name: 'Viernes', icon: '⚡'},
    {key: 'sabado', name: 'Sábado', icon: '🎯'},
  ];

// Tipos de ejercicio comunes
export const EXERCISE_TYPES = [
  'Pecho',
  'Espalda',
  'Piernas',
  'Hombros',
  'Brazos',
  'Bíceps',
  'Tríceps',
  'Abdomen',
  'Cardio',
  'Funcional',
];

// Rangos de repeticiones sugeridos
export const REP_RANGES = [
  '1-3',
  '4-6',
  '6-8',
  '8-10',
  '10-12',
  '12-15',
  '15-20',
  'Al fallo',
];

// Configuración de validación
export const VALIDATION = {
  MIN_EXERCISE_NAME_LENGTH: 2,
  MAX_EXERCISE_NAME_LENGTH: 50,
  MIN_SERIES: 1,
  MAX_SERIES: 20,
  MIN_REPS: 1,
  MAX_REPS: 999,
  MAX_NOTES_LENGTH: 200,
};

// Mensajes de error
export const ERROR_MESSAGES = {
  EXERCISE_NAME_REQUIRED: 'El nombre del ejercicio es obligatorio',
  EXERCISE_NAME_TOO_SHORT: `El nombre debe tener al menos ${VALIDATION.MIN_EXERCISE_NAME_LENGTH} caracteres`,
  EXERCISE_NAME_TOO_LONG: `El nombre no puede tener más de ${VALIDATION.MAX_EXERCISE_NAME_LENGTH} caracteres`,
  SERIES_REQUIRED: 'El número de series es obligatorio',
  SERIES_INVALID: `Las series deben estar entre ${VALIDATION.MIN_SERIES} y ${VALIDATION.MAX_SERIES}`,
  REPS_REQUIRED: 'Las repeticiones son obligatorias',
  NOTES_TOO_LONG: `Las notas no pueden tener más de ${VALIDATION.MAX_NOTES_LENGTH} caracteres`,
  SAVE_ERROR: 'Error al guardar el ejercicio',
  LOAD_ERROR: 'Error al cargar los datos',
};

// Configuración de la app
export const APP_CONFIG = {
  STORAGE_VERSION: '1.0.0',
  AUTO_SAVE_DELAY: 1000, // milisegundos
};