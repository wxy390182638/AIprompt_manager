import { Dispatch } from 'react';

/**
 * 提示词接口定义
 */
export interface Prompt {
  /** 唯一标识符 */
  id: string;
  /** 所属文件夹ID */
  folderId: string;
  /** 提示词标题 */
  title: string;
  /** 提示词内容 */
  content: string;
  /** 标签列表 */
  tags?: string[];
  /** 创建时间 */
  createdAt: number;
  /** 更新时间 */
  updatedAt: number;
}

/**
 * 文件夹接口定义
 */
export interface Folder {
  /** 唯一标识符 */
  id: string;
  /** 文件夹名称 */
  name: string;
  /** 文件夹中的提示词列表 */
  prompts: Prompt[];
  /** 创建时间 */
  createdAt: number;
  /** 更新时间 */
  updatedAt: number;
}

/**
 * 应用设置接口定义
 */
export interface AppSettings {
  /** 主题模式 */
  theme: 'light' | 'dark';
  /** 显示语言 */
  language: string;
}

/**
 * 应用状态接口定义
 */
export interface AppState {
  /** 所有文件夹 */
  folders: Folder[];
  /** 当前选中的文件夹 */
  selectedFolder: Folder | null;
  /** 当前激活的标签页 */
  currentTab: 'prompts' | 'settings';
}

/**
 * 应用操作类型定义
 */
export type AppAction =
  | { type: 'SET_FOLDERS'; payload: Folder[] }
  | { type: 'ADD_FOLDER'; payload: Folder }
  | { type: 'UPDATE_FOLDER'; payload: { folderId: string; name: string } | Folder }
  | { type: 'DELETE_FOLDER'; payload: string }
  | { type: 'SELECT_FOLDER'; payload: Folder | null }
  | { type: 'SET_CURRENT_TAB'; payload: AppState['currentTab'] }
  | { type: 'ADD_PROMPT'; payload: { folderId: string; prompt: Prompt } }
  | { type: 'UPDATE_PROMPT'; payload: { folderId: string; prompt: Prompt } }
  | { type: 'DELETE_PROMPT'; payload: { folderId: string; promptId: string } };

/**
 * 上下文类型定义
 */
export interface AppContextType {
  state: AppState;
  dispatch: Dispatch<AppAction>;
} 