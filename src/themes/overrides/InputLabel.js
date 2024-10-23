// ==============================|| OVERRIDES - INPUT LABEL ||============================== //

export default function InputLabel(theme) {
  return {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.grey[600]
        },
        asterisk: {
          color: "#db3131",
          "&$error": {
            color: "#db3131",
          },
        },
        outlined: {
          lineHeight: '1rem',
          top: -4,
          '&.MuiInputLabel-sizeSmall': {
            lineHeight: '1em'
          },
          '&.MuiInputLabel-shrink': {
            background: theme.palette.background.paper,
            padding: '0 8px',
            marginLeft: -6,
            top: 2,
            lineHeight: '1rem'
          }
        }
      }
    }
  };
}


// components: {
//     MuiFormLabel: {
//         styleOverrides: {
//             asterisk: {
//                 color: "#db3131",
//                 "&$error": {
//                     color: "#db3131",
//                 },
//             },
//         },
//     },
// },