// src/utils/routineImporter.js
import { DAYS } from './constants';

export const parseRoutineText = (text) => {
  const lines = text.split('\n');
  const routines = {};
  let currentDayKey = null;

  // Normalizar texto para facilitar búsqueda
  const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // 1. Detectar Día (ej: "Día: Lunes" o "Lunes:")
    if (trimmedLine.toLowerCase().includes('día') || trimmedLine.includes(':')) {
      const dayName = normalize(trimmedLine);
      // Buscar qué key corresponde (lunes, martes, etc)
      const foundDay = DAYS.find(d => dayName.includes(normalize(d.name)));
      
      if (foundDay) {
        currentDayKey = foundDay.key;
        routines[currentDayKey] = []; // Inicializar array para ese día
        return;
      }
    }

    // 2. Detectar Ejercicio (ej: "- Press Banca | 4 | 10")
    if (currentDayKey && (trimmedLine.startsWith('-') || trimmedLine.startsWith('•'))) {
      const parts = trimmedLine.replace(/^[-•]\s*/, '').split('|').map(p => p.trim());
      
      // Formato esperado: Nombre | Series | Reps | Peso | Notas
      const exercise = {
        id: Date.now().toString() + Math.random().toString().slice(2, 5), // ID temporal único
        nombre: parts[0] || 'Ejercicio sin nombre',
        series: parts[1] || '4',
        repeticiones: parts[2] || '10',
        peso: parts[3] || '',
        notas: parts[4] || '',
        createdAt: new Date().toISOString(),
      };

      routines[currentDayKey].push(exercise);
    }
  });

  return routines;
};