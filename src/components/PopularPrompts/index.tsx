import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Tab,
  Tabs,
  Paper,
  Divider,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Radio,
  ListItemIcon,
  FormControlLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Folder as FolderIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { Prompt, Folder } from '../../types';

// 预设的提示词模板
const POPULAR_PROMPTS: Array<{
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
}> = [
  {
    id: 'pp1',
    title: '角色扮演助手',
    content: '我希望你能扮演一个助手角色，帮助我完成各种任务。你应该专业、友好，并且有耐心。',
    tags: ['角色扮演', '助手'],
    category: '通用'
  },
  {
    id: 'pp2',
    title: '学术论文修改',
    content: '请帮我修改以下学术论文的语法和表达，使其更加专业和流畅，但保留原文的学术风格和专业术语。',
    tags: ['学术', '写作'],
    category: '写作'
  },
  {
    id: 'pp3',
    title: '代码优化',
    content: '请检查并优化以下代码，指出可能的性能问题和潜在的bug，并提供改进建议。',
    tags: ['编程', '优化'],
    category: '编程'
  },
  {
    id: 'pp4',
    title: '市场调研分析',
    content: '请帮我分析以下产品的市场前景，包括目标客户群体、竞争对手分析和市场机会。',
    tags: ['市场', '分析'],
    category: '商业'
  },
  {
    id: 'pp5',
    title: '创意故事生成',
    content: '请根据以下关键词，生成一个创意短故事，包含引人入胜的情节和生动的人物描写。',
    tags: ['创意', '写作'],
    category: '写作'
  },
  {
    id: 'pp6',
    title: 'SQL查询优化',
    content: '请分析并优化以下SQL查询语句，提高其执行效率并解释你的优化理由。',
    tags: ['数据库', 'SQL'],
    category: '编程'
  },
  {
    id: 'pp7',
    title: '产品功能规划',
    content: '请帮我为这个产品想出5个创新功能，并简要描述每个功能的用户价值和实现复杂度。',
    tags: ['产品', '规划'],
    category: '商业'
  },
  {
    id: 'pp8',
    title: '面试准备',
    content: '我即将参加一场关于[职位]的面试，请提供一些可能被问到的问题和高质量回答示例。',
    tags: ['面试', '职场'],
    category: '通用'
  }
];

const CATEGORIES = ['全部', '通用', '写作', '编程', '商业'];

