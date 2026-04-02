export default function Theme(colors) {
  const { grey } = colors;

  // Contemporary Romance Palette
  const primaryMain = '#A6627C'; // Soft Berry
  const secondaryMain = '#D9AEBB'; // Dusty Rose
  const accentGold = '#C9A37A'; // Brushed Gold
  const backgroundBeige = '#FFF9F3'; // Creamy Beige

  const greyColors = {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16]
  };

  const contrastText = '#fff';

  return {
    primary: {
      lighter: '#FCE4EC',
      100: '#F8BBD0',
      200: '#F48FB1',
      light: '#F06292',
      400: '#EC407A',
      main: primaryMain,
      dark: '#880E4F',
      700: '#AD1457',
      darker: '#4A148C',
      900: '#311B92',
      contrastText
    },
    secondary: {
      lighter: '#FDFCFB',
      100: '#FDFCFB',
      200: '#FDFCFB',
      light: '#FDFCFB',
      400: '#FDFCFB',
      main: secondaryMain,
      600: greyColors[600],
      dark: '#8E24AA',
      800: greyColors[800],
      darker: '#5E35B1',
      A100: greyColors[0],
      A200: backgroundBeige,
      A300: greyColors.A700,
      contrastText: greyColors[900]
    },
    error: {
      lighter: '#FFEBEE',
      light: '#EF9A9A',
      main: '#D32F2F',
      dark: '#C62828',
      darker: '#B71C1C',
      contrastText
    },
    warning: {
      lighter: '#FFF8E1',
      light: '#FFECB3',
      main: accentGold,
      dark: '#B8860B',
      darker: '#8B4513',
      contrastText: greyColors[900]
    },
    info: {
      lighter: '#E1F5FE',
      light: '#81D4FA',
      main: '#0288D1',
      dark: '#01579B',
      darker: '#01579B',
      contrastText
    },
    success: {
      lighter: '#E8F5E9',
      light: '#A5D6A7',
      main: '#2E7D32',
      dark: '#1B5E20',
      darker: '#1B5E20',
      contrastText
    },
    grey: greyColors
  };
}
