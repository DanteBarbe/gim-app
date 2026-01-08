import React, {useState, useCallback, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import ExerciseCard from '../components/ExerciseCard';
import StorageService from '../services/StorageService';
import {globalStyles} from '../styles/globalStyles';
import {colors} from '../styles/colors';
import ConfirmModal from '../components/ConfirmModal';
import CustomModal from '../components/CustomModal';

const DayRoutineScreen = ({navigation, route}) => {
  const {day, dayKey} = route.params;
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const loadExercises = async () => {
    try {
      const dayExercises = await StorageService.getDayRoutine(dayKey);
      setExercises(dayExercises);
    } catch (error) {
      console.error('Error al cargar ejercicios:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadExercises();
    }, [dayKey])
  );

  const handleAddExercise = () => {
    navigation.navigate('AddExercise', {
      day,
      dayKey,
      onExerciseAdded: loadExercises,
    });
  };

  const handleExercisePress = (exercise) => {
    navigation.navigate('ExerciseDetail', {
      exercise,
      day,
      dayKey,
      onExerciseUpdated: loadExercises,
    });
  };

  const handleDeleteExercise = (exerciseId) => {
    // Encontrar el ejercicio para mostrar su nombre en el modal
    const exercise = exercises.find(ex => ex.id === exerciseId);
    setExerciseToDelete({ id: exerciseId, exercise });
    setDeleteModalVisible(true);
  };

  const confirmDeleteExercise = async () => {
    if (!exerciseToDelete) return;
    
    try {
      const success = await StorageService.deleteExercise(dayKey, exerciseToDelete.id);
      if (success) {
        setDeleteModalVisible(false);
        setExerciseToDelete(null);
        loadExercises();
      } else {
        setDeleteModalVisible(false);
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error('Error al eliminar ejercicio:', error);
      setDeleteModalVisible(false);
      setErrorModalVisible(true);
    }
  };

  const renderExercise = ({item}) => (
    <ExerciseCard
      exercise={item}
      onPress={() => handleExercisePress(item)}
      onDelete={() => handleDeleteExercise(item.id)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>💪</Text>
      <Text style={globalStyles.subtitle}>No hay ejercicios para {day}</Text>
      <Text style={globalStyles.textSecondary}>
        Agrega tu primer ejercicio para comenzar tu rutina
      </Text>
    </View>
  );

  return (
    
    <View style={globalStyles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerTitle}>⏱️ Descanso</Text>
        <Text style={styles.timerValue}>{formatTime(timerSeconds)}</Text>
        
        <View style={styles.timerControls}>
          <TouchableOpacity 
            style={[styles.timerButton, isTimerRunning ? styles.pauseBtn : styles.playBtn]} 
            onPress={toggleTimer}
          >
            <Text style={styles.timerButtonText}>
              {isTimerRunning ? 'Pausar' : 'Iniciar'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.timerButton, styles.resetBtn]} onPress={resetTimer}>
            <Text style={styles.timerButtonText}>Reiniciar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={exercises}
        renderItem={renderExercise}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddExercise}
        activeOpacity={0.8}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Modal de confirmación para eliminar ejercicio */}
      <ConfirmModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setExerciseToDelete(null);
        }}
        title="Eliminar Ejercicio"
        message={
          exerciseToDelete?.exercise 
            ? `¿Estás seguro de que quieres eliminar "${exerciseToDelete.exercise.nombre}" de tu rutina?`
            : "¿Estás seguro de que quieres eliminar este ejercicio?"
        }
        onConfirm={confirmDeleteExercise}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="error"
      />

      {/* Modal de error */}
      <CustomModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        title="Error"
        message="No se pudo eliminar el ejercicio. Por favor intenta de nuevo."
        buttons={[
          {
            text: 'OK',
            onPress: () => setErrorModalVisible(false),
          },
        ]}
        type="error"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabIcon: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
   timerContainer: {
    backgroundColor: colors.white,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timerTitle: {
    fontSize: 16,
    color: colors.gray600,
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    fontVariant: ['tabular-nums'], // Evita que los números "bailen" al cambiar
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  timerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  playBtn: { backgroundColor: colors.success }, // Asegúrate de tener este color o usa '#4CAF50'
  pauseBtn: { backgroundColor: '#FF9800' },
  resetBtn: { backgroundColor: colors.gray400 },
  timerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default DayRoutineScreen;