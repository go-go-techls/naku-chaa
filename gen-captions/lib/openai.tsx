import { Dispatch, SetStateAction } from "react";

export async function fetchData(
  base64Image: string,
  prompt: string,
  setData: Dispatch<SetStateAction<string>>
) {
  const req = {
    prompt: prompt,
    images: [base64Image],
  };
  console.log("start to generate by OpenAI!");
  const URL = "/api/generate";

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });

    const reader = response!.body!.getReader();
    let accumulatedResponse = ""; // response値を蓄積する変数

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      // 受信したバイナリーデータ (value) をテキストに変換する
      const decoder = new TextDecoder("utf-8");
      const text = decoder.decode(value);

      // テキストには複数のメッセージが含まれている可能性があるため、
      // 改行 (LF) で分離して、1 行ずつ処理する
      const lines = text.split(/\n+/);
      console.log(lines);

      for (const line of lines) {
        // 先頭の "data: " を削除してメッセージ本文 (JSON 文字列か "[DONE]" のいずれか) を抜き出す
        console.log(line);

        const jsonText = line.replace(/^data:\s*/, "");
        console.log(jsonText);

        if (jsonText === "[DONE]") {
          break;
        } else if (jsonText) {
          try {
            const data = JSON.parse(jsonText);
            const content = data.choices[0].delta.content;
            if (content) {
              accumulatedResponse += content;
              console.log(content);
              console.log(accumulatedResponse);

              setData(accumulatedResponse);
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    setData("エラーです。もう一度試してみてください。");
  }
}
