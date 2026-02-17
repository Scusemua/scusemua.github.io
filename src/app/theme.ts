import {createTheme} from '@mui/material/styles';
import {red} from '@mui/material/colors';

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        xs: true;
        sm: true;
        md: true;
        lg: true;
        xl: true;
    }

    interface Palette {
        darkProjectActionIconColor: Palette['primary'];
    }

    interface PaletteOptions {
        darkProjectActionIconColor?: PaletteOptions['primary'];
    }
}

let theme = createTheme({});
theme = createTheme({
    cssVariables: true,
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1290,
            xl: 1536,
        },
    },
    palette: {
        primary: {
            main: '#A4243B',
        },
        secondary: {
            main: '#FDFFFF',
        },
        info: {
            main: '#D8973C',
        },
        error: {
            main: red.A400,
        },
        darkProjectActionIconColor: theme.palette.augmentColor({
            color: {
                main: '#565656',
            },
            name: 'Dark Project Action Icon Color',
        }),
    },
    typography: {
        fontFamily: 'var(--font-roboto)',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: "#6b6b6b #2b2b2b",
                    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                        backgroundColor: "#2b2b2b",
                    },
                    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                        borderRadius: 8,
                        backgroundColor: "#6b6b6b",
                        minHeight: 24,
                        border: "3px solid #2b2b2b",
                    },
                    "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
                        backgroundColor: "#959595",
                    },
                    "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
                        backgroundColor: "#959595",
                    },
                    "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "#959595",
                    },
                    "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                        backgroundColor: "#2b2b2b",
                    },
                },
            },
        },
    },
});

export default theme;