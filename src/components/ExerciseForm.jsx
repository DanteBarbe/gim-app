import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import {colors} from '../styles/colors';
import {globalStyles} from '../styles/globalStyles';
import {validateExercise} from '../utils/helpers';
import {EXERCISE_TYPES, REP_RANGES} from '../utils/constants';

const ExerciseForm = ({initialData, onSave, onCancel}) => {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    series: initialData?.series?.toString() || '',
    repeticiones: initialData?.repeticiones || '',
    peso: initialData?.peso || '',
    notas: initialData?.notas || '',
    tipo: initialData?.tipo || '',
  });

  const [errors, setErrors] = useState({});
  const [showTypeOptions, setShowTypeOptions] = useState(false);
  const [showRepOptions, setShowRepOptions] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleSave = () => {
    const validation = validateExercise(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      Alert.alert('Error de validación', 'Por favor corrige los errores en el formulario');
      return;
    }

    onSave(formData);
  };

  const renderInput = (
    label,
    field,
    placeholder,
    options = {}
  ) => {
    const hasError = errors[field];
    
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[
            globalStyles.input,
            hasError && styles.inputError,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.gray400}
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          {...options}
        />
        {hasError && (
          <Text style={styles.errorText}>{hasError}</Text>
        )}
      </View>
    );
  };

  const renderSelectButton = (
  label,
  field,
  placeholder,
  options,
  showOptions,
  setShowOptions
) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>

      {/* Botón para abrir modal */}
      <TouchableOpacity
        style={[globalStyles.input, styles.selectButton]}
        onPress={() => setShowOptions(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.selectButtonText,
            !formData[field] && styles.placeholderText,
          ]}
        >
          {formData[field] || placeholder}
        </Text>
        <Text style={styles.selectArrow}>
          ▼
        </Text>
      </TouchableOpacity>

      {/* Modal para opciones */}
      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowOptions(false)}
        >
          <View style={styles.modalContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.option}
                onPress={() => {
                  handleInputChange(field, option);
                  setShowOptions(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        {renderInput(
          'Nombre del Ejercicio *',
          'nombre',
          'Ej: Press de Banca'
        )}

        {renderSelectButton(
          'Tipo de Ejercicio',
          'tipo',
          'Seleccionar tipo',
          EXERCISE_TYPES,
          showTypeOptions,
          setShowTypeOptions
        )}

        <View style={styles.row}>
          {renderInput(
            'Series *',
            'series',
            '4',
            {keyboardType: 'numeric', maxLength: 2}
          )}
          
          {renderSelectButton(
            'Repeticiones *',
            'repeticiones',
            'Ej: 8-10',
            REP_RANGES,
            showRepOptions,
            setShowRepOptions
          )}
        </View>

        <View style={styles.row}>
          {renderInput(
            'Peso',
            'peso',
            'Ej: 80kg o 80',
            {keyboardType: 'default'}
          )}
        </View>

        {renderInput(
          'Notas',
          'notas',
          'Observaciones, técnica, etc.',
          {
            multiline: true,
            numberOfLines: 3,
            textAlignVertical: 'top',
            maxLength: 200,
          }
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[globalStyles.button, styles.cancelButton]}
            onPress={onCancel}
            activeOpacity={0.7}>
            <Text style={[globalStyles.buttonText, styles.cancelButtonText]}>
              Cancelar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[globalStyles.button, styles.saveButton]}
            onPress={handleSave}
            activeOpacity={0.7}>
            <Text style={globalStyles.buttonText}>
              {initialData ? 'Actualizar' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  placeholderText: {
    color: colors.gray400,
  },
  selectArrow: {
    fontSize: 12,
    color: colors.gray400,
    marginLeft: 8,
  },
  optionsContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.gray300,
  },
  cancelButtonText: {
    color: colors.text,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.3)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContainer: {
  backgroundColor: colors.white,
  borderRadius: 8,
  width: '80%',
  paddingVertical: 8,
  borderWidth: 1,
  borderColor: colors.gray300,
},

});

export default ExerciseForm;