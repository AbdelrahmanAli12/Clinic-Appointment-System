import { Button } from 'antd';
import React from 'react';

interface ActionButtonProps {
  text: string;
  callback?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ callback, text }) => {
  return (
    <Button type='primary' onClick={callback}>
      {text}
    </Button>
  );
};

export default ActionButton;
