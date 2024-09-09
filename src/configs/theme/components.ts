import { ComponentStyleConfig } from '@chakra-ui/react';

import Button from './comp.button';
import { Checkbox } from './comp.checkbox';
import Input from './comp.input';
import Modal from './comp.modal';
import typo from './comp.typo';

const components: Record<string, ComponentStyleConfig> = {
  ...typo,
  Modal,
  Input,
  Button,
  Checkbox,
  Badge: {
    baseStyle: {
      h: '20px',
      display: 'flex',
      padding: '3px 8px',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '5px',
      bg: 'primary.purple',
      bgColor: 'primary.purple',
      color: 'white',
    },
  },
};

export default components;
