import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {colors} from '../styles/colors';
import {globalStyles} from '../styles/globalStyles';

const DayButton = ({day, onPress}) => {
  return (
    <TouchableOpacity
      style={[globalStyles.card, styles.button]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <Text style={styles.icon}>{day.icon}</Text>
        <Text style={styles.dayName}>{day.name}</Text>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 6,
    backgroundColor: colors.white,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 24,
    marginRight: 16,
  },
  dayName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  arrow: {
    fontSize: 24,
    color: colors.gray400,
    fontWeight: 'bold',
  },
});

export default DayButton;