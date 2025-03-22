import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Divider,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { FolderTree } from '../../components/FolderTree';
import { PromptList } from '../../components/PromptList';
import { PopularPrompts } from '../../components/PopularPrompts';
import { AppProvider } from '../../context/AppContext';

// 创建主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

// Tab面板组件
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{ flex: 1, display: value === index ? 'flex' : 'none' }}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

export const MainLayout: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Box
          sx={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            bgcolor: 'background.default',
          }}
        >
          {/* 左侧文件夹树 */}
          <Box
            sx={{
              width: 250,
              flexShrink: 0,
              borderRight: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <FolderTree />
          </Box>

          {/* 右侧内容区 */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="prompt tabs"
              >
                <Tab label="我的Prompts" />
                <Tab label="热门Prompts" />
              </Tabs>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <TabPanel value={tabValue} index={0}>
                <PromptList />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <PopularPrompts />
              </TabPanel>
            </Box>
          </Box>
        </Box>
      </AppProvider>
    </ThemeProvider>
  );
}; 