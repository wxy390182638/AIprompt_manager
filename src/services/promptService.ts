import { useState, useEffect } from 'react';

// 定义提示词类型
export interface PopularPrompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
}

// 定义API响应类型
export interface PromptsResponse {
  categories: string[];
  prompts: PopularPrompt[];
}

// 默认提示词数据（作为备份，当远程加载失败时使用）
const DEFAULT_PROMPTS: PromptsResponse = {
  categories: ["全部", "通用", "写作", "编程", "商业"],
  prompts: [
    {
      id: "pp1",
      title: "角色扮演助手",
      content: "我希望你能扮演一个助手角色，帮助我完成各种任务。你应该专业、友好，并且有耐心。",
      tags: ["角色扮演", "助手"],
      category: "通用"
    },
    {
      id: "pp2",
      title: "学术论文修改",
      content: "请帮我修改以下学术论文的语法和表达，使其更加专业和流畅，但保留原文的学术风格和专业术语。",
      tags: ["学术", "写作"],
      category: "写作"
    }
  ]
};

// 默认情况下使用GitHub提供的raw内容URL
// 这里可以替换为您实际托管JSON文件的URL
const DEFAULT_PROMPT_URL = "https://raw.githubusercontent.com/wxy390182638/AIprompt_manager/master/popular-prompts.json";

// 从存储中获取自定义URL
const getCustomPromptUrl = async (): Promise<string> => {
  try {
    const result = await chrome.storage.local.get(['promptsUrl']);
    return result.promptsUrl || DEFAULT_PROMPT_URL;
  } catch (error) {
    console.error('获取提示词URL失败:', error);
    return DEFAULT_PROMPT_URL;
  }
};

// 设置自定义URL
export const setCustomPromptUrl = async (url: string): Promise<void> => {
  try {
    await chrome.storage.local.set({ promptsUrl: url });
  } catch (error) {
    console.error('设置提示词URL失败:', error);
  }
};

// 获取上次更新时间
export const getLastUpdateTime = async (): Promise<number | null> => {
  try {
    const result = await chrome.storage.local.get(['promptsLastUpdate']);
    return result.promptsLastUpdate || null;
  } catch (error) {
    console.error('获取上次更新时间失败:', error);
    return null;
  }
};

// 设置上次更新时间
const setLastUpdateTime = async (): Promise<void> => {
  try {
    await chrome.storage.local.set({ promptsLastUpdate: Date.now() });
  } catch (error) {
    console.error('设置上次更新时间失败:', error);
  }
};

// 从本地存储获取缓存的提示词数据
const getCachedPrompts = async (): Promise<PromptsResponse | null> => {
  try {
    const result = await chrome.storage.local.get(['cachedPrompts']);
    return result.cachedPrompts || null;
  } catch (error) {
    console.error('获取缓存的提示词失败:', error);
    return null;
  }
};

// 缓存提示词数据到本地存储
const cachePrompts = async (data: PromptsResponse): Promise<void> => {
  try {
    await chrome.storage.local.set({ cachedPrompts: data });
    await setLastUpdateTime();
  } catch (error) {
    console.error('缓存提示词失败:', error);
  }
};

// 从远程URL获取提示词数据
export const fetchPromptsFromRemote = async (forceRefresh = false): Promise<PromptsResponse> => {
  try {
    // 如果不是强制刷新，先尝试获取缓存数据
    if (!forceRefresh) {
      const cached = await getCachedPrompts();
      if (cached) {
        return cached;
      }
    }

    // 获取当前配置的URL
    const url = await getCustomPromptUrl();
    
    // 添加时间戳参数避免缓存
    const fetchUrl = `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`;
    
    // 获取远程数据
    const response = await fetch(fetchUrl);
    
    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }
    
    const data: PromptsResponse = await response.json();
    
    // 验证数据结构
    if (!data.prompts || !Array.isArray(data.prompts) || !data.categories || !Array.isArray(data.categories)) {
      throw new Error('无效的提示词数据格式');
    }
    
    // 缓存获取的数据
    await cachePrompts(data);
    
    return data;
  } catch (error) {
    console.error('获取热门提示词失败:', error);
    
    // 返回缓存或默认数据
    const cached = await getCachedPrompts();
    return cached || DEFAULT_PROMPTS;
  }
};

// React Hook，用于在组件中获取提示词数据
export const usePopularPrompts = (initialForceRefresh = false) => {
  const [data, setData] = useState<PromptsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  const refreshData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchPromptsFromRemote(forceRefresh);
      setData(response);
      
      const updateTime = await getLastUpdateTime();
      setLastUpdate(updateTime);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('获取提示词失败'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData(initialForceRefresh);
  }, [initialForceRefresh]);

  return { data, loading, error, lastUpdate, refreshData };
}; 