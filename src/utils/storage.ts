/// <reference types="chrome"/>
import { Folder, Prompt } from '../types';

/**
 * Chrome存储管理工具类
 */
export class StorageManager {
  private static STORAGE_KEY = 'folders';

  /**
   * 获取所有文件夹
   */
  static async getFolders(): Promise<Folder[]> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([this.STORAGE_KEY], (result: { folders?: Folder[] }) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve(result.folders || []);
      });
    });
  }

  /**
   * 保存所有文件夹
   */
  static async setFolders(folders: Folder[]): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [this.STORAGE_KEY]: folders }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve();
      });
    });
  }

  /**
   * 添加新文件夹
   */
  static async addFolder(name: string): Promise<Folder> {
    const folders = await this.getFolders();
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      prompts: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await this.setFolders([...folders, newFolder]);
    return newFolder;
  }

  /**
   * 更新文件夹
   */
  static async updateFolder(folderId: string, name: string): Promise<void> {
    const folders = await this.getFolders();
    const updatedFolders = folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, name, updatedAt: Date.now() }
        : folder
    );
    await this.setFolders(updatedFolders);
  }

  /**
   * 删除文件夹
   */
  static async deleteFolder(folderId: string): Promise<void> {
    const folders = await this.getFolders();
    const updatedFolders = folders.filter(folder => folder.id !== folderId);
    await this.setFolders(updatedFolders);
  }

  /**
   * 添加提示词到文件夹
   */
  static async addPrompt(folderId: string, prompt: Prompt): Promise<void> {
    const folders = await this.getFolders();
    const folderIndex = folders.findIndex(folder => folder.id === folderId);
    
    if (folderIndex === -1) {
      throw new Error('文件夹不存在');
    }

    folders[folderIndex].prompts.push(prompt);
    folders[folderIndex].updatedAt = Date.now();
    
    await this.setFolders(folders);
  }

  /**
   * 更新提示词
   */
  static async updatePrompt(prompt: Prompt): Promise<void> {
    const folders = await this.getFolders();
    const folderIndex = folders.findIndex(folder => folder.id === prompt.folderId);
    
    if (folderIndex === -1) {
      throw new Error('文件夹不存在');
    }

    const promptIndex = folders[folderIndex].prompts.findIndex(p => p.id === prompt.id);
    
    if (promptIndex === -1) {
      throw new Error('提示词不存在');
    }

    folders[folderIndex].prompts[promptIndex] = prompt;
    folders[folderIndex].updatedAt = Date.now();
    
    await this.setFolders(folders);
  }

  /**
   * 删除提示词
   */
  static async deletePrompt(folderId: string, promptId: string): Promise<void> {
    const folders = await this.getFolders();
    const folderIndex = folders.findIndex(folder => folder.id === folderId);
    
    if (folderIndex === -1) {
      throw new Error('文件夹不存在');
    }

    const promptIndex = folders[folderIndex].prompts.findIndex(p => p.id === promptId);
    
    if (promptIndex === -1) {
      throw new Error('提示词不存在');
    }

    folders[folderIndex].prompts.splice(promptIndex, 1);
    folders[folderIndex].updatedAt = Date.now();
    
    await this.setFolders(folders);
  }

  /**
   * 导出数据
   */
  static async exportData(): Promise<string> {
    const folders = await this.getFolders();
    return JSON.stringify({ folders }, null, 2);
  }

  /**
   * 导入数据
   */
  static async importData(jsonString: string): Promise<void> {
    try {
      const data = JSON.parse(jsonString);
      if (!Array.isArray(data.folders)) {
        throw new Error('无效的数据格式');
      }
      await this.setFolders(data.folders);
    } catch (error) {
      console.error('导入数据失败:', error);
      throw new Error('导入失败：数据格式不正确');
    }
  }
}
