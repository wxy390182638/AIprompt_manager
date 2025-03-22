import React, { useState, useEffect } from 'react';
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
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { StorageManager } from '../../utils/storage';
import { Prompt } from '../../types';

export const PopularPrompts: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [popularPrompts, setPopularPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadPopularPrompts();
  }, []);

  const loadPopularPrompts = async () => {
    setLoading(true);
    try {
      // 这里应该从API获取热门提示词
      // 目前使用模拟数据
      const mockPrompts: Prompt[] = [
        {
          id: 'popular1',
          folderId: 'popular',
          title: '角色扮演助手',
          content: '我希望你能扮演一个助手角色，帮助我完成各种任务。你应该专业、友好、有耐心。',
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: 'popular2',
          folderId: 'popular',
          title: '代码优化专家',
          content: '请帮我优化以下代码，使其更加高效、可读性更好。',
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: 'popular3',
          folderId: 'popular',
          title: '写作助手',
          content: '请帮我修改和优化以下文章，使其更加流畅、专业。',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ];
      setPopularPrompts(mockPrompts);
    } catch (error) {
      console.error('加载热门提示词失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFolder = (prompt: Prompt) => {
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

  const handleOpenDialog = (prompt: Prompt) => {
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ p: 2 }}>
        热门提示词
      </Typography>
      <Divider />
      <List>
        {popularPrompts.map((prompt) => (
          <ListItem
            key={prompt.id}
            secondaryAction={
              <IconButton
                edge="end"
                onClick={() => handleAddToFolder(prompt)}
                title="添加到当前文件夹"
              >
                <AddIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={prompt.title}
              secondary={prompt.content}
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
          <DialogContentText>
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