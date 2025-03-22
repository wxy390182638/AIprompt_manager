import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { StorageManager } from '../../utils/storage';
import { Prompt } from '../../types';

export const PromptList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [promptTitle, setPromptTitle] = useState('');
  const [promptContent, setPromptContent] = useState('');

  const handleOpenDialog = (prompt?: Prompt) => {
    if (prompt) {
      setEditingPrompt(prompt);
      setPromptTitle(prompt.title);
      setPromptContent(prompt.content);
    } else {
      setEditingPrompt(null);
      setPromptTitle('');
      setPromptContent('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPrompt(null);
    setPromptTitle('');
    setPromptContent('');
  };

  const handleSavePrompt = async () => {
    if (!promptTitle.trim() || !promptContent.trim() || !state.selectedFolder) return;

    try {
      if (editingPrompt) {
        const updatedPrompt = {
          ...editingPrompt,
          title: promptTitle,
          content: promptContent,
          updatedAt: Date.now()
        };
        await StorageManager.updatePrompt(updatedPrompt);
        dispatch({
          type: 'UPDATE_PROMPT',
          payload: { folderId: state.selectedFolder.id, prompt: updatedPrompt }
        });
      } else {
        const newPrompt: Prompt = {
          id: Date.now().toString(),
          folderId: state.selectedFolder.id,
          title: promptTitle,
          content: promptContent,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        await StorageManager.addPrompt(state.selectedFolder.id, newPrompt);
        dispatch({
          type: 'ADD_PROMPT',
          payload: { folderId: state.selectedFolder.id, prompt: newPrompt }
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('保存提示词失败:', error);
      alert('保存失败，请重试');
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    if (!state.selectedFolder) return;
    if (!confirm('确定要删除这个提示词吗？')) return;

    try {
      await StorageManager.deletePrompt(state.selectedFolder.id, promptId);
      dispatch({
        type: 'DELETE_PROMPT',
        payload: { folderId: state.selectedFolder.id, promptId }
      });
    } catch (error) {
      console.error('删除提示词失败:', error);
      alert('删除失败，请重试');
    }
  };

  const selectedFolderData = state.folders.find(f => f.id === state.selectedFolder?.id);
  const prompts = selectedFolderData?.prompts || [];

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {selectedFolderData ? `${selectedFolderData.name}的提示词` : '请选择文件夹'}
        </Typography>
        {state.selectedFolder && (
          <Tooltip title="新建提示词">
            <IconButton
              onClick={() => handleOpenDialog()}
              size="small"
              color="primary"
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {state.selectedFolder ? (
        prompts.length > 0 ? (
          <List>
            {prompts.map((prompt) => (
              <ListItem
                key={prompt.id}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemText
                  primary={prompt.title}
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {prompt.content}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mr: 2 }}
                  >
                    {new Date(prompt.updatedAt).toLocaleDateString()}
                  </Typography>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleOpenDialog(prompt)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleDeletePrompt(prompt.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary" align="center">
            还没有提示词，点击右上角的加号创建
          </Typography>
        )
      ) : (
        <Typography color="text.secondary" align="center">
          请先选择一个文件夹
        </Typography>
      )}

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
          {editingPrompt ? '编辑提示词' : '新建提示词'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="标题"
            fullWidth
            value={promptTitle}
            onChange={(e) => setPromptTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="内容"
            multiline
            rows={4}
            fullWidth
            value={promptContent}
            onChange={(e) => setPromptContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleSavePrompt} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 