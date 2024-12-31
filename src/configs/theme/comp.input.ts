import { inputAnatomy } from '@chakra-ui/anatomy';
import {
  SystemStyleObject,
  createMultiStyleConfigHelpers,
} from '@chakra-ui/react';

import { textBaseVariants, textFW, typoVariantsGenerator } from './comp.typo';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseStyle = definePartsStyle({
  field: {
    h: '44px',
    p: '12px',
    border: '1px solid',
    borderColor: 'text.200',
    borderRadius: '8px',
    bg: 'white',
    bgColor: 'white',
    boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
  },
});

const sizes = typoVariantsGenerator(textBaseVariants);

const inputSizes = {
  xl: definePartsStyle({ field: sizes.xl }),
  xl_medium: definePartsStyle({ field: sizes.xl_medium }),
  xl_semiBold: definePartsStyle({ field: sizes.xl_semiBold }),
  xl_bold: definePartsStyle({ field: sizes.xl_bold }),
  lg: definePartsStyle({ field: sizes.lg }),
  lg_medium: definePartsStyle({ field: sizes.lg_medium }),
  lg_semiBold: definePartsStyle({ field: sizes.lg_semiBold }),
  lg_bold: definePartsStyle({ field: sizes.lg_bold }),
  md: definePartsStyle({ field: sizes.md }),
  md_medium: definePartsStyle({ field: sizes.md_medium }),
  md_semiBold: definePartsStyle({ field: sizes.md_semiBold }),
  md_bold: definePartsStyle({ field: sizes.md_bold }),
  sm: definePartsStyle({ field: sizes.sm }),
  sm_medium: definePartsStyle({ field: sizes.sm_medium }),
  sm_semiBold: definePartsStyle({ field: sizes.sm_semiBold }),
  sm_bold: definePartsStyle({ field: sizes.sm_bold }),
};

export default defineMultiStyleConfig({
  baseStyle,
  sizes: inputSizes,
});
