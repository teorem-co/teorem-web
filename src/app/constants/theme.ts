import createTheme from '@mui/material/styles/createTheme';

const THEME = createTheme({
    palette: {
        primary: {
            main: '#6658DB',
            dark: '#553DEE',
            light: '#cbc3fb',
            contrastText: '#f8f4fe',
        },
        secondary: {
            main: '#0b8a00',
        },
        success: {
            main: '#2ecc71',
        },
        error: {
            main: '#e74c3c',
        },
        warning: {
            main: '#e67e22',
        },
        divider: '#c4c4c4',
        text: {
            primary: '#303030',
            secondary: '#636363',
        },
    },
    typography: {
        fontFamily: 'Lato',
        fontSize: 14,
        button: {
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '20px',
        },
        body2: {
            color: '#636363',
        },
        h1: {
            fontWeight: 700,
            fontSize: '2.4em',
        },
        h2: {
            fontSize: '2em',
            fontWeight: 700,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontSize: '20px',
            fontWeight: 600,
            marginTop: '12px',
            marginBottom: '12px',
        },
        h6: {
            fontSize: '15px',
            fontWeight: 700,
            lineHeight: '24px',
            marginTop: '8px',
            marginBottom: '8px',
        },
        caption: {
            color: '#6B7280',
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiAppBar: {
            defaultProps: {
                color: 'transparent',
            },
        },
        MuiButton: {
            defaultProps: {
                fullWidth: true,
            },
            styleOverrides: {
                root: {
                    minHeight: '48px',
                },
                outlinedSecondary: {
                    border: '1px solid var(--border-color)',
                    ':hover': {
                        border: '1px solid var(--color-text-primary)',
                    },
                    color: 'black',
                },
            },
        },
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },
        MuiTooltip: {
            defaultProps: {
                arrow: true,
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    fontSize: '14px',
                    lineHeight: '14px',
                    marginBottom: '8px',
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontSize: '14px',
                    lineHeight: '14px',
                },
            },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    fontSize: '16px',
                    lineHeight: '18px',
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    minHeight: 'initial',
                },
            },
        },
    },
});

export default THEME;
