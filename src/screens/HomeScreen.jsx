import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import DayButton from '../components/DayButton';
import {globalStyles} from '../styles/globalStyles';
import { DAYS as days } from '../utils/constants'

const HomeScreen = ({navigation}) => {

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
          <Text style={globalStyles.title}>¡Bienvenido a tu gimnasio! 🏋️‍♀️</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
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