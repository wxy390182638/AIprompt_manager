import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';

const PromptEditor: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [content, setContent] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const handleSave = () => {
    if (!state.selectedFolder || !content.trim()) return;

    const newPrompt = {
      id: Date.now().toString(),
      folderId: state.selectedFolder.id,
      title: '新提示词',
      content: content.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    dispatch({
      type: 'ADD_PROMPT',
      payload: {
        folderId: state.selectedFolder.id,
        prompt: newPrompt
      }
    });

    setContent('');
  };

  return (
    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">提示词编辑器</Typography>
        <Box>
          <Tooltip title={copied ? '已复制！' : '复制内容'}>
            <IconButton onClick={handleCopy} color={copied ? 'success' : 'default'}>
              <CopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="保存提示词">
            <IconButton onClick={handleSave} color="primary">
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{ p: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          placeholder="在此输入提示词内容..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Paper>
    </Box>
  );
};

export default PromptEditor; 