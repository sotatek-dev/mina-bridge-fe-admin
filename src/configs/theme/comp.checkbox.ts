import { checkboxAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const baseStyle = definePartsStyle({
  control: {
    mt: '2px',
    w: '20px',
    h: '20px',
    borderRadius: '6px',
  },
});

export const Checkbox = defineMultiStyleConfig({ baseStyle });
