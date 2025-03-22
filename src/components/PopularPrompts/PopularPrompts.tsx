import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Tooltip,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Snackbar,
  Alert,
  Chip,
  Stack,
  TextField
} from '@mui/material';
import {
  Add as AddIcon,
  OpenInNew as OpenInNewIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { Prompt } from '../../types';
import { usePopularPrompts, PopularPrompt, setCustomPromptUrl } from '../../services/promptService';
import { format } from 'date-fns';

export const PopularPrompts: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [selectedPrompt, setSelectedPrompt] = useState<PopularPrompt | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  
  // 使用自定义钩子获取热门提示词数据
  const { data, loading, error, lastUpdate, refreshData } = usePopularPrompts();

  const handleRefresh = () => {
    refreshData(true); // 强制刷新
    setSnackbarMessage('正在刷新提示词数据...');
    setOpenSnackbar(true);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddToFolder = (prompt: PopularPrompt) => {
    if (!state.selectedFolder) {
      setSnackbarMessage('请先选择一个文件夹');
      setOpenSnackbar(true);
      return;
    }

    const timestamp = Date.now();
    const newPrompt: Prompt = {
      id: `prompt_${timestamp}`,
      folderId: state.selectedFolder.id,
      title: prompt.title,
      content: prompt.content,
      tags: prompt.tags,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    dispatch({
      type: 'ADD_PROMPT',
      payload: {
        folderId: state.selectedFolder.id,
        prompt: newPrompt
      }
    });

    setSnackbarMessage('提示词已添加到文件夹');
    setOpenSnackbar(true);
  };

  const handleOpenDialog = (prompt: PopularPrompt) => {
    setSelectedPrompt(prompt);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPrompt(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  
  const handleOpenSettings = () => {
    setSettingsOpen(true);
  };
  
  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };
  
  const handleSaveCustomUrl = async () => {
    try {
      await setCustomPromptUrl(customUrl);
      setSnackbarMessage('自定义URL已保存');
      setOpenSnackbar(true);
      handleRefresh();
      handleCloseSettings();
    } catch (error) {
      console.error('保存自定义URL失败:', error);
      setSnackbarMessage('保存自定义URL失败');
      setOpenSnackbar(true);
    }
  };

  const filteredPrompts = data?.prompts.filter(prompt => 
    selectedCategory === '全部' || prompt.category === selectedCategory
  ) || [];

  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !data) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">加载热门提示词失败: {error.message}</Alert>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }} 
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
        >
          重试
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <Typography variant="h6">
          热门提示词
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {lastUpdate && (
            <Typography variant="caption" color="text.secondary">
              最后更新: {format(new Date(lastUpdate), 'yyyy-MM-dd HH:mm:ss')}
            </Typography>
          )}
          <Tooltip title="刷新提示词">
            <IconButton onClick={handleRefresh} size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="设置">
            <IconButton onClick={handleOpenSettings} size="small">
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2, pb: 1 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {data?.categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategoryChange(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
        </Stack>
      </Box>
      
      <List>
        {filteredPrompts.map((prompt) => (
          <ListItem
            key={prompt.id}
            onClick={() => handleOpenDialog(prompt)}
            sx={{ 
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' }
            }}
            secondaryAction={
              <IconButton
                edge="end"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToFolder(prompt);
                }}
                title="添加到当前文件夹"
              >
                <AddIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {prompt.title}
                  {prompt.tags && prompt.tags.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {prompt.tags.map((tag) => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          variant="outlined" 
                          sx={{ height: 20, fontSize: '0.7rem' }} 
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              }
              secondary={prompt.content.length > 100 
                ? `${prompt.content.substring(0, 100)}...` 
                : prompt.content
              }
            />
          </ListItem>
        ))}
      </List>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '600px'
          }
        }}
      >
        <DialogTitle>
          {selectedPrompt?.title}
        </DialogTitle>
        <DialogContent>
          {selectedPrompt?.tags && selectedPrompt.tags.length > 0 && (
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selectedPrompt.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" />
              ))}
            </Box>
          )}
          <DialogContentText sx={{ whiteSpace: 'pre-wrap' }}>
            {selectedPrompt?.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>关闭</Button>
          <Button
            onClick={() => {
              if (selectedPrompt) {
                handleAddToFolder(selectedPrompt);
              }
              handleCloseDialog();
            }}
            variant="contained"
            disabled={!state.selectedFolder}
          >
            添加到当前文件夹
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={settingsOpen} onClose={handleCloseSettings}>
        <DialogTitle>提示词设置</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            设置自定义的提示词JSON文件URL，留空则使用默认URL
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="自定义URL"
            type="url"
            fullWidth
            variant="outlined"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com/prompts.json"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings}>取消</Button>
          <Button onClick={handleSaveCustomUrl} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 