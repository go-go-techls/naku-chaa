import { Dispatch, SetStateAction } from "react";

export async function fetchData(
  base64Image: string,
  prompt: string,
  setData: Dispatch<SetStateAction<string>>
): Promise<string> {
  const req = {
    prompt: prompt,
    images: [base64Image],
  };
  console.log("start to generate by OpenAI!");
  const URL = "/api/arts/generate";

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, response.statusText, errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const reader = response!.body!.getReader();
    let accumulatedResponse = ""; // response値を蓄積する変数

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log(accumulatedResponse); // 最後に蓄積されたテキストをログに出力
        return accumulatedResponse; // ここで accumulatedResponse を return する
      }

      // 受信したバイナリーデータ (value) をテキストに変換する
      const decoder = new TextDecoder("utf-8");
      const text = decoder.decode(value);

      // テキストには複数のメッセージが含まれている可能性があるため、
      // 改行 (LF) で分離して、1 行ずつ処理する
      const lines = text.split(/\n+/);

      for (const line of lines) {
        // 先頭の "data: " を削除してメッセージ本文 (JSON 文字列か "[DONE]" のいずれか) を抜き出す
        const jsonText = line.replace(/^data:\s*/, "");

        if (jsonText === "[DONE]") {
          return accumulatedResponse; // ストリームの終端を受信したら accumulatedResponse を返す
        } else if (jsonText) {
          try {
            const data = JSON.parse(jsonText);
            if (data.choices && data.choices[0] && data.choices[0].delta) {
              const content = data.choices[0].delta.content;
              if (content) {
                accumulatedResponse += content;
                setData(accumulatedResponse);
              }
            }
          } catch (error) {
            console.error("Error parsing JSON:", error, "JSON text:", jsonText);
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    setData("エラーです。もう一度試してみてください。");
    return "エラーです。もう一度試してみてください。"; // エラー時も return する
  }
}
