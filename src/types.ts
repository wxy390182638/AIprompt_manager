export interface Prompt {
  id: string;
  folderId: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  prompts: Prompt[];
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  autoSave: boolean;
  autoSyncInterval: number;
}

export interface AppState {
  folders: Folder[];
  selectedFolder: Folder | null;
  currentTab: string;
  settings: Settings;
}

export type AppAction =
  | { type: 'SET_FOLDERS'; payload: Folder[] }
  | { type: 'ADD_FOLDER'; payload: Folder }
  | { type: 'UPDATE_FOLDER'; payload: Folder | { folderId: string; name: string } }
  | { type: 'DELETE_FOLDER'; payload: string }
  | { type: 'SELECT_FOLDER'; payload: Folder | null }
  | { type: 'SET_CURRENT_TAB'; payload: string }
  | { type: 'ADD_PROMPT'; payload: { folderId: string; prompt: Prompt } }
  | { type: 'UPDATE_PROMPT'; payload: { folderId: string; prompt: Prompt } }
  | { type: 'DELETE_PROMPT'; payload: { folderId: string; promptId: string } }
  | { type: 'UPDATE_SETTINGS'; payload: Settings }
  | { type: 'RESTORE_DATA'; payload: AppState };

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} 