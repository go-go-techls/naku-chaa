import React from "react";
import { Fab } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Dispatch, SetStateAction } from "react";
import { fetchData } from "@/lib/openai";
// import { fetchData } from "@/lib/ollama";

import imageCompression from "browser-image-compression";

import {
  promptAdvantage,
  promptAdvice,
  promptFeature,
  promptTitle,
} from "@/lib/prompts";

interface ChildComponentProps {
  setImageBase64: Dispatch<SetStateAction<string>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setFeature: Dispatch<SetStateAction<string>>;
  setAdvantage: Dispatch<SetStateAction<string>>;
  setAdvice: Dispatch<SetStateAction<string>>;
  setRating: Dispatch<SetStateAction<number>>;
  setInputValue: Dispatch<SetStateAction<string>>;
}

function ImageUploadButton({
  setImageBase64,
  setTitle,
  setFeature,
  setAdvantage,
  setAdvice,
  setRating,
  setInputValue,
}: ChildComponentProps) {
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return <div>ファイル読み取りエラー</div>;
    }

    try {
      // 圧縮オプションの設定
      const options = {
        maxSizeMB: 0.1, // 最大ファイルサイズ (例: 0.1MB = 100kB)
        // maxWidthOrHeight: 500, // 最大幅または高さ
        useWebWorker: true, // WebWorkerを使用して、UIがブロックされるのを防ぐ
      };

      // 画像を圧縮
      const compressedFile = await imageCompression(file, options);
      console.log(`圧縮後のファイルサイズ: ${compressedFile.size / 1024}KB`);

      const reader = new FileReader();
      reader.onload = async function (e) {
        e.preventDefault(); // リンクのデフォルトの遷移処理をキャンセル

        const base64ImageDisplay = e.target!.result as string;
        const base64Image = (e.target!.result as string).split(",")[1];

        setImageBase64(base64ImageDisplay);

        setTitle("");
        setFeature("");
        setAdvantage("");
        setAdvice("");
        setRating(3);
        setInputValue("");

        // 同時に生成
        const results = await Promise.all([
          fetchData(base64Image, promptTitle, setTitle),
          fetchData(base64Image, promptFeature, setFeature),
          fetchData(base64Image, promptAdvantage, setAdvantage),
          fetchData(base64Image, promptAdvice, setAdvice),
        ]);
        // console.log(results);
        // await fetchData(base64Image, promptTitle, setTitle);
        // await fetchData(base64Image, promptFeature, setFeature);
        // await fetchData(base64Image, promptAdvantage, setAdvantage);
        // await fetchData(base64Image, promptAdvice, setAdvice);
      };
      // 圧縮されたファイルをBase64に変換
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("画像圧縮エラー:", error);
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
