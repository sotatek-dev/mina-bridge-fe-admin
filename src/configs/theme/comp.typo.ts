import {
  ComponentSingleStyleConfig,
  Heading,
  SystemStyleObject,
} from '@chakra-ui/react';

export const textFW = [
  {
    key: 'medium',
    value: 500,
  },
  {
    key: 'semiBold',
    value: 600,
  },
  {
    key: 'bold',
    value: 700,
  },
];

export const textBaseVariants: Record<string, SystemStyleObject> = {
  xl: {
    fontSize: '18px',
    fontStyle: 'normal',
    lineHeight: '23.4px',
  },
  lg: {
    fontSize: '16px',
    fontStyle: 'normal',
    lineHeight: '22.4px',
    letterSpacing: '0.2px',
  },
  md: {
    fontSize: '14px',
    fontStyle: 'normal',
    lineHeight: '22.4px',
    letterSpacing: '0.2px',
  },
  sm: {
    fontSize: '12px',
    fontStyle: 'normal',
    lineHeight: '19.6px',
    letterSpacing: '0.2px',
  },
};

export function typoVariantsGenerator(
  baseVariants: Record<string, SystemStyleObject>
): Record<string, SystemStyleObject> {
  const res: Record<string, SystemStyleObject> = baseVariants;
  Object.entries(baseVariants).forEach(([key, value]) => {
    textFW.forEach((item) => {
      res[key + '_' + item.key] = { ...value, fontWeight: item.value };
    });
  });
  return res;
}

const typo: Record<string, ComponentSingleStyleConfig> = {
  Text: {
    baseStyle: {
      fontFamily: 'primary',
    },
    variants: typoVariantsGenerator(textBaseVariants),
  },
  Heading: {
    variants: {
      h1: {
        fontSize: '40px',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '42px',
        letterSpacing: '0.2px',
      },
      h2: {
        fontSize: '32px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '36px',
        letterSpacing: '0.2px',
      },
      h3: {
        fontSize: '24px',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '32px',
        letterSpacing: '0.2px',
      },
      h4: {
        fontSize: '20px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '28px',
      },
      h5: {
        fontSize: '18px',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '24px',
      },
    },
  },
};

export default typo;
