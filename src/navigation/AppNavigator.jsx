import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DayRoutineScreen from '../screens/DayRoutineScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import AddExerciseScreen from '../screens/AddExerciseScreen';
import {colors} from '../styles/colors';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{title: 'Mis Rutinas'}}
      />
      <Stack.Screen 
        name="DayRoutine" 
        component={DayRoutineScreen}
        options={({route}) => ({title: route.params.day})}
      />
      <Stack.Screen 
        name="ExerciseDetail" 
        component={ExerciseDetailScreen}
        options={{title: 'Detalle del Ejercicio'}}
      />
      <Stack.Screen 
        name="AddExercise" 
        component={AddExerciseScreen}
        options={{title: 'Nuevo Ejercicio'}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;