import React, { useState} from 'react';
import {View} from 'react-native';
import ExerciseForm from '../components/ExerciseForm';
import StorageService from '../services/StorageService';
import {globalStyles} from '../styles/globalStyles';
import {sanitizeExercise} from '../utils/helpers';
import SuccessModal from '../components/SuccessModal';
import ConfirmModal from '../components/ConfirmModal';
import CustomModal from '../components/CustomModal';

const AddExerciseScreen = ({navigation, route}) => {
  const {day, dayKey, onExerciseAdded} = route.params;

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [savedExercise, setSavedExercise] = useState(null);

  const handleSave = async (exerciseData) => {
    try {
      // Sanitizar y validar datos
      const sanitizedExercise = sanitizeExercise(exerciseData);
      
      // NUEVO: Inicializar historial con el primer peso
      sanitizedExercise.history = [{
        date: new Date().toISOString(),
        weight: sanitizedExercise.peso || 0
      }];
      
      // Guardar ejercicio
      const newExercise = await StorageService.addExercise(dayKey, sanitizedExercise);
      
      if (newExercise) {
        setSavedExercise(sanitizedExercise);
        setSuccessModalVisible(true);
      } else {
        throw new Error('No se pudo guardar el ejercicio');
      }
    } catch (error) {
      console.error('Error al guardar ejercicio:', error);
      setErrorModalVisible(true);
    }
  };

  const handleCancel = () => {
    setConfirmModalVisible(true);
  };

  const handleSuccessConfirm = () => {
    setSuccessModalVisible(false);
    // Actualizar la lista en la pantalla anterior
    if (onExerciseAdded) {
      onExerciseAdded();
    }
    // Volver a la pantalla anterior
    navigation.goBack();
  };

  const handleCancelConfirm = () => {
    setConfirmModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={globalStyles.container}>
      <ExerciseForm
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {/* Modal de éxito */}
      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title="¡Ejercicio guardado! 💪"
        message={
          savedExercise 
            ? `${savedExercise.nombre} se agregó a tu rutina de ${day}` 
            : `El ejercicio se agregó a tu rutina de ${day}`
        }
        buttonText="OK"
        onButtonPress={handleSuccessConfirm}
      />

      {/* Modal de confirmación para cancelar */}
      <ConfirmModal
        visible={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        title="Cancelar"
        message="¿Estás seguro de que quieres cancelar? Se perderán los cambios."
        onConfirm={handleCancelConfirm}
        confirmText="Sí, cancelar"
        cancelText="Continuar editando"
        type="warning"
      />

      {/* Modal de error */}
      <CustomModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        title="Error"
        message="No se pudo guardar el ejercicio. Por favor intenta de nuevo."
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

export default AddExerciseScreen;