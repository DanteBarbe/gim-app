import { React, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import DayButton from '../components/DayButton';
import { globalStyles } from '../styles/globalStyles';
import { DAYS as days } from '../utils/constants'
import ImportRoutineModal from '../components/ImportRoutineModal';

const HomeScreen = ({navigation}) => {

  const [importModalVisible, setImportModalVisible] = useState(false);

  const handleDayPress = (day) => {
    navigation.navigate('DayRoutine', {
      day: day.name,
      dayKey: day.key,
    });
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={globalStyles.title}>¡Bienvenido a tu gimnasio!</Text>

          <TouchableOpacity
          style={styles.importButton}
          onPress={() => setImportModalVisible(true)}
          >
            <Text style={globalStyles.textPrimary}>Importar Rutina</Text>
          </TouchableOpacity>

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