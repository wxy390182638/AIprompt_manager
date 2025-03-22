import React from 'react';
import {
  Box,
  List,
  ListItem,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Snackbar,
  Alert,
  Paper,
  Chip,
  Fade,
  useTheme,
  alpha,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  ContentCopy as CopyIcon,
  Search as SearchIcon,
  Tag as TagIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { Prompt } from '../../types';

export const PromptList: React.FC = () => {
  const theme = useTheme();
  const { state, dispatch } = useAppContext();
  const [open, setOpen] = React.useState(false);
  const [editingPrompt, setEditingPrompt] = React.useState<Prompt | null>(null);
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);
  const [currentTag, setCurrentTag] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  // 获取内容的第一行作为预览
  const getContentPreview = (content: string) => {
    if (!content || content.trim() === '') return '空内容';
    
    const lines = content.split('\n');
    const firstNonEmptyLine = lines.find(line => line.trim() !== '') || '';
    
    return firstNonEmptyLine.length > 120 
      ? firstNonEmptyLine.substring(0, 120) + '...' 
      : firstNonEmptyLine;
  };

  const handleAddPrompt = () => {
    if (!state.selectedFolder) return;
    
    if (title.trim() && content.trim()) {
      const newPrompt: Prompt = {
        id: Date.now().toString(),
        folderId: state.selectedFolder.id,
        title: title.trim(),
        content: content.trim(),
        tags: tags,
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
      
      setTitle('');
      setContent('');
      setTags([]);
      setOpen(false);
    }
  };

  const handleUpdatePrompt = () => {
    if (!state.selectedFolder || !editingPrompt) return;
    
    if (title.trim() && content.trim()) {
      const updatedPrompt: Prompt = {
        ...editingPrompt,
        title: title.trim(),
        content: content.trim(),
        tags: tags,
        updatedAt: Date.now()
      };
      
      dispatch({
        type: 'UPDATE_PROMPT',
        payload: {
          folderId: state.selectedFolder.id,
          prompt: updatedPrompt
        }
      });
      
      setTitle('');
      setContent('');
      setTags([]);
      setEditingPrompt(null);
      setOpen(false);
    }
  };

  const handleDeletePrompt = (promptId: string) => {
    if (state.selectedFolder && window.confirm('确定要删除这个提示词吗？')) {
      dispatch({
        type: 'DELETE_PROMPT',
        payload: {
          folderId: state.selectedFolder.id,
          promptId
        }
      });
    }
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setTitle(prompt.title);
    setContent(prompt.content);
    setTags(prompt.tags || []);
    setOpen(true);
  };

  const handleCopyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setOpenSnackbar(true);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 过滤提示词列表
  const filteredPrompts = state.selectedFolder ? 
    state.selectedFolder.prompts
      .filter(prompt => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          prompt.title.toLowerCase().includes(term) || 
          prompt.content.toLowerCase().includes(term) ||
          prompt.tags?.some(tag => tag.toLowerCase().includes(term))
        );
      }) : [];

  if (!state.selectedFolder) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%', 
        p: 3 
      }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            textAlign: 'center',
            maxWidth: 500,
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            border: '1px dashed',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
            请从左侧选择一个文件夹
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            选择或创建一个文件夹来管理您的提示词集合
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2 
      }}>
        <Paper
          elevation={0}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flex: 1,
            mr: 1,
            borderRadius: 3,
            pl: 2,
            bgcolor: alpha(theme.palette.background.default, 0.6),
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.1)
          }}
        >
          <SearchIcon color="action" fontSize="small" sx={{ opacity: 0.6 }} />
          <InputAdornment position="start">
            <TextField
              placeholder="搜索提示词..."
              variant="standard"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: { 
                  fontSize: '0.95rem', 
                  ml: 1,
                  '& input': {
                    p: 1.5
                  }
                }
              }}
            />
          </InputAdornment>
          {searchTerm && (
            <IconButton 
              size="small" 
              onClick={() => setSearchTerm('')}
              sx={{ opacity: 0.7 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>
        <Tooltip title="添加提示词">
          <IconButton 
            onClick={() => {
              setEditingPrompt(null);
              setTitle('');
              setContent('');
              setTags([]);
              setOpen(true);
            }}
            color="primary"
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
              width: 40,
              height: 40
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {filteredPrompts.length > 0 ? (
        <Box sx={{ 
          overflow: 'auto',
          flex: 1
        }}>
          <List disablePadding>
            {filteredPrompts.map((prompt, index) => (
              <ListItem 
                key={prompt.id}
                disablePadding
                disableGutters
                sx={{ 
                  mb: 1.5,
                }}
              >
                <Card
                  sx={{
                    width: '100%',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: `0px 4px 15px ${alpha(theme.palette.primary.main, 0.12)}`,
                      transform: 'translateY(-2px)',
                      '& .action-buttons': {
                        opacity: 1
                      }
                    }
                  }}
                >
                  <CardContent sx={{ py: 1.5, px: 2 }}>
                    {/* 第一行：标题、标签和操作按钮 */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mb: 1
                    }}>
                      {/* 左侧：标题和标签 */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        maxWidth: 'calc(100% - 100px)',
                        overflow: 'hidden'
                      }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 500,
                            mr: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {prompt.title}
                        </Typography>
                        
                        {prompt.tags && prompt.tags.length > 0 && (
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 0.5, 
                            flexWrap: 'nowrap', 
                            overflow: 'hidden',
                            ml: 0.5
                          }}>
                            {prompt.tags.slice(0, 2).map(tag => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  '& .MuiChip-label': { px: 1, fontSize: '0.7rem' },
                                  height: 20,
                                  flexShrink: 0
                                }}
                              />
                            ))}
                            {prompt.tags.length > 2 && (
                              <Chip
                                label={`+${prompt.tags.length - 2}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ 
                                  '& .MuiChip-label': { px: 1, fontSize: '0.7rem' },
                                  height: 20,
                                  flexShrink: 0
                                }}
                              />
                            )}
                          </Box>
                        )}
                      </Box>

                      {/* 右侧：操作按钮 */}
                      <Box 
                        className="action-buttons"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          flexShrink: 0,
                          opacity: 0.3,
                          transition: 'opacity 0.2s ease'
                        }}
                      >
                        <Tooltip title="复制内容">
                          <IconButton 
                            onClick={() => handleCopyContent(prompt.content)}
                            size="small"
                            sx={{ mr: 0.5 }}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="编辑">
                          <IconButton 
                            onClick={() => handleEditPrompt(prompt)}
                            size="small"
                            sx={{ mr: 0.5 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="删除">
                          <IconButton 
                            onClick={() => handleDeletePrompt(prompt.id)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    {/* 第二行：内容预览 */}
                    <Box sx={{ 
                      px: 0.5, 
                      py: 0.5, 
                      bgcolor: theme => alpha(theme.palette.background.default, 0.5),
                      borderRadius: 1
                    }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%',
                          fontSize: '0.85rem'
                        }}
                      >
                        {getContentPreview(prompt.content)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Box 
          sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: 3,
            opacity: 0.7
          }}
        >
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            {searchTerm ? '没有匹配的提示词' : '没有提示词'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? '请尝试不同的搜索词' : '点击右上角的加号按钮添加提示词'}
          </Typography>
        </Box>
      )}

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="md" 
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {editingPrompt ? '编辑提示词' : '新建提示词'}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="标题"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            label="内容"
            fullWidth
            multiline
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="outlined"
            placeholder="输入提示词内容..."
            sx={{ mb: 3 }}
          />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TagIcon fontSize="small" sx={{ mr: 1 }} />
              标签
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1, gap: 0.5 }}>
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  添加标签以更好地组织提示词
                </Typography>
              )}
            </Box>
            <TextField
              size="small"
              placeholder="输入标签并按回车添加"
              fullWidth
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleKeyDown}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TagIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={() => setOpen(false)}
            variant="outlined"
            color="inherit"
          >
            取消
          </Button>
          <Button
            onClick={editingPrompt ? handleUpdatePrompt : handleAddPrompt}
            variant="contained"
            color="primary"
            disableElevation
          >
            {editingPrompt ? '更新' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
          variant="filled"
        >
          内容已复制到剪贴板
        </Alert>
      </Snackbar>
    </Box>
  );
}; 