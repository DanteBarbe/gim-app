import React, {useState} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import ExerciseForm from '../components/ExerciseForm';
import StorageService from '../services/StorageService';
import {globalStyles} from '../styles/globalStyles';
import {colors} from '../styles/colors';
import CustomModal from '../components/CustomModal';
import ConfirmModal from '../components/ConfirmModal';
import SuccessModal from '../components/SuccessModal';
import {
  formatWeight,
  formatReps,
  sanitizeExercise,
} from '../utils/helpers';

const ExerciseDetailScreen = ({navigation, route}) => {
  const {exercise, dayKey, onExerciseUpdated} = route.params;
  const [isEditing, setIsEditing] = useState(false);

   const [showSuccessModal, setShowSuccessModal] = useState(false);
   const [showErrorModal, setShowErrorModal] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [successMessage, setSuccessMessage] = useState('');
   const [errorMessage, setErrorMessage] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setIsEditing(!isEditing)}
          activeOpacity={0.7}>
          <Text style={styles.headerButtonText}>
            {isEditing ? 'Cancelar' : 'Editar'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditing]);

  const handleSave = async (updatedData) => {
    try {
      const sanitizedExercise = sanitizeExercise(updatedData);
      
      const success = await StorageService.updateExercise(
        dayKey,
        exercise.id,
        sanitizedExercise
      );
      
      if (success) {
        setSuccessMessage(`${sanitizedExercise.nombre} se actualizó correctamente`);
        setShowSuccessModal(true);
      } else {
        throw new Error('No se pudo actualizar el ejercicio');
      }
    } catch (error) {
      console.error('Error al actualizar ejercicio:', error);
      setErrorMessage('No se pudo actualizar el ejercicio. Por favor intenta de nuevo.');
      setShowErrorModal(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const success = await StorageService.deleteExercise(dayKey, exercise.id);
    if (success) {
      if (onExerciseUpdated) {
        onExerciseUpdated();
      }
      navigation.goBack();
    } else {
      setErrorMessage('No se pudo eliminar el ejercicio');
      setShowErrorModal(true);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setIsEditing(false);
    if (onExerciseUpdated) {
      onExerciseUpdated();
    }
  };

  if (isEditing) {
    return (
      <View style={globalStyles.container}>
        <ExerciseForm
          initialData={exercise}
          onSave={handleSave}
          onCancel={handleCancel}
        />
        
        {/* Modales */}
        <SuccessModal
          visible={showSuccessModal}
          onClose={handleSuccessModalClose}
          title="¡Ejercicio actualizado!"
          message={successMessage}
          onButtonPress={handleSuccessModalClose}
        />
        
        <CustomModal
          visible={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          title="Error"
          message={errorMessage}
          type="error"
          buttons={[{ text: 'OK' }]}
        />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.exerciseName}>{exercise.nombre}</Text>
            {exercise.tipo && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{exercise.tipo}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{exercise.series}</Text>
              <Text style={styles.statLabel}>Series</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatReps(exercise.repeticiones)}</Text>
              <Text style={styles.statLabel}>Repeticiones</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatWeight(exercise.peso)}</Text>
              <Text style={styles.statLabel}>Peso</Text>
            </View>
          </View>
        </View>

        {/* Notas */}
        {exercise.notas && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>{exercise.notas}</Text>
            </View>
          </View>
        )}

        {/* Botón de eliminar */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}>
          <Text style={styles.deleteButtonText}>Eliminar Ejercicio</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modales */}
      <ConfirmModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar Ejercicio"
        message={`¿Estás seguro de que quieres eliminar "${exercise.nombre}"?`}
        onConfirm={handleConfirmDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message={errorMessage}
        type="error"
        buttons={[{ text: 'OK' }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    marginRight: 16,
  },
  headerButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    ...globalStyles.shadow,
  },
  placeholderText: {
    fontSize: 32,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerInfo: {
    padding: 16,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  statsSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    flex: 1,
    ...globalStyles.shadow,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  infoSection: {
    margin: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  notesSection: {
    margin: 16,
  },
  notesContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    ...globalStyles.shadow,
  },
  notesText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  deleteButton: {
    backgroundColor: colors.error,
    marginHorizontal: 16,
    marginBottom: 32,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExerciseDetailScreen;