import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  alpha,
  useTheme,
  Tooltip,
  Divider,
  Fade,
  Paper,
  ListItemSecondaryAction,
  Collapse
} from '@mui/material';
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CreateNewFolder as CreateNewFolderIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { Folder } from '../../types';

export const FolderList: React.FC = () => {
  const theme = useTheme();
  const { state, dispatch } = useAppContext();
  const [open, setOpen] = React.useState(false);
  const [folderName, setFolderName] = React.useState('');
  const [editingFolder, setEditingFolder] = React.useState<Folder | null>(null);
  const [expandedSections, setExpandedSections] = React.useState({
    myFolders: true,
  });

  const handleToggleSection = (section: 'myFolders') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAddFolder = () => {
    if (folderName.trim()) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: folderName.trim(),
        prompts: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      dispatch({
        type: 'ADD_FOLDER',
        payload: newFolder
      });
      
      setFolderName('');
      setOpen(false);
    }
  };

  const handleUpdateFolder = () => {
    if (editingFolder && folderName.trim()) {
      const updatedFolder: Folder = {
        ...editingFolder,
        name: folderName.trim(),
        updatedAt: Date.now()
      };
      
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: updatedFolder
      });
      
      setFolderName('');
      setEditingFolder(null);
      setOpen(false);
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    if (window.confirm('确定要删除这个文件夹吗？这将删除其中的所有提示词！')) {
      dispatch({
        type: 'DELETE_FOLDER',
        payload: folderId
      });
    }
  };

  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setOpen(true);
  };

  const handleSelectFolder = (folder: Folder) => {
    dispatch({
      type: 'SELECT_FOLDER',
      payload: folder
    });
  };

  const myFolders = state.folders;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      overflow: 'hidden',
      bgcolor: alpha(theme.palette.background.paper, 0.4),
      borderRight: '1px solid',
      borderColor: 'divider'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2, 
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 'medium',
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FolderIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
          提示词文件夹
        </Typography>
        <Tooltip title="新建文件夹">
          <IconButton 
            onClick={() => {
              setEditingFolder(null);
              setFolderName('');
              setOpen(true);
            }}
            size="small"
            color="primary"
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        px: 0.5
      }}>
        {/* 我的文件夹 */}
        <Box sx={{ mb: 1 }}>
          <ListItemButton 
            dense 
            onClick={() => handleToggleSection('myFolders')}
            sx={{ 
              borderRadius: 1.5,
              my: 0.5,
              mx: 1
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {expandedSections.myFolders ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  我的文件夹
                </Typography>
              } 
            />
          </ListItemButton>
          
          <Collapse in={expandedSections.myFolders}>
            <List dense disablePadding>
              {myFolders.length > 0 ? (
                myFolders.map((folder) => (
                  <ListItem 
                    key={folder.id} 
                    disablePadding
                    disableGutters
                    secondaryAction={
                      <Box>
                        <Tooltip title="编辑">
                          <IconButton 
                            edge="end" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditFolder(folder);
                            }}
                            size="small"
                            sx={{ opacity: 0.7 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="删除">
                          <IconButton 
                            edge="end" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFolder(folder.id);
                            }}
                            size="small"
                            sx={{ 
                              opacity: 0.7,
                              '&:hover': { color: theme.palette.error.main }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                    sx={{ 
                      '&:hover .MuiListItemSecondaryAction-root': {
                        visibility: 'visible',
                      },
                      '& .MuiListItemSecondaryAction-root': {
                        visibility: 'hidden',
                      },
                    }}
                  >
                    <ListItemButton
                      selected={state.selectedFolder?.id === folder.id}
                      onClick={() => handleSelectFolder(folder)}
                      sx={{ 
                        borderRadius: 1,
                        mb: 0.5,
                        ml: 2,
                        mr: 1,
                        px: 1.5,
                        '&.Mui-selected': {
                          bgcolor: alpha(theme.palette.primary.main, 0.15),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.25),
                          }
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {state.selectedFolder?.id === folder.id ? (
                          <FolderOpenIcon 
                            fontSize="small" 
                            color="primary" 
                            sx={{ opacity: 0.9 }}
                          />
                        ) : (
                          <FolderIcon 
                            fontSize="small" 
                            sx={{ opacity: 0.7 }}
                          />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography 
                            variant="body2" 
                            noWrap
                            sx={{ 
                              fontWeight: state.selectedFolder?.id === folder.id ? 'medium' : 'normal',
                              color: state.selectedFolder?.id === folder.id ? 'primary.main' : 'text.primary',
                            }}
                          >
                            {folder.name}
                          </Typography>
                        } 
                        secondary={
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: '0.7rem',
                            }}
                          >
                            {folder.prompts.length} 个提示词
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                <Box sx={{ py: 2, px: 3, textAlign: 'center' }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: '0.8rem' }}
                  >
                    没有文件夹
                  </Typography>
                </Box>
              )}
            </List>
          </Collapse>
        </Box>
      </Box>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {editingFolder ? '编辑文件夹' : '新建文件夹'}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            label="文件夹名称"
            fullWidth
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
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
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={() => setOpen(false)}
            variant="outlined"
            color="inherit"
          >
            取消
          </Button>
          <Button
            onClick={editingFolder ? handleUpdateFolder : handleAddFolder}
            variant="contained"
            color="primary"
            disableElevation
          >
            {editingFolder ? '更新' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 