export const PopularPrompts: React.FC = () => {
  const theme = useTheme();
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // 新增的状态
  const [selectedPrompt, setSelectedPrompt] = useState<typeof POPULAR_PROMPTS[0] | null>(null);
  const [openFolderDialog, setOpenFolderDialog] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [openCreateFolderDialog, setOpenCreateFolderDialog] = useState(false);

  const handleCategoryChange = (event: React.SyntheticEvent, newCategory: string) => {
    setSelectedCategory(newCategory);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // 修改handleImportPrompt函数
  const handleImportPrompt = (prompt: typeof POPULAR_PROMPTS[0]) => {
    setSelectedPrompt(prompt);
    
    if (state.folders.length === 0) {
      // 如果没有文件夹，则显示创建文件夹对话框
      setOpenCreateFolderDialog(true);
    } else {
      // 如果有文件夹，则显示选择文件夹对话框
      setSelectedFolderId(state.selectedFolder?.id || state.folders[0].id);
      setOpenFolderDialog(true);
    }
  };
  
  // 添加新函数：确认将提示词导入到选中的文件夹
  const handleConfirmImport = () => {
    if (!selectedPrompt || !selectedFolderId) return;
    
    const targetFolder = state.folders.find(folder => folder.id === selectedFolderId);
    if (!targetFolder) return;
    
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      folderId: targetFolder.id,
      title: selectedPrompt.title,
      content: selectedPrompt.content,
      tags: selectedPrompt.tags,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    dispatch({
      type: 'ADD_PROMPT',
      payload: {
        folderId: targetFolder.id,
        prompt: newPrompt
      }
    });

    setSnackbarMessage(`已导入到文件夹: ${targetFolder.name}`);
    setOpenSnackbar(true);
    setOpenFolderDialog(false);
    setSelectedPrompt(null);
  };
  
  // 添加新函数：创建新文件夹并导入提示词
  const handleCreateFolder = () => {
    if (!selectedPrompt || !newFolderName.trim()) return;
    
    // 创建新文件夹
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      prompts: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    dispatch({
      type: 'ADD_FOLDER',
      payload: newFolder
    });
    
    // 创建新提示词
    const newPrompt: Prompt = {
      id: (Date.now() + 1).toString(),
      folderId: newFolder.id,
      title: selectedPrompt.title,
      content: selectedPrompt.content,
      tags: selectedPrompt.tags,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // 添加提示词到新文件夹
    dispatch({
      type: 'ADD_PROMPT',
      payload: {
        folderId: newFolder.id,
        prompt: newPrompt
      }
    });
    
    setSnackbarMessage(`已创建文件夹"${newFolderName}"并导入提示词`);
    setOpenSnackbar(true);
    setOpenCreateFolderDialog(false);
    setNewFolderName('');
    setSelectedPrompt(null);
  };

  // 过滤提示词
  const filteredPrompts = POPULAR_PROMPTS.filter(prompt => {
    const matchesSearch = 
      searchTerm === '' || 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === '全部' || 
      prompt.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 'medium' }}>
          精选提示词
        </Typography>
        <Typography variant="body2" color="text.secondary">
          浏览精选提示词模板，一键导入到你的文件夹中
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', mb: 3 }}>
        <Paper
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            p: '2px 8px',
            mr: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.default, 0.6),
          }}
          elevation={0}
        >
          <SearchIcon color="action" fontSize="small" sx={{ opacity: 0.6 }} />
          <TextField
            placeholder="搜索提示词..."
            variant="standard"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              disableUnderline: true,
              sx: { ml: 1, fontSize: '0.95rem' }
            }}
          />
          {searchTerm && (
            <IconButton 
              size="small" 
              onClick={clearSearch}
              sx={{ opacity: 0.7 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>
      </Box>

      <Paper sx={{ mb: 3, borderRadius: 2 }} elevation={0}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 80,
            }
          }}
        >
          {CATEGORIES.map(category => (
            <Tab 
              key={category} 
              label={category} 
              value={category} 
            />
          ))}
        </Tabs>
        <Divider />
      </Paper>

      {filteredPrompts.length > 0 ? (
        <Grid container spacing={2}>
          {filteredPrompts.map(prompt => (
            <Grid item xs={12} sm={6} md={4} key={prompt.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: `0px 4px 15px ${alpha(theme.palette.primary.main, 0.12)}`,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ flex: 1, pb: 1 }}>
                  <Box sx={{ mb: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {prompt.tags.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          '& .MuiChip-label': { px: 1, fontSize: '0.7rem' },
                          height: 20
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500, mb: 1 }}>
                    {prompt.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {prompt.content}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={() => handleImportPrompt(prompt)}
                    sx={{ textTransform: 'none' }}
                  >
                    导入到我的文件夹
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 10
          }}
        >
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            没有找到匹配的提示词
          </Typography>
          <Typography variant="body2" color="text.secondary">
            尝试使用不同的搜索词或分类
          </Typography>
        </Box>
      )}

      {/* 选择文件夹对话框 */}
      <Dialog 
        open={openFolderDialog} 
        onClose={() => setOpenFolderDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>选择导入的文件夹</DialogTitle>
        <DialogContent dividers>
          <List>
            {state.folders.map((folder) => (
              <ListItem 
                key={folder.id}
                button
                dense
                onClick={() => setSelectedFolderId(folder.id)}
              >
                <ListItemIcon>
                  <Radio 
                    checked={selectedFolderId === folder.id}
                    onChange={() => setSelectedFolderId(folder.id)}
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={folder.name}
                  secondary={`${folder.prompts.length} 个提示词`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFolderDialog(false)}>
            取消
          </Button>
          <Button onClick={handleConfirmImport} color="primary" variant="contained">
            确认导入
          </Button>
        </DialogActions>
      </Dialog>

      {/* 创建文件夹对话框 */}
      <Dialog 
        open={openCreateFolderDialog} 
        onClose={() => setOpenCreateFolderDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>创建新文件夹</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            您还没有文件夹，请创建一个新文件夹以导入提示词
          </Typography>
          <TextField
            autoFocus
            label="文件夹名称"
            fullWidth
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            variant="outlined"
            margin="dense"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FolderIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateFolderDialog(false)}>
            取消
          </Button>
          <Button 
            onClick={handleCreateFolder} 
            color="primary" 
            variant="contained"
            disabled={!newFolderName.trim()}
          >
            创建并导入
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
          severity="success" 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 