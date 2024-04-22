import React from "react";
import { Fab } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Dispatch, SetStateAction } from "react";
import { fetchData } from "@/lib/generate";

interface ChildComponentProps {
  setImageBase64: Dispatch<SetStateAction<string>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setFeature: Dispatch<SetStateAction<string>>;
  setAdvantage: Dispatch<SetStateAction<string>>;
  setAdvice: Dispatch<SetStateAction<string>>;
}

function ImageUploadButton({
  setImageBase64,
  setTitle,
  setFeature,
  setAdvantage,
  setAdvice,
}: ChildComponentProps) {
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return <div>ファイル読み取りエラー</div>;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const base64ImageDisplay = e.target!.result as string;
      const base64Image = (e.target!.result as string).split(",")[1];

      setImageBase64(base64ImageDisplay);
      fetchData(
        base64Image,
        "この絵画が伝えている感情やストーリーを考え、それに合ったタイトルを20字以内で教えてください。日本語でタイトルだけ返してください。",
        setTitle
      );
      fetchData(
        base64Image,
        "多く人が共感する説明を、100字以内で考えてください。",
        setFeature
      );
      fetchData(
        base64Image,
        "この画像を日本語で100字程度で褒めてください。",
        setAdvantage
      );
      fetchData(
        base64Image,
        "この作者が次の作品を制作する時の、テーマや画材のアドバイスをそれぞれ100字以内で考えてください。",
        setAdvice
      );
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
