import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

// base style
const baseStyle = definePartsStyle((props) => {
  return {
    dialogContainer: {
      px: '15px',
    },
    dialog: {
      borderRadius: '20px',
      bg: 'text.25',
    },
    header: {
      pt: '5px',
      px: '5px',
      pb: { base: '5px', md: 0 },
      h: '40px',
    },
    body: {
      pt: '30px',
      pr: '5px',
      pl: { base: 0, md: '5px' },
      pb: '5px',
    },
    closeButton: {
      w: '40px',
      h: '40px',
      borderRadius: '50%',
      border: '2px solid',
      borderColor: 'neutrals.600',
      fontSize: '14px',
    },
  };
});

// size styles
const sizes = {
  xl: definePartsStyle({
    dialog: defineStyle({
      maxW: '500px',
      px: { base: '20px', md: '25px' },
      py: '25px',
    }),
    closeButton: defineStyle({
      top: '30px',
      right: { base: '20px', md: '30px' },
    }),
  }),
  lg: definePartsStyle({
    dialog: defineStyle({
      maxW: '448px',
      px: { base: '20px', md: '25px' },
      py: '25px',
    }),
    closeButton: defineStyle({
      top: '30px',
      right: { base: '20px', md: '30px' },
    }),
  }),
  md: definePartsStyle({
    dialog: defineStyle({
      px: { base: '20px', md: '25px' },
      py: '25px',
    }),
    closeButton: defineStyle({
      top: '30px',
      right: { base: '20px', md: '30px' },
    }),
  }),
  sm: definePartsStyle({ header: defineStyle({}), dialog: defineStyle({}) }),
};

// final
const Modal = defineMultiStyleConfig({
  baseStyle,
  sizes,
  defaultProps: {},
});

export default Modal;
