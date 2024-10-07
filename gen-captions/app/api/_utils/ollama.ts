export const generate = async (
  prompt: string,
  base64Image: string
): Promise<Response> => {
  const URL = "http://localhost:11434/api/generate";
  const req = {
    model: "llava:13b", // 少し大きなモデル
    prompt: prompt,
    images: [base64Image],
    options: {
      // num_predict: 5, // 短くしとくと、テストしやすい
      repeat_penalty: 1.2, // 繰り返さないように
    },
  };
  return await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });
};
