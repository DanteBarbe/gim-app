import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
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
import { REP_RANGES } from '../utils/constants';

const ExerciseDetailScreen = ({navigation, route}) => {
  const {exercise, dayKey, onExerciseUpdated} = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(exercise);
  
  // Estados para edición inline
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  // Estados para modales
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
            {isEditing ? 'Cancelar' : 'Editar Todo'}
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
        setCurrentExercise({...currentExercise, ...sanitizedExercise});
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

  // Funciones para edición inline
  const startEditing = (field, currentValue) => {
    setEditingField(field);
    setEditValue(String(currentValue));
    setShowEditModal(true);
  };

  const cancelEditing = () => {
    setShowEditModal(false);
    setEditingField(null);
    setEditValue('');
  };

  const saveFieldEdit = async () => {
    if (!editingField || (editingField !== 'repeticiones' && editValue.trim() === '')) return;
    if (editingField === 'repeticiones' && !editValue) return;

    try {
      const updatedExercise = {
        ...currentExercise,
        [editingField]: editingField === 'peso' || editingField === 'series' 
          ? parseFloat(editValue) || 0
          : editingField === 'repeticiones'
          ? editValue // Para repeticiones, guardamos el string del rango
          : editValue.trim()
      };

      const sanitizedExercise = sanitizeExercise(updatedExercise);
      
      const success = await StorageService.updateExercise(
        dayKey,
        exercise.id,
        sanitizedExercise
      );
      
      if (success) {
        setCurrentExercise(updatedExercise);
        setShowEditModal(false);
        setEditingField(null);
        setEditValue('');
        
        const fieldNames = {
          nombre: 'nombre',
          series: 'series',
          repeticiones: 'repeticiones', 
          peso: 'peso',
          tipo: 'tipo',
          notas: 'notas'
        };
        
        setSuccessMessage(`${fieldNames[editingField]} actualizado correctamente`);
        setShowSuccessModal(true);
      } else {
        throw new Error('No se pudo actualizar el campo');
      }
    } catch (error) {
      console.error('Error al actualizar campo:', error);
      setErrorMessage('No se pudo actualizar el campo. Por favor intenta de nuevo.');
      setShowErrorModal(true);
      setShowEditModal(false);
    }
  };

  const getFieldLabel = (field) => {
    const labels = {
      nombre: 'Nombre del ejercicio',
      series: 'Series',
      repeticiones: 'Repeticiones',
      peso: 'Peso (kg)',
      tipo: 'Tipo de ejercicio',
      notas: 'Notas'
    };
    return labels[field] || field;
  };

  if (isEditing) {
    return (
      <View style={globalStyles.container}>
        <ExerciseForm
          initialData={currentExercise}
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

        {/* Header con nombre y tipo */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <View style={styles.fieldRow}>
              <View style={styles.fieldContent}>
                <Text style={styles.exerciseName}>{currentExercise.nombre}</Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => startEditing('nombre', currentExercise.nombre)}
                activeOpacity={0.7}>
                <Text style={styles.editIcon}>✏️</Text>
              </TouchableOpacity>
            </View>
            
            {currentExercise.tipo && (
              <View style={styles.fieldRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{currentExercise.tipo}</Text>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => startEditing('tipo', currentExercise.tipo)}
                  activeOpacity={0.7}>
                  <Text style={styles.editIcon}>✏️</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Stats con edición inline */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{currentExercise.series}</Text>
                  <Text style={styles.statLabel}>Series</Text>
                </View>
                <TouchableOpacity
                  style={styles.editButtonStat}
                  onPress={() => startEditing('series', currentExercise.series)}
                  activeOpacity={0.7}>
                  <Text style={styles.editIconSmall}>✏️</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{formatReps(currentExercise.repeticiones)}</Text>
                  <Text style={styles.statLabel}>Repeticiones</Text>
                </View>
                <TouchableOpacity
                  style={styles.editButtonStat}
                  onPress={() => startEditing('repeticiones', currentExercise.repeticiones)}
                  activeOpacity={0.7}>
                  <Text style={styles.editIconSmall}>✏️</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{formatWeight(currentExercise.peso)}</Text>
                  <Text style={styles.statLabel}>Peso</Text>
                </View>
                <TouchableOpacity
                  style={styles.editButtonStat}
                  onPress={() => startEditing('peso', currentExercise.peso)}
                  activeOpacity={0.7}>
                  <Text style={styles.editIconSmall}>✏️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Notas con edición inline */}
        {currentExercise.notas && (
          <View style={styles.notesSection}>
            <View style={styles.fieldRow}>
              <Text style={styles.sectionTitle}>Notas</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => startEditing('notas', currentExercise.notas)}
                activeOpacity={0.7}>
                <Text style={styles.editIcon}>✏️</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>{currentExercise.notas}</Text>
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

      {/* Modal de edición inline */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showEditModal}
        onRequestClose={cancelEditing}>
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContainer}>
            <Text style={styles.editModalTitle}>
              Editar {getFieldLabel(editingField)}
            </Text>
            
            {editingField === 'repeticiones' ? (
              // Selector para repeticiones
              <View style={styles.repOptionsContainer}>
                {REP_RANGES.map((range, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.repOption,
                      editValue === range && styles.repOptionSelected
                    ]}
                    onPress={() => setEditValue(range)}
                    activeOpacity={0.7}>
                    <Text style={[
                      styles.repOptionText,
                      editValue === range && styles.repOptionTextSelected
                    ]}>
                      {range}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              // Input normal para otros campos
              <TextInput
                style={styles.editInput}
                value={editValue}
                onChangeText={setEditValue}
                placeholder={`Ingresa ${getFieldLabel(editingField)}`}
                keyboardType={
                  editingField === 'peso' || editingField === 'series'
                    ? 'numeric'
                    : 'default'
                }
                multiline={editingField === 'notas'}
                numberOfLines={editingField === 'notas' ? 4 : 1}
                autoFocus
              />
            )}
            
            <View style={styles.editModalButtons}>
              <TouchableOpacity
                style={[styles.editModalButton, styles.cancelButton]}
                onPress={cancelEditing}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.editModalButton, styles.saveButton]}
                onPress={saveFieldEdit}
                disabled={editingField === 'repeticiones' && !editValue}>
                <Text style={[
                  styles.saveButtonText,
                  editingField === 'repeticiones' && !editValue && styles.disabledButtonText
                ]}>
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modales */}
      <ConfirmModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar Ejercicio"
        message={`¿Estás seguro de que quieres eliminar "${currentExercise.nombre}"?`}
        onConfirm={handleConfirmDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="¡Actualizado!"
        message={successMessage}
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
  headerInfo: {
    padding: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fieldContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
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
  editButton: {
    padding: 8,
    marginHorizontal: 8,
  },
  editIcon: {
    fontSize: 16,
  },
  editButtonStat: {
    marginHorizontal: 10,
    padding: 4,
  },
  editIconSmall: {
    fontSize: 12,
  },
  statsSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
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
    position: 'relative',
    ...globalStyles.shadow,
  },
  statHeader: {
    width: '100%',
    alignItems: 'center',
  },
  statContent: {
    alignItems: 'center',
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
  // Estilos del modal de edición
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  editModalContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  editInput: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  editModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.gray200,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: colors.gray400,
  },
  // Estilos para selector de repeticiones
  repOptionsContainer: {
    marginBottom: 20,
  },
  repOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
  },
  repOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  repOptionText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  repOptionTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
});

export default ExerciseDetailScreen;