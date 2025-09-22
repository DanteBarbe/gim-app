import {VALIDATION, ERROR_MESSAGES} from './constants';

// Validar datos del ejercicio
export const validateExercise = (exercise) => {
  const errors = {};

  // Validar nombre
  if (!exercise.nombre || exercise.nombre.trim() === '') {
    errors.nombre = ERROR_MESSAGES.EXERCISE_NAME_REQUIRED;
  } else if (exercise.nombre.trim().length < VALIDATION.MIN_EXERCISE_NAME_LENGTH) {
    errors.nombre = ERROR_MESSAGES.EXERCISE_NAME_TOO_SHORT;
  } else if (exercise.nombre.trim().length > VALIDATION.MAX_EXERCISE_NAME_LENGTH) {
    errors.nombre = ERROR_MESSAGES.EXERCISE_NAME_TOO_LONG;
  }

  // Validar series
  if (!exercise.series || exercise.series === '') {
    errors.series = ERROR_MESSAGES.SERIES_REQUIRED;
  } else {
    const series = parseInt(exercise.series);
    if (isNaN(series) || series < VALIDATION.MIN_SERIES || series > VALIDATION.MAX_SERIES) {
      errors.series = ERROR_MESSAGES.SERIES_INVALID;
    }
  }

  // Validar repeticiones
  if (!exercise.repeticiones || exercise.repeticiones.trim() === '') {
    errors.repeticiones = ERROR_MESSAGES.REPS_REQUIRED;
  }

  // Validar notas
  if (exercise.notas && exercise.notas.length > VALIDATION.MAX_NOTES_LENGTH) {
    errors.notas = ERROR_MESSAGES.NOTES_TOO_LONG;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Formatear peso para mostrar
export const formatWeight = (weight) => {
  if (weight === null || weight === undefined || weight === '') {
    return 'Sin peso';
  }

  const weightStr = String(weight).trim(); // convierte números a string y elimina espacios

  // Si ya tiene unidad, devolverlo tal como está
  if (weightStr.toLowerCase().includes('kg') || weightStr.toLowerCase().includes('lb')) {
    return weightStr;
  }

  // Si es solo número, agregar kg
  const numericWeight = parseFloat(weightStr);
  if (!isNaN(numericWeight)) {
    return `${numericWeight} kg`;
  }

  return weightStr;
};


// Formatear repeticiones para mostrar
export const formatReps = (reps) => {
  if (!reps || reps.trim() === '') {
    return '0';
  }
  return reps;
};

// Generar ID único
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Capitalizar primera letra
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Obtener emoji basado en el tipo de ejercicio
export const getExerciseEmoji = (exerciseName) => {
  const name = exerciseName.toLowerCase();
  
  if (name.includes('press') || name.includes('banco')) return '🏋️‍♂️';
  if (name.includes('sentadilla') || name.includes('squat')) return '🦵';
  if (name.includes('peso muerto') || name.includes('deadlift')) return '💪';
  if (name.includes('curl') || name.includes('bícep')) return '💪';
  if (name.includes('abdomen') || name.includes('plancha')) return '🔥';
  if (name.includes('cardio') || name.includes('correr')) return '🏃‍♂️';
  if (name.includes('remo') || name.includes('pull')) return '🚣‍♂️';
  
  return '💪'; // Emoji por defecto
};

// Comprimir texto para mostrar
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

// Convertir objeto de ejercicio a formato de guardado
export const sanitizeExercise = (exercise) => {
  return {
    nombre: exercise.nombre?.trim() || '',
    series: parseInt(exercise.series) || 0,
    repeticiones: exercise.repeticiones?.trim() || '',
    peso: parseFloat(exercise.peso) || 0,
    notas: exercise.notas?.trim() || '',
    imagen: exercise.imagen || null,
    tipo: exercise.tipo?.trim() || '',
    equipamiento: exercise.equipamiento?.trim() || '',
  };
};