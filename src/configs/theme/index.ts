import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

import breakpoints from './breakpoints';
import colors from './colors';
import components from './components';
import fonts from './fonts';
import styles from './styles';

// color configs

// common configs
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// styles config

// final theme
export default extendTheme({
  styles,
  config,
  colors,
  fonts,
  breakpoints,
  components,
});
