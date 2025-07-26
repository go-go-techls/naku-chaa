import { clearArtsCache } from "./getArts";

export type Data = {
  title: string;
  feature: string;
  advantage: string;
  advice: string;
  image: string;
  rating: number;
  comment: string;
  character: string;
  is_public_allowed: boolean;
};

export async function postResult(data: Data) {
  if (process.env.NODE_ENV === 'development') {
    console.log('作品保存開始。画像サイズ:', data.image.length, 'bytes');
  }
  try {
    const response = await fetch("/api/arts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('保存エラー:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (process.env.NODE_ENV === 'development') {
      console.log('作品保存成功:', result);
    }
    
    // 作品保存成功時は必ずキャッシュクリア
    if (typeof window !== 'undefined') {
      clearArtsCache(false);
    }
    
    // console.log("APIからのレスポンス:", result);
    // 必要に応じて状態のリセットや通知など
  } catch (error) {
    console.error("APIからエラーが返されました:", error);
    // エラー処理（ユーザーへの通知、ログの記録など）
  }
}
