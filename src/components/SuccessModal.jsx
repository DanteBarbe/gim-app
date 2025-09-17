import React from 'react';
import CustomModal from './CustomModal';

const SuccessModal = ({
  visible,
  onClose,
  title,
  message,
  buttonText = 'OK',
  onButtonPress,
}) => {
  const buttons = [
    {
      text: buttonText,
      onPress: onButtonPress,
    },
  ];

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title={title}
      message={message}
      buttons={buttons}
      type="success"
    />
  );
};

export default SuccessModal;