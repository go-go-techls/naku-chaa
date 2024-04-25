import React from "react";
import { Fab } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Dispatch, SetStateAction } from "react";
import { fetchData } from "@/lib/generate";
import { Data, postResult } from "@/lib/postResult";
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
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return <div>ファイル読み取りエラー</div>;
    }

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

      const results = await Promise.all([
        fetchData(base64Image, promptTitle, setTitle),
        fetchData(base64Image, promptFeature, setFeature),
        fetchData(base64Image, promptAdvantage, setAdvantage),
        fetchData(base64Image, promptAdvice, setAdvice),
      ]);
      console.log(results);
      // const results = await Promise.all([
      //   fetchData(base64Image, promptTitle, setTitle),
      //   // fetchData(base64Image, promptFeature, setFeature),
      // ]);
      // console.log(results);
      // console.log(base64ImageDisplay);
      // const req: Data = {
      //   title: results[0]!,
      //   feature: results[1]!,
      //   advantage: results[2]!,
      //   advice: results[3]!,
      //   image: base64ImageDisplay,
      // };
      // const req: Data = {
      //   title: results[0]!,
      //   feature: "feature",
      //   advantage: "hoge",
      //   advice: "advice",
      //   image: base64ImageDisplay,
      // };
      // postResult(req);
    };
    reader.readAsDataURL(file);
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
