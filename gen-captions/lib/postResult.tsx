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
  try {
    const response = await fetch("/api/arts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    // console.log("APIからのレスポンス:", result);
    // 必要に応じて状態のリセットや通知など
  } catch (error) {
    console.error("APIからエラーが返されました:", error);
    // エラー処理（ユーザーへの通知、ログの記録など）
  }
}
