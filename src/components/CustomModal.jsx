import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback,
} from 'react-native';
import {colors} from '../styles/colors';
import {globalStyles} from '../styles/globalStyles';

const CustomModal = ({
  visible,
  onClose,
  title,
  message,
  buttons = [],
  type = 'default', // 'success', 'error', 'warning', 'default'
}) => {
  const getIconForType = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return '💪';
    }
  };

  const getColorForType = () => {
    switch (type) {
      case 'success':
        return colors.success || '#4CAF50';
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning || '#FF9800';
      default:
        return colors.primary;
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Header with icon */}
              <View style={[styles.header, { backgroundColor: getColorForType() }]}>
                <Text style={styles.icon}>{getIconForType()}</Text>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
              </View>

              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      button.style === 'destructive' && styles.destructiveButton,
                      button.style === 'cancel' && styles.cancelButton,
                      index === buttons.length - 1 && styles.lastButton,
                    ]}
                    onPress={() => {
                      if (button.onPress) {
                        button.onPress();
                      }
                      onClose();
                    }}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.buttonText,
                        button.style === 'destructive' && styles.destructiveButtonText,
                        button.style === 'cancel' && styles.cancelButtonText,
                      ]}>
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    minWidth: 280,
    maxWidth: 400,
    width: '90%',
    overflow: 'hidden',
    ...globalStyles.shadow,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    alignItems: 'center',
  },
  lastButton: {
    borderBottomWidth: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  destructiveButton: {
    backgroundColor: colors.error + '10',
  },
  destructiveButtonText: {
    color: colors.error,
  },
  cancelButton: {
    backgroundColor: colors.gray100,
  },
  cancelButtonText: {
    color: colors.textSecondary,
  },
});

export default CustomModal;


