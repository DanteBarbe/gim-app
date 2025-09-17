import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  static STORAGE_KEY = '@GymRoutineApp:routines';

  // Obtener todas las rutinas
  static async getRoutines() {
    try {
      const jsonValue = await AsyncStorage.getItem(this.STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : this.getDefaultRoutines();
    } catch (error) {
      console.error('Error al obtener rutinas:', error);
      return this.getDefaultRoutines();
    }
  }

  // Guardar todas las rutinas
  static async saveRoutines(routines) {
    try {
      const jsonValue = JSON.stringify(routines);
      await AsyncStorage.setItem(this.STORAGE_KEY, jsonValue);
      return true;
    } catch (error) {
      console.error('Error al guardar rutinas:', error);
      return false;
    }
  }

  // Obtener rutina de un día específico
  static async getDayRoutine(dayKey) {
    try {
      const routines = await this.getRoutines();
      return routines[dayKey] || [];
    } catch (error) {
      console.error('Error al obtener rutina del día:', error);
      return [];
    }
  }

  // Agregar ejercicio a un día
  static async addExercise(dayKey, exercise) {
    try {
      const routines = await this.getRoutines();
      
      if (!routines[dayKey]) {
        routines[dayKey] = [];
      }

      const newExercise = {
        ...exercise,
        id: Date.now().toString(), // ID único basado en timestamp
        createdAt: new Date().toISOString(),
      };

      routines[dayKey].push(newExercise);
      await this.saveRoutines(routines);
      return newExercise;
    } catch (error) {
      console.error('Error al agregar ejercicio:', error);
      return null;
    }
  }

  // Actualizar ejercicio
  static async updateExercise(dayKey, exerciseId, updatedExercise) {
    try {
      const routines = await this.getRoutines();
      
      if (!routines[dayKey]) {
        return false;
      }

      const exerciseIndex = routines[dayKey].findIndex(ex => ex.id === exerciseId);
      
      if (exerciseIndex === -1) {
        return false;
      }

      routines[dayKey][exerciseIndex] = {
        ...routines[dayKey][exerciseIndex],
        ...updatedExercise,
        updatedAt: new Date().toISOString(),
      };

      await this.saveRoutines(routines);
      return true;
    } catch (error) {
      console.error('Error al actualizar ejercicio:', error);
      return false;
    }
  }

  // Eliminar ejercicio
  static async deleteExercise(dayKey, exerciseId) {
    try {
      const routines = await this.getRoutines();
      
      if (!routines[dayKey]) {
        return false;
      }

      routines[dayKey] = routines[dayKey].filter(ex => ex.id !== exerciseId);
      await this.saveRoutines(routines);
      return true;
    } catch (error) {
      console.error('Error al eliminar ejercicio:', error);
      return false;
    }
  }

  // Obtener rutinas por defecto (vacías)
  static getDefaultRoutines() {
    return {
      lunes: [],
      martes: [],
      miercoles: [],
      jueves: [],
      viernes: [],
      sabado: [],
    };
  }

  // Limpiar todos los datos (útil para desarrollo)
  static async clearAllData() {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error al limpiar datos:', error);
      return false;
    }
  }
}

export default StorageService;