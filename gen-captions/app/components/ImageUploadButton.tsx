import React from "react";
import { Fab, SxProps, Theme, Box, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import imageCompression from "browser-image-compression";
import {
  promptAdvantage,
  promptAdvice,
  promptFeature,
  promptTitle,
} from "@/lib/prompts";
import { fetchData } from "@/lib/openai";

// SVG のインポート
import teacherIcon from "@/public/teacher.svg";
import geininIcon from "@/public/geinin.svg";
import instructorIcon from "@/public/instructor.svg";
import { Data, postResult } from "@/lib/postResult";

interface ChildComponentProps {
  setImageBase64: Dispatch<SetStateAction<string>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setFeature: Dispatch<SetStateAction<string>>;
  setAdvantage: Dispatch<SetStateAction<string>>;
  setAdvice: Dispatch<SetStateAction<string>>;
  setRating: Dispatch<SetStateAction<number>>;
  setInputValue: Dispatch<SetStateAction<string>>;
  character: "teacher" | "geinin" | "instructor"; // キャラクターの種類
  setCharacter: Dispatch<SetStateAction<string>>;
  snsCheck: boolean;
  sx?: SxProps<Theme>;
}

// キャラクターごとの設定
const characterSettings = {
  teacher: {
    icon: teacherIcon,
    title: "AI先生",
    backgroundColor: "#CEDCE9",
    promptTitle: promptTitle.teacher,
    promptFeature: promptFeature.teacher,
    promptAdvantage: promptAdvantage.teacher,
    promptAdvice: promptAdvice.teacher,
  },
  geinin: {
    icon: geininIcon,
    title: "お笑い芸人",
    backgroundColor: "#F6E2D7",
    promptTitle: promptTitle.geinin,
    promptFeature: promptFeature.geinin,
    promptAdvantage: promptAdvantage.geinin,
    promptAdvice: promptAdvice.geinin,
  },
  instructor: {
    icon: instructorIcon,
    title: "熱血コーチ",
    backgroundColor: "#F4F4DD",
    promptTitle: promptTitle.instructor,
    promptFeature: promptFeature.instructor,
    promptAdvantage: promptAdvantage.instructor,
    promptAdvice: promptAdvice.instructor,
  },
};

function ImageUploadButton({
  setImageBase64,
  setTitle,
  setFeature,
  setAdvantage,
  setAdvice,
  setRating,
  setInputValue,
  character,
  setCharacter,
  snsCheck,
  sx = {},
}: ChildComponentProps) {
  // キャラクターに応じた設定を取得
  const settings = characterSettings[character];

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
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

        const [title, feature, advantage, advice] = await Promise.all([
          fetchData(base64Image, settings.promptTitle, setTitle),
          fetchData(base64Image, settings.promptFeature, setFeature),
          fetchData(base64Image, settings.promptAdvantage, setAdvantage),
          fetchData(base64Image, settings.promptAdvice, setAdvice),
        ]);

        const req: Data = {
          title,
          feature,
          advantage,
          advice,
          image: base64ImageDisplay,
          rating: 3,
          comment: "",
          character,
          is_public_allowed: snsCheck,
        };
        await postResult(req);
      };

      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("画像圧縮エラー:", error);
    }
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <label htmlFor={`upload-button-${character}`}>
        <input
          style={{ display: "none" }}
          id={`upload-button-${character}`}
          type="file"
          onChange={handleImageChange}
        />
        <Fab
          aria-label="upload picture"
          component="span"
          sx={{
            ...sx,
            width: "84px",
            height: "84px",
            boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.1)",
          }}
          onClick={() => setCharacter(character)} // 🔽 クリック時にキャラクターをセット
        >
          <Box sx={{ textAlign: "center" }}>
            <img
              src={settings.icon.src}
              alt="Upload"
              style={{ marginTop: "8px" }}
            />
            <Typography
              variant="caption"
              sx={{
                display: "inline-block",
                mt: 0,
                px: 1,
                py: 0.2,
                backgroundColor: settings.backgroundColor,
                color: "#555",
                borderRadius: "10px",
                fontSize: "0.8rem",
              }}
            >
              {settings.title}
            </Typography>
          </Box>
        </Fab>
      </label>
    </Box>
  );
}

export default ImageUploadButton;
