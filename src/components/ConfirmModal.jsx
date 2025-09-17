import React from 'react';
import CustomModal from './CustomModal';

const ConfirmModal = ({
  visible,
  onClose,
  title,
  message,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
}) => {
  const buttons = [
    {
      text: cancelText,
      style: 'cancel',
      onPress: () => {
        // Solo cerrar el modal
      },
    },
    {
      text: confirmText,
      style: 'destructive',
      onPress: onConfirm,
    },
  ];

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title={title}
      message={message}
      buttons={buttons}
      type={type}
    />
  );
};

export default ConfirmModal;