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
  character: "teacher" | "geinin" | "instructor"; // キャラクターの種類
  snsCheck: boolean;
  onClick?: () => void; // ここを追加
  sx?: SxProps<Theme>;
}

// キャラクターごとの設定
const characterSettings = {
  teacher: {
    icon: teacherIcon,
    title: "深読み先生",
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
  character,
  snsCheck,
  onClick,
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
    // ★ ここで input の値をリセットして、同じファイル選択でも再度トリガーされるようにする
    event.target.value = "";

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

        try {
          const [title, feature, advantage, advice] = await Promise.all([
            fetchData(base64Image, settings.promptTitle, setTitle),
            fetchData(base64Image, settings.promptFeature, setFeature),
            fetchData(base64Image, settings.promptAdvantage, setAdvantage),
            fetchData(base64Image, settings.promptAdvice, setAdvice),
          ]);

          console.log('🎯 AI処理完了、postResult呼び出し準備');
          console.log('取得したデータ:', { title, feature, advantage, advice });
          console.log('character:', character, 'snsCheck:', snsCheck);

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
          
          console.log('🎯 postResult呼び出し直前');
          try {
            await postResult(req);
            console.log('🎯 postResult呼び出し完了');
          } catch (postError) {
            console.error('🚨 postResult エラー:', postError);
            alert('作品の保存に失敗しました: ' + (postError instanceof Error ? postError.message : String(postError)));
          }
        } catch (aiError) {
          console.error('🚨 AI処理エラー:', aiError);
          alert('AI処理中にエラーが発生しました: ' + (aiError instanceof Error ? aiError.message : String(aiError)));
        }
      };

      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("画像圧縮エラー:", error);
    }
  };

  return (
    <Box 
      sx={{ 
        textAlign: "center",
        "@keyframes gentlePulse": {
          "0%": {
            transform: "scale(1)",
            boxShadow: "0px 2px 12px rgba(0,0,0,0.04), 0px 1px 2px rgba(0,0,0,0.06), 0 0 0 0 rgba(100, 116, 139, 0.4)"
          },
          "70%": {
            transform: "scale(1.02)",
            boxShadow: "0px 4px 16px rgba(0,0,0,0.06), 0px 2px 4px rgba(0,0,0,0.08), 0 0 0 6px rgba(100, 116, 139, 0)"
          },
          "100%": {
            transform: "scale(1)",
            boxShadow: "0px 2px 12px rgba(0,0,0,0.04), 0px 1px 2px rgba(0,0,0,0.06), 0 0 0 0 rgba(100, 116, 139, 0)"
          }
        },
        "@keyframes softGlow": {
          "0%, 100%": { 
            filter: "drop-shadow(0 0 3px rgba(100, 116, 139, 0.2))" 
          },
          "50%": { 
            filter: "drop-shadow(0 0 8px rgba(100, 116, 139, 0.4))" 
          }
        }
      }}
    >
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
            width: "96px",
            height: "96px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            boxShadow: "0px 2px 12px rgba(0,0,0,0.04), 0px 1px 2px rgba(0,0,0,0.06)",
            backdropFilter: "blur(12px)",
            animation: "gentlePulse 3s ease-in-out infinite",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-3px) scale(1.05)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)",
              boxShadow: "0px 6px 24px rgba(0,0,0,0.08), 0px 2px 6px rgba(0,0,0,0.1)",
              border: "1px solid rgba(148, 163, 184, 0.3)",
              animation: "softGlow 1.5s ease-in-out infinite",
            },
            "&:active": {
              transform: "translateY(-1px) scale(1.02)",
            },
          }}
          onClick={onClick}
        >
          <Box sx={{ textAlign: "center" }}>
            <img
              src={settings.icon.src}
              alt="Upload"
              style={{ 
                marginTop: "8px",
                transition: "all 0.3s ease"
              }}
            />
            <Typography
              variant="caption"
              sx={{
                display: "inline-block",
                mt: 0.5,
                px: 1.5,
                py: 0.3,
                background: `linear-gradient(135deg, ${settings.backgroundColor}dd 0%, ${settings.backgroundColor}bb 100%)`,
                color: "#64748b",
                borderRadius: "12px",
                fontSize: "0.8rem",
                fontWeight: 500,
                boxShadow: "0px 1px 4px rgba(0,0,0,0.06)",
                backdropFilter: "blur(8px)",
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
