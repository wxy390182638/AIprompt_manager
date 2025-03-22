import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, Tabs, Tab, useMediaQuery, Paper, alpha, Typography, IconButton, Tooltip } from '@mui/material';
import { 
  Folder as FolderIcon, 
  Lightbulb as LightbulbIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';
import { FolderList } from './components/FolderList';
import { PromptList } from './components/PromptList';
import { PopularPrompts } from './components/PopularPrompts';
import { AppProvider, useAppContext } from './context/AppContext';
import { getTheme } from './theme';

// 定义标签页内容组件
const TabPanel: React.FC<{
  children?: React.ReactNode;
  index: number;
  value: number;
}> = ({ children, value, index }) => {
  return (
    <div
      style={{
        display: value === index ? 'flex' : 'none',
        height: '100%',
        flexDirection: 'column'
      }}
    >
      {value === index && children}
    </div>
  );
};

// 主应用组件
const AppContent: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [tabValue, setTabValue] = useState(0);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // 根据设置或系统首选项确定主题模式
  const themeMode = 
    state.settings.theme === 'system' 
      ? (prefersDarkMode ? 'dark' : 'light')
      : state.settings.theme;
  
  const theme = React.useMemo(() => getTheme(themeMode), [themeMode]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        ...state.settings,
        theme: newTheme
      }
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            px: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
            <LightbulbIcon 
              color="primary" 
              sx={{ mr: 1, fontSize: '1.2rem' }}
            />
            <Typography variant="subtitle1" fontWeight="medium" color="primary">
              提示词管理器
            </Typography>
          </Box>
          
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="应用导航"
            sx={{
              minHeight: '48px',
              '& .MuiTab-root': {
                minHeight: '48px',
                fontSize: '0.875rem',
                textTransform: 'none',
                fontWeight: 'medium',
                px: 3,
                py: 1.5
              }
            }}
          >
            <Tab 
              icon={<FolderIcon fontSize="small" />} 
              label="我的提示词" 
              id="tab-0"
              iconPosition="start"
            />
            <Tab 
              icon={<LightbulbIcon fontSize="small" />} 
              label="精选提示词" 
              id="tab-1"
              iconPosition="start"
            />
          </Tabs>
          
          <Tooltip title={themeMode === 'light' ? '切换到暗色模式' : '切换到亮色模式'}>
            <IconButton onClick={toggleTheme} size="small">
              {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </Paper>

        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
              <Box sx={{ width: 260, height: '100%' }}>
                <FolderList />
              </Box>
              <Box sx={{ flex: 1, height: '100%', overflow: 'hidden' }}>
                <PromptList />
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <PopularPrompts />
          </TabPanel>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}; 