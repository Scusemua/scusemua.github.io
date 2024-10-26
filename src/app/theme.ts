import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
    cssVariables: true,
    palette: {
        primary: {
            main: '#F05D5E',
        },
        secondary: {
            main: '#EFF6EE',
        },
        error: {
            main: red.A400,
        },
    },
});

export default theme;