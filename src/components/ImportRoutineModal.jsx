// src/components/ImportRoutineModal.jsx
import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { parseRoutineText } from '../utils/routineImporter';
import StorageService from '../services/StorageService';

const ImportRoutineModal = ({ visible, onClose, onImportSuccess }) => {
  const [text, setText] = useState('');

  const handleImport = async () => {
    if (!text.trim()) return;

    try {
      const newRoutines = parseRoutineText(text);
      const daysFound = Object.keys(newRoutines).length;

      if (daysFound === 0) {
        Alert.alert('Error', 'No se detectaron días. Asegúrate de escribir "Día: Lunes", etc.');
        return;
      }

      // Obtener rutinas actuales
      const currentRoutines = await StorageService.getRoutines();
      
      let addedCount = 0; // Para contar cuántos ejercicios NUEVOS se agregaron realmente

      Object.keys(newRoutines).forEach(dayKey => {
        if (!currentRoutines[dayKey]) currentRoutines[dayKey] = [];

        // 1. Hacemos una lista de los nombres que YA existen (normalizados a minúsculas)
        const existingNames = new Set(
            currentRoutines[dayKey].map(ex => ex.nombre.toLowerCase().trim())
        );

        // 2. Filtramos los ejercicios nuevos: Solo pasan los que NO están en la lista
        const uniqueExercises = newRoutines[dayKey].filter(newEx => {
            const isDuplicate = existingNames.has(newEx.nombre.toLowerCase().trim());
            return !isDuplicate;
        });

        // 3. Agregamos solo los únicos
        if (uniqueExercises.length > 0) {
            currentRoutines[dayKey] = [...currentRoutines[dayKey], ...uniqueExercises];
            addedCount += uniqueExercises.length;
        }
      });

      await StorageService.saveRoutines(currentRoutines);
      
      // Mensaje feedback más útil
      if (addedCount > 0) {
          Alert.alert('¡Éxito!', `Se agregaron ${addedCount} ejercicios nuevos a tu rutina.`);
      } else {
          Alert.alert('Información', 'Tu rutina ya tenía todos estos ejercicios. No se agregaron duplicados.');
      }
      
      setText('');
      if (onImportSuccess) onImportSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al importar la rutina.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Importar Rutina 📋</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.instructions}>
            Pega tu rutina aquí. Usa este formato:
            {"\n\n"}
            Día: Lunes
            {"\n"}- Ejercicio | Series | Reps | Peso
          </Text>

          <TextInput
            style={styles.input}
            multiline
            placeholder="Pega tu rutina aquí..."
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />

          <TouchableOpacity style={globalStyles.button} onPress={handleImport}>
            <Text style={globalStyles.buttonText}>Procesar e Importar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  closeButton: {
    fontSize: 24,
    color: colors.gray500,
  },
  instructions: {
    fontSize: 14,
    color: colors.gray600,
    marginBottom: 10,
    backgroundColor: colors.gray100,
    padding: 10,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
});

export default ImportRoutineModal;