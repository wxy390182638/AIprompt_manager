import { createTheme } from '@mui/material/styles';

// 创建一个带有科技感和圆角设计的主题
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3a7bd5', // 更现代的蓝色
      light: '#5e9cf5',
      dark: '#0d47a1',
    },
    secondary: {
      main: '#00bcd4', // 青色，增加科技感
    },
    background: {
      default: '#f0f4f8', // 更淡的背景色，减轻视觉疲劳
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50',
    },
    info: {
      main: '#2196f3',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#546e7a',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 500,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '0.00938em',
    },
    body1: {
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12, // 更大的圆角半径
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'rgba(0,0,0,0.05)',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'rgba(0,0,0,0.15)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(0,0,0,0.25)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none', // 避免全大写
          boxShadow: 'none',
          padding: '6px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #3a7bd5 10%, #00d2ff 90%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 3px 15px rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 6px 20px rgba(0,0,0,0.08)',
          },
        },
        elevation1: {
          boxShadow: '0px 2px 10px rgba(0,0,0,0.03)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 5px 15px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginBottom: 4,
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            backgroundColor: 'rgba(58, 123, 213, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(58, 123, 213, 0.12)',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          margin: '6px 0',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: '0px 8px 30px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          },
        },
        colorPrimary: {
          background: 'linear-gradient(45deg, #3a7bd5 30%, #00d2ff 90%)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTab-root': {
            borderRadius: '12px 12px 0 0',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.95rem',
            padding: '12px 24px',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: '#3a7bd5',
              opacity: 1,
            },
          },
          '& .Mui-selected': {
            backgroundColor: 'rgba(58, 123, 213, 0.05)',
          },
        },
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
          background: 'linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          fontSize: '0.75rem',
          padding: '6px 12px',
          backgroundColor: 'rgba(33, 33, 33, 0.9)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            backgroundColor: 'rgba(58, 123, 213, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3a7bd5',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
          },
        },
      },
    },
  },
});

// 深色主题
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5e9cf5', // 更亮的蓝色，适合暗色模式
      light: '#80b4ff',
      dark: '#3d7be2',
    },
    secondary: {
      main: '#00bcd4',
      light: '#33c9dc',
      dark: '#008394',
    },
    background: {
      default: '#111827', // 更深的背景色
      paper: '#1f2937', // 更深的卡片背景
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 500,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '0.00938em',
    },
    body1: {
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(255,255,255,0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #5e9cf5 0%, #00bcd4 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #5e9cf5 10%, #00bcd4 90%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 6px 20px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginBottom: 4,
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            backgroundColor: 'rgba(94, 156, 245, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(94, 156, 245, 0.2)',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          backgroundImage: 'none',
          boxShadow: '0px 8px 30px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
          },
        },
        colorPrimary: {
          background: 'linear-gradient(45deg, #5e9cf5 30%, #00bcd4 90%)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTab-root': {
            borderRadius: '12px 12px 0 0',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.95rem',
            padding: '12px 24px',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: '#5e9cf5',
              opacity: 1,
            },
          },
          '& .Mui-selected': {
            backgroundColor: 'rgba(94, 156, 245, 0.1)',
          },
        },
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
          background: 'linear-gradient(90deg, #5e9cf5 0%, #00bcd4 100%)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            backgroundColor: 'rgba(94, 156, 245, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#5e9cf5',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
          },
        },
      },
    },
  },
}); 