import React from 'react';
import CustomModal from './CustomModal';

const OptionsModal = ({
  visible,
  onClose,
  title,
  message,
  options = [],
}) => {
  const buttons = [
    ...options,
    {
      text: 'Cancelar',
      style: 'cancel',
    },
  ];

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title={title}
      message={message}
      buttons={buttons}
      type="default"
    />
  );
};

export default OptionsModal;