import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Switch,
  Radio,
  RadioGroup,
  Button,
  TextField,
  Divider,
  useTheme,
  alpha,
  Tooltip,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Stack,
  Card,
  CardContent,
  IconButton,
  Alert,
  Collapse,
  Chip
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  Restore as RestoreIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Language as LanguageIcon,
  AccessTime as AccessTimeIcon,
  Backup as BackupIcon,
  Download as DownloadIcon,
  SyncAlt as SyncAltIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';

export const Settings: React.FC = () => {
  const theme = useTheme();
  const { state, dispatch } = useAppContext();
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error' | 'info' | 'warning'>('success');

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        ...state.settings,
        theme
      }
    });
  };

  const handleAutoSaveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        ...state.settings,
        autoSave: event.target.checked
      }
    });
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        ...state.settings,
        language: event.target.value
      }
    });
  };

  const handleBackupData = () => {
    try {
      const dataStr = JSON.stringify(state);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `prompt-manager-backup-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      showAlert('数据备份成功！', 'success');
    } catch (error) {
      console.error('备份失败:', error);
      showAlert('备份失败，请重试！', 'error');
    }
  };

  const handleRestoreData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.target.files?.[0];
    
    if (file) {
      fileReader.readAsText(file);
      fileReader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const parsedData = JSON.parse(content);
            
            // 简单验证数据格式
            if (parsedData.folders && Array.isArray(parsedData.folders)) {
              dispatch({
                type: 'RESTORE_DATA',
                payload: parsedData
              });
              showAlert('数据恢复成功！', 'success');
            } else {
              showAlert('无效的备份文件格式！', 'error');
            }
          }
        } catch (error) {
          console.error('恢复失败:', error);
          showAlert('恢复失败，文件格式错误！', 'error');
        }
      };
    }
  };

  const showAlert = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
    
    // 5秒后自动关闭
    setTimeout(() => {
      setAlertOpen(false);
    }, 5000);
  };

  const handleAutoSyncIntervalChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      dispatch({
        type: 'UPDATE_SETTINGS',
        payload: {
          ...state.settings,
          autoSyncInterval: newValue
        }
      });
    }
  };

  return (
    <Box sx={{ 
      height: '100%', 
      p: 3, 
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 2,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.background.paper, 0.6),
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.1)
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2 
        }}>
          <SettingsIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            设置
          </Typography>
        </Box>
        
        <Alert 
          severity={alertSeverity}
          sx={{ mb: 3 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setAlertOpen(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          style={{ display: alertOpen ? 'flex' : 'none' }}
        >
          {alertMessage}
        </Alert>
      </Paper>
      
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {state.settings.theme === 'dark' ? (
              <DarkModeIcon sx={{ mr: 1, color: 'text.secondary' }} />
            ) : (
              <LightModeIcon sx={{ mr: 1, color: 'text.secondary' }} />
            )}
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              主题设置
            </Typography>
          </Box>
          
          <RadioGroup
            row
            value={state.settings.theme}
            onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark' | 'system')}
            sx={{ mb: 1 }}
          >
            <FormControlLabel 
              value="light" 
              control={<Radio size="small" />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LightModeIcon fontSize="small" sx={{ mr: 0.5, color: 'warning.light' }} />
                  <Typography variant="body2">浅色</Typography>
                </Box>
              }
              sx={{ mr: 2 }}
            />
            <FormControlLabel 
              value="dark" 
              control={<Radio size="small" />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DarkModeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2">深色</Typography>
                </Box>
              }
              sx={{ mr: 2 }}
            />
            <FormControlLabel 
              value="system" 
              control={<Radio size="small" />} 
              label={
                <Typography variant="body2">跟随系统</Typography>
              }
            />
          </RadioGroup>
          
          <Box 
            sx={{ 
              mt: 2, 
              p: 2, 
              borderRadius: 1.5, 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: '1px dashed',
              borderColor: 'primary.main'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              选择适合您的主题，可以根据个人喜好或工作环境需要进行设置。
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              语言与区域
            </Typography>
          </Box>
          
          <FormControl 
            fullWidth 
            variant="outlined" 
            size="small"
            sx={{ mb: 3 }}
          >
            <InputLabel id="language-select-label">界面语言</InputLabel>
            <Select
              labelId="language-select-label"
              value={state.settings.language}
              onChange={(e) => handleLanguageChange(e as React.ChangeEvent<HTMLInputElement>)}
              label="界面语言"
            >
              <MenuItem value="zh-CN">简体中文</MenuItem>
              <MenuItem value="en-US">English (US)</MenuItem>
              <MenuItem value="ja-JP">日本語</MenuItem>
              <MenuItem value="ko-KR">한국어</MenuItem>
            </Select>
          </FormControl>

          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              自动保存设置
            </Typography>
          </Box>
          
          <FormControlLabel
            control={
              <Switch 
                checked={state.settings.autoSave} 
                onChange={handleAutoSaveChange}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2">启用自动保存</Typography>
                <Typography variant="caption" color="text.secondary">
                  自动保存您的更改，无需手动点击保存按钮
                </Typography>
              </Box>
            }
          />
          
          {state.settings.autoSave && (
            <Box sx={{ mt: 2, pl: 4 }}>
              <Typography 
                variant="body2" 
                id="auto-sync-slider" 
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <SyncAltIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                自动同步间隔: {state.settings.autoSyncInterval} 分钟
              </Typography>
              <Slider
                value={state.settings.autoSyncInterval}
                onChange={handleAutoSyncIntervalChange}
                aria-labelledby="auto-sync-slider"
                min={1}
                max={60}
                valueLabelDisplay="auto"
                sx={{ maxWidth: 300 }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
      
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BackupIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              数据备份与恢复
            </Typography>
          </Box>
          
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ sm: 'center' }}
            sx={{ mb: 3 }}
          >
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleBackupData}
              sx={{ minWidth: 140 }}
            >
              导出备份
            </Button>
            
            <Box 
              component="label" 
              htmlFor="restore-file"
              sx={{ 
                display: 'inline-flex',
              }}
            >
              <input
                style={{ display: 'none' }}
                id="restore-file"
                name="restore-file"
                type="file"
                accept=".json"
                onChange={handleRestoreData}
              />
              <Button
                variant="outlined"
                component="span"
                startIcon={<RestoreIcon />}
                sx={{ minWidth: 140 }}
              >
                恢复备份
              </Button>
            </Box>
          </Stack>
          
          <Alert severity="info" variant="outlined" icon={<InfoIcon />}>
            <Typography variant="body2">
              定期备份您的数据可以防止意外数据丢失。备份文件包含您的所有文件夹和提示词数据。
            </Typography>
          </Alert>
        </CardContent>
      </Card>
      
      <Box sx={{ pt: 2, pb: 4, display: 'flex', justifyContent: 'center' }}>
        <Chip
          label={`版本 ${chrome.runtime.getManifest().version}`}
          variant="outlined"
          size="small"
          sx={{ opacity: 0.6 }}
        />
      </Box>
    </Box>
  );
}; 