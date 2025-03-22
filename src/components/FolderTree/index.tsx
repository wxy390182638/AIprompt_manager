import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Folder } from '../../types';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Box, 
  Typography, 
  Tooltip, 
  Divider,
  alpha,
  Paper,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { 
  Folder as FolderIcon, 
  FolderOpen as FolderOpenIcon,
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Edit as EditIcon,
  Search as SearchIcon 
} from '@mui/icons-material';

export const FolderTree: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [folderName, setFolderName] = useState('');

  const handleSelectFolder = (folder: Folder) => {
    dispatch({ type: 'SELECT_FOLDER', payload: folder });
  };

  const handleClearSelection = () => {
    dispatch({ type: 'SELECT_FOLDER', payload: null });
  };

  const handleDeleteFolder = (folderId: string) => {
    if (window.confirm('确定要删除这个文件夹吗？')) {
      dispatch({ type: 'DELETE_FOLDER', payload: folderId });
      // 如果删除的是当前选中的文件夹，清除选择
      if (state.selectedFolder?.id === folderId) {
        dispatch({ type: 'SELECT_FOLDER', payload: null });
      }
    }
  };

  const handleAddFolder = () => {
    setEditMode(false);
    setFolderName('');
    setDialogOpen(true);
  };

  const handleEditFolder = (folder: Folder, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditMode(true);
    setCurrentFolder(folder);
    setFolderName(folder.name);
    setDialogOpen(true);
  };

  const handleSaveFolder = () => {
    if (!folderName.trim()) return;

    if (editMode && currentFolder) {
      // 更新文件夹
      const updatedFolder = {
        ...currentFolder,
        name: folderName.trim()
      };
      dispatch({ type: 'UPDATE_FOLDER', payload: updatedFolder });
    } else {
      // 添加新文件夹
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: folderName.trim(),
        prompts: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      dispatch({ type: 'ADD_FOLDER', payload: newFolder });
    }

    setDialogOpen(false);
    setFolderName('');
  };

  // 过滤文件夹
  const filteredFolders = searchTerm.trim() 
    ? state.folders.filter(folder => 
        folder.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : state.folders;

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 1.5,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1rem' }}>文件夹</Typography>
        <Tooltip title="新建文件夹">
          <IconButton 
            onClick={handleAddFolder}
            size="small"
            sx={{ 
              borderRadius: 1.5,
              '&:hover': {
                backgroundColor: theme => alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Paper
        component="form"
        sx={{ 
          p: '2px 8px', 
          display: 'flex', 
          alignItems: 'center', 
          mx: 1.5, 
          my: 1.5, 
          borderRadius: 2,
          backgroundColor: theme => alpha(theme.palette.background.default, 0.5)
        }}
        elevation={0}
      >
        <SearchIcon sx={{ mr: 1, opacity: 0.5 }} fontSize="small" />
        <InputBase
          sx={{ ml: 0.5, flex: 1, fontSize: '0.875rem' }}
          placeholder="搜索文件夹..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Paper>

      <List sx={{ 
        flex: 1, 
        overflow: 'auto', 
        py: 0.5, 
        px: 1
      }}>
        {filteredFolders.length > 0 ? (
          filteredFolders.map((folder) => (
            <ListItem
              key={folder.id}
              sx={{ 
                cursor: 'pointer', 
                borderRadius: 2,
                mt: 0.5,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: theme => alpha(theme.palette.action.hover, 0.7)
                },
                ...(state.selectedFolder?.id === folder.id && {
                  backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: theme => alpha(theme.palette.primary.main, 0.15)
                  }
                })
              }}
              onClick={() => handleSelectFolder(folder)}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {state.selectedFolder?.id === folder.id ? 
                  <FolderOpenIcon color="primary" fontSize="small" /> : 
                  <FolderIcon color="action" fontSize="small" />
                }
              </ListItemIcon>
              <ListItemText 
                primary={folder.name} 
                primaryTypographyProps={{ 
                  sx: { 
                    fontSize: '0.9rem',
                    fontWeight: state.selectedFolder?.id === folder.id ? 500 : 400
                  } 
                }}
                secondary={`${folder.prompts.length} 个提示词`}
                secondaryTypographyProps={{ sx: { fontSize: '0.75rem' } }}
              />
              <Box sx={{ display: 'flex' }}>
                <Tooltip title="编辑">
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => handleEditFolder(folder, e)}
                    sx={{ 
                      opacity: 0.6, 
                      '&:hover': { opacity: 1 },
                      padding: 0.5
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="删除">
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder.id);
                    }}
                    sx={{ 
                      opacity: 0.6, 
                      '&:hover': { opacity: 1, color: 'error.main' },
                      padding: 0.5
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItem>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', mt: 3, opacity: 0.7 }}>
            <Typography variant="body2">
              {searchTerm ? '没有找到匹配的文件夹' : '没有文件夹，点击右上角加号创建'}
            </Typography>
          </Box>
        )}
      </List>
      
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {editMode ? '编辑文件夹' : '新建文件夹'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="文件夹名称"
            fullWidth
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button onClick={handleSaveFolder} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 