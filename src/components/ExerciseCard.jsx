import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {colors} from '../styles/colors';
import {globalStyles} from '../styles/globalStyles';

const ExerciseCard = ({exercise, onPress, onDelete, completedSets, totalSets, onSetToggle}) => {
  const handleLongPress = () => {
    Alert.alert(
      'Opciones',
      '¿Qué quieres hacer con este ejercicio?',
      [
        {text: 'Ver Detalles', onPress: onPress},
        {text: 'Eliminar', style: 'destructive', onPress: onDelete},
        {text: 'Cancelar', style: 'cancel'},
      ]
    );
  };

  const renderSetIndicators = () => {
    if (!totalSets) return null;
    let bubbles = [];
    for (let i = 0; i < totalSets; i++) {
      const isCompleted = i < completedSets;
      bubbles.push(
        <View 
          key={i} 
          style={[styles.setBubble, isCompleted && styles.setBubbleActive]} 
        />
      );
    }
    
    // Si está completo mostramos un check verde para el ejercicio
    const isExerciseFinished = completedSets >= totalSets;

    return (
      <TouchableOpacity 
        style={styles.setsProgressContainer} 
        onPress={(e) => {
          e.stopPropagation(); // Evita que se dispare el onPress del Card entero
          onSetToggle();
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.setsProgressLabel}>Series:</Text>
        <View style={styles.bubblesContainer}>
          {bubbles}
        </View>
        {isExerciseFinished && <Text style={{marginLeft: 8, fontSize: 16}}>✅</Text>}
      </TouchableOpacity>
    );
  };
    
  return (
    <TouchableOpacity
      style={[globalStyles.card, styles.card]}
      onPress={onPress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}>
      
      <View style={styles.header}>
        <Text style={styles.exerciseName}>{exercise.nombre}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Series</Text>
          <Text style={styles.statValue}>{exercise.series}</Text>
        </View>
        
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Reps</Text>
          <Text style={styles.statValue}>{exercise.repeticiones}</Text>
        </View>
        
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Peso</Text>
          <Text style={styles.statValue}>{exercise.peso || 'N/A'}</Text>
        </View>
      </View>

      {renderSetIndicators()}
      
      {exercise.notas && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notas:</Text>
          <Text style={styles.notesText} numberOfLines={2}>
            {exercise.notas}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  notesLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
    setsProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  setsProgressLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    marginRight: 10,
  },
  bubblesContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  setBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray300,
    backgroundColor: 'transparent',
  },
  setBubbleActive: {
    backgroundColor: colors.success || '#4CAF50', // Agrega este color a tu archivo colors si no está
    borderColor: colors.success || '#4CAF50',
  },
  cardCompleted: {
    opacity: 0.8,
    backgroundColor: '#FAFAFA'
  },
  exerciseNameCompleted: {
    textDecorationLine: 'line-through',
    color: colors.gray400
  }
})

export default ExerciseCard;