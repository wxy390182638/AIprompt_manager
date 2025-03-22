import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  FileUpload as ImportIcon,
  FileDownload as ExportIcon,
  GitHub as GitHubIcon,
  FormatColorFill as ThemeIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { StorageManager } from '../../utils/storage';

interface ToolbarProps {
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

export const AppToolbar: React.FC<ToolbarProps> = ({ onThemeToggle, isDarkMode }) => {
  const { state } = useAppContext();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleExport = async () => {
    try {
      const jsonData = await StorageManager.exportData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prompt-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showSnackbar('导出成功！', 'success');
    } catch (error) {
      console.error('导出失败:', error);
      showSnackbar('导出失败，请重试', 'error');
    }
  };

  const handleImport = () => {
    setDialogOpen(true);
  };

  const handleConfirmImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const jsonString = event.target?.result as string;
          await StorageManager.importData(jsonString);
          showSnackbar('导入成功！页面将刷新', 'success');
          setTimeout(() => {
            window.location.reload(); // 重新加载页面以刷新数据
          }, 1500);
        } catch (error) {
          console.error('导入失败:', error);
          showSnackbar('导入失败，请确保文件格式正确', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
    setDialogOpen(false);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  return (
    <>
      <AppBar 
        position="static" 
        color="default" 
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backdropFilter: 'blur(20px)',
          bgcolor: isDarkMode ? 'rgba(40, 40, 65, 0.8)' : 'rgba(255, 255, 255, 0.8)'
        }}
      >
        <Toolbar variant="dense">
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 600,
              background: isDarkMode 
                ? 'linear-gradient(90deg, #5e9cf5 0%, #00bcd4 100%)' 
                : 'linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Prompt Manager
          </Typography>
          
          <Box>
            <Tooltip title="导入数据">
              <IconButton 
                onClick={handleImport} 
                size="small"
                sx={{ borderRadius: 2, mx: 0.5 }}
              >
                <ImportIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="导出数据">
              <IconButton 
                onClick={handleExport} 
                size="small"
                sx={{ borderRadius: 2, mx: 0.5 }}
              >
                <ExportIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={isDarkMode ? "切换到亮色主题" : "切换到暗色主题"}>
              <IconButton 
                onClick={onThemeToggle} 
                size="small"
                sx={{ 
                  borderRadius: 2, 
                  mx: 0.5,
                  background: isDarkMode 
                    ? 'rgba(255,255,255,0.05)' 
                    : 'rgba(0,0,0,0.03)',
                  '&:hover': {
                    background: isDarkMode 
                      ? 'rgba(255,255,255,0.1)' 
                      : 'rgba(0,0,0,0.05)',
                  }
                }}
              >
                {isDarkMode ? <LightIcon /> : <DarkIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          elevation: 5,
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>确认导入</DialogTitle>
        <DialogContent>
          <DialogContentText>
            导入将会覆盖当前的所有数据，确定要继续吗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button 
            onClick={handleConfirmImport} 
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            确认导入
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity} 
          sx={{ 
            width: '100%',
            borderRadius: 2
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}; 