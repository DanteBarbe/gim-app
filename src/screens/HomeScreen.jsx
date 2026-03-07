import { React, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import DayButton from '../components/DayButton';
import { globalStyles } from '../styles/globalStyles';
import { DAYS as days } from '../utils/constants'
import ImportRoutineModal from '../components/ImportRoutineModal';
import StorageService from '../services/StorageService';

const HomeScreen = ({navigation}) => {

  const [importModalVisible, setImportModalVisible] = useState(false);

  const handleDayPress = (day) => {
    navigation.navigate('DayRoutine', {
      day: day.name,
      dayKey: day.key,
    });
  };

  const handleExport = async () => {
    try {
      const routines = await StorageService.getRoutines();
      let exportText = '';

      // Iterar sobre los días para generar el texto en el mismo formato de importación
      for (const [dayKey, exercises] of Object.entries(routines)) {
        if (exercises && exercises.length > 0) {
          const dayNameCapitalized = dayKey.charAt(0).toUpperCase() + dayKey.slice(1);
          exportText += `Día: ${dayNameCapitalized}\n`;
          
          exercises.forEach(ex => {
            // Formato: - Nombre | Series | Reps | Peso | Tipo | Notas
            exportText += `- ${ex.nombre} | ${ex.series} | ${ex.repeticiones} | ${ex.peso || ''} | ${ex.tipo || ''} | ${ex.notas || ''}\n`;
          });
          exportText += '\n'; // Espacio entre días
        }
      }

      if (!exportText.trim()) {
        Alert.alert('Rutina vacía', 'No hay ejercicios para exportar.');
        return;
      }

      await Share.share({
        message: exportText,
        title: 'Mi Rutina de Gimnasio'
      });
    } catch (error) {
      console.error('Error exportando rutina:', error);
      Alert.alert('Error', 'Hubo un problema al exportar la rutina.');
    }
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={globalStyles.title}>¡Bienvenido a tu gimnasio!</Text>

          <View style={{flexDirection: 'row', gap: 10}}>
              <TouchableOpacity
                style={styles.importButton}
                onPress={() => setImportModalVisible(true)}
              >
                <Text style={styles.importButtonText}>Importar Rutina</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.importButton, { borderColor: '#4CAF50', backgroundColor: '#E8F5E9' }]}
                onPress={handleExport}
              >
                <Text style={[styles.importButtonText, { color: '#2E7D32' }]}>Exportar Rutina</Text>
              </TouchableOpacity>
            </View>
            
          <Text style={globalStyles.textSecondary}>
            Selecciona el día para ver tu rutina
          </Text>
        </View>
        
        <View style={styles.daysContainer}>
          {days.map((day) => (
            <DayButton
              key={day.key}
              day={day}
              onPress={() => handleDayPress(day)}
            />
          ))}
        </View>
      </ScrollView>

      <ImportRoutineModal
      visible={importModalVisible}
      onClose={() => setImportModalVisible(false)}
      onImportSuccess={() => setImportModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  importButton: {
    backgroundColor: '#E3F2FD', // Un azul muy clarito
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  importButtonText: {
    color: '#1976D2',
    fontWeight: '600',
    fontSize: 14,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  daysContainer: {
    paddingHorizontal: 8,
  },
});

export default HomeScreen;