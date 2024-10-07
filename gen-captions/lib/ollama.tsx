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
  console.log("start to generate!");
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
    let accumulatedText = ""; // 読み取ったテキストを蓄積する変数
    let accumulatedResponse = ""; // response値を蓄積する変数

    // チャンク処理の再帰関数をasync/awaitで実装
    const processText = async () => {
      const { done, value } = await reader.read();
      if (done) {
        console.log(accumulatedResponse); // 最後に蓄積されたテキストをログに出力
        return;
      }

      // チャンクをデコードして蓄積
      accumulatedText += new TextDecoder("utf-8").decode(value);

      // 蓄積されたテキストから完全なJSONオブジェクトを抽出し処理
      try {
        let startPos = 0;
        let endPos = 0;

        // 複数のJSONオブジェクトを処理するためのループ
        while (
          (startPos = accumulatedText.indexOf("{", endPos)) !== -1 &&
          (endPos = accumulatedText.indexOf("}", startPos)) !== -1
        ) {
          const jsonString = accumulatedText.substring(startPos, endPos + 1);
          try {
            const jsonObj = JSON.parse(jsonString);
            if (jsonObj.response) {
              // JSONオブジェクトのresponseプロパティを処理
              accumulatedResponse += jsonObj.response; // divに内容を追加
              setData(accumulatedResponse);
            }
          } catch (e) {
            console.error("Error parsing JSON chunk", e);
          }
          // 処理済みの部分を蓄積テキストから削除
          accumulatedText = accumulatedText.substring(endPos + 1);
          endPos = 0; // インデックスをリセット
        }
      } catch (error) {
        console.error("Error processing accumulated text", error);
      }

      // 次のチャンクを再帰的に処理
      await processText();
    };

    await processText();
    return accumulatedResponse;
  } catch (error) {
    console.error(error);
    setData("エラーです。もう一度試してみてください。");
  }
}
