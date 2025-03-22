import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, AppAction, Folder, Prompt, AppContextType, Settings } from '../types';

// 默认设置
const defaultSettings: Settings = {
  theme: 'system',
  language: 'zh-CN',
  autoSave: true,
  autoSyncInterval: 5
};

// 初始状态
const initialState: AppState = {
  folders: [],
  selectedFolder: null,
  currentTab: 'prompts',
  settings: defaultSettings
};

const AppContext = createContext<AppContextType | null>(null);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_FOLDERS':
      return {
        ...state,
        folders: action.payload
      };
    case 'ADD_FOLDER':
      return {
        ...state,
        folders: [...state.folders, action.payload]
      };
    case 'UPDATE_FOLDER':
      if ('folderId' in action.payload && 'name' in action.payload) {
        const { folderId, name } = action.payload;
        const updatedFolders = state.folders.map(folder =>
          folder.id === folderId
            ? { ...folder, name, updatedAt: Date.now() }
            : folder
        );
        return {
          ...state,
          folders: updatedFolders,
          selectedFolder: state.selectedFolder?.id === folderId
            ? { ...state.selectedFolder, name, updatedAt: Date.now() }
            : state.selectedFolder,
        };
      }
      else {
        const updatedFolder = action.payload as Folder;
        const updatedFolders = state.folders.map(folder =>
          folder.id === updatedFolder.id
            ? { ...updatedFolder, updatedAt: Date.now() }
            : folder
        );
        return {
          ...state,
          folders: updatedFolders,
          selectedFolder: state.selectedFolder?.id === updatedFolder.id
            ? { ...updatedFolder, updatedAt: Date.now() }
            : state.selectedFolder,
        };
      }
    case 'DELETE_FOLDER':
      return {
        ...state,
        folders: state.folders.filter(folder => folder.id !== action.payload),
        selectedFolder: state.selectedFolder?.id === action.payload ? null : state.selectedFolder
      };
    case 'SELECT_FOLDER':
      return {
        ...state,
        selectedFolder: action.payload
      };
    case 'SET_CURRENT_TAB':
      return {
        ...state,
        currentTab: action.payload
      };
    case 'ADD_PROMPT':
      const { folderId, prompt } = action.payload;
      const updatedFolders = state.folders.map(folder =>
        folder.id === folderId
          ? {
              ...folder,
              prompts: [...folder.prompts, prompt],
              updatedAt: Date.now()
            }
          : folder
      );
      
      return {
        ...state,
        folders: updatedFolders,
        selectedFolder: state.selectedFolder?.id === folderId
          ? {
              ...state.selectedFolder,
              prompts: [...state.selectedFolder.prompts, prompt],
              updatedAt: Date.now()
            }
          : state.selectedFolder
      };
    case 'UPDATE_PROMPT':
      const { folderId: updateFolderId, prompt: updatedPrompt } = action.payload;
      const foldersAfterUpdate = state.folders.map(folder =>
        folder.id === updateFolderId
          ? {
              ...folder,
              prompts: folder.prompts.map(p =>
                p.id === updatedPrompt.id ? updatedPrompt : p
              ),
              updatedAt: Date.now()
            }
          : folder
      );
      
      return {
        ...state,
        folders: foldersAfterUpdate,
        selectedFolder: state.selectedFolder?.id === updateFolderId
          ? {
              ...state.selectedFolder,
              prompts: state.selectedFolder.prompts.map(p =>
                p.id === updatedPrompt.id ? updatedPrompt : p
              ),
              updatedAt: Date.now()
            }
          : state.selectedFolder
      };
    case 'DELETE_PROMPT':
      const { folderId: deleteFolderId, promptId } = action.payload;
      const foldersAfterDelete = state.folders.map(folder =>
        folder.id === deleteFolderId
          ? {
              ...folder,
              prompts: folder.prompts.filter(p => p.id !== promptId),
              updatedAt: Date.now()
            }
          : folder
      );
      
      return {
        ...state,
        folders: foldersAfterDelete,
        selectedFolder: state.selectedFolder?.id === deleteFolderId
          ? {
              ...state.selectedFolder,
              prompts: state.selectedFolder.prompts.filter(p => p.id !== promptId),
              updatedAt: Date.now()
            }
          : state.selectedFolder
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: action.payload
      };
    case 'RESTORE_DATA':
      return action.payload;
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 首次加载时从 chrome.storage 获取数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await chrome.storage.local.get(['appData']);
        if (data.appData) {
          dispatch({
            type: 'RESTORE_DATA',
            payload: data.appData
          });
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    };

    loadData();
  }, []);

  // 当状态更改时保存到 chrome.storage
  useEffect(() => {
    const saveData = async () => {
      if (state !== initialState) {
        try {
          await chrome.storage.local.set({ appData: state });
        } catch (error) {
          console.error('保存数据失败:', error);
        }
      }
    };

    // 如果启用了自动保存，就立即保存
    if (state.settings.autoSave) {
      saveData();
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 