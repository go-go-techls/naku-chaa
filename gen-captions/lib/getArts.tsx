import { DataItem } from "@/app/api/arts/route";
import { Dispatch, SetStateAction } from "react";

// ブラウザレベルのキャッシュ管理
const createCacheKey = (id: number | string, page?: number, pageSize?: number) => {
  if (page !== undefined && pageSize !== undefined) {
    return `arts-list-${page}-${pageSize}`;
  }
  return `art-${id}`;
};

const getCachedData = (key: string) => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = sessionStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > 5 * 60 * 1000; // 5分
      
      if (!isExpired) {
        return data;
      } else {
        sessionStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }
  
  return null;
};

const setCachedData = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error("Cache write error:", error);
  }
};

export const getArt = async (
  id: number,
  setData: Dispatch<SetStateAction<DataItem>>
): Promise<void> => {
  const cacheKey = createCacheKey(id);
  
  // キャッシュから取得を試行
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    // キャッシュヒット時も短い遅延でローディング状態を表示
    await new Promise(resolve => setTimeout(resolve, 150));
    setData(cachedData);
    return;
  }

  try {
    const response = await fetch(`/api/arts/${id}`, {
      headers: {
        'Cache-Control': 'max-age=300' // 5分間キャッシュ
      }
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    
    const data = await response.json();
    setData(data);
    
    // キャッシュに保存
    setCachedData(cacheKey, data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getArts = async (
  setData: Dispatch<SetStateAction<DataItem[]>>,
  setTotal: Dispatch<SetStateAction<number>>,
  page = 1,
  pageSize = 11
): Promise<void> => {
  const cacheKey = createCacheKey('list', page, pageSize);
  
  // キャッシュから取得を試行
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    // キャッシュヒット時も短い遅延でスケルトンを表示
    await new Promise(resolve => setTimeout(resolve, 200));
    setData(cachedData.data);
    const total = Math.ceil(cachedData.total / pageSize);
    setTotal(total);
    return;
  }

  try {
    const response = await fetch(`/api/arts?page=${page}&pageSize=${pageSize}`, {
      headers: {
        'Cache-Control': 'max-age=300' // 5分間キャッシュ
      }
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    
    const data = await response.json();
    setData(data.data);
    const total = Math.ceil(data.total / pageSize);
    setTotal(total);
    
    // キャッシュに保存
    setCachedData(cacheKey, { data: data.data, total: data.total });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// キャッシュをクリアする関数（新しい作品作成時などに使用）
export const clearArtsCache = () => {
  if (typeof window === 'undefined') return;
  
  const keys = Object.keys(sessionStorage);
  keys.forEach(key => {
    if (key.startsWith('arts-') || key.startsWith('art-')) {
      sessionStorage.removeItem(key);
    }
  });
};
