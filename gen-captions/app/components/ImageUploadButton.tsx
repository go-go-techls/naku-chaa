import React from "react";
import { Fab, SxProps, Theme } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Dispatch, SetStateAction } from "react";
import imageCompression from "browser-image-compression";
import {
  promptAdvantage,
  promptAdvice,
  promptFeature,
  promptTitle,
} from "@/lib/prompts";
import { fetchData } from "@/lib/openai";

interface ChildComponentProps {
  setImageBase64: Dispatch<SetStateAction<string>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setFeature: Dispatch<SetStateAction<string>>;
  setAdvantage: Dispatch<SetStateAction<string>>;
  setAdvice: Dispatch<SetStateAction<string>>;
  setRating: Dispatch<SetStateAction<number>>;
  setInputValue: Dispatch<SetStateAction<string>>;
  sx?: SxProps<Theme>; // MUIのスタイル用プロパティを追加
}

function ImageUploadButton({
  setImageBase64,
  setTitle,
  setFeature,
  setAdvantage,
  setAdvice,
  setRating,
  setInputValue,
  sx = {}, // デフォルトは空のオブジェクト
}: ChildComponentProps) {
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return <div>ファイル読み取りエラー</div>;
    }

    try {
      const options = {
        maxSizeMB: 0.1,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      console.log(`圧縮後のファイルサイズ: ${compressedFile.size / 1024}KB`);

      const reader = new FileReader();
      reader.onload = async function (e) {
        e.preventDefault();
        const base64ImageDisplay = e.target!.result as string;
        const base64Image = (e.target!.result as string).split(",")[1];

        setImageBase64(base64ImageDisplay);

        setTitle("");
        setFeature("");
        setAdvantage("");
        setAdvice("");
        setRating(3);
        setInputValue("");

        await Promise.all([
          fetchData(base64Image, promptTitle, setTitle),
          fetchData(base64Image, promptFeature, setFeature),
          fetchData(base64Image, promptAdvantage, setAdvantage),
          fetchData(base64Image, promptAdvice, setAdvice),
        ]);
      };

      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("画像圧縮エラー:", error);
    }
  };

  return (
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
        sx={sx} // 呼び出し側から受け取った `sx` を適用
      >
        <CameraAltIcon />
      </Fab>
    </label>
  );
}

export default ImageUploadButton;
