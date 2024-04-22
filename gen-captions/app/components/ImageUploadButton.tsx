import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Fab, Input } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Dispatch, SetStateAction } from "react";

interface ChildComponentProps {
  setImageBase64: Dispatch<SetStateAction<string>>;
  setData: Dispatch<SetStateAction<string>>;
}

function ImageUploadButton({ setImageBase64, setData }: ChildComponentProps) {
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImageBase64(e.target!.result as string);
      };
      reader.readAsDataURL(file);
    }
    //   };

    //   async function fetchData() {
    const req = {
      model: "llama2",
      prompt: "この作品のタイトルを日本語で答えて",
    };

    const URL = "http://localhost:11434/api/generate";

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });
      // setLoading(true);

      const reader = response!.body!.getReader();
      let accumulatedText = ""; // 読み取ったテキストを蓄積する変数
      let accumulatedResponse = ""; // response値を蓄積する変数

      // チャンク処理の再帰関数をasync/awaitで実装
      const processText = async () => {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream complete");
          // setLoading(false);

          // console.log(accumulatedText); // 最後に蓄積されたテキストをログに出力
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
                // console.log(jsonObj.response);
                accumulatedResponse += jsonObj.response; // divに内容を追加
                // resultDiv.textContent = accumulatedResponse;
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
    } catch (error) {
      console.error(error);
      // resultDiv.style.display = "none"; // エラーが発生した場合に表示を非表示にする
      setData("エラーです。もう一度試してみてください。");
    }
  };

  return (
    // <div>
    <label htmlFor="upload-button">
      <input
        style={{ display: "none" }}
        id="upload-button"
        type="file"
        onChange={handleImageChange}
      />
      <Fab
        color="primary"
        aria-label="upload picture"
        component="span"
        style={{ position: "fixed", bottom: "1.5rem", left: "1.5rem" }}
      >
        <CameraAltIcon />
      </Fab>
    </label>
  );
}

export default ImageUploadButton;