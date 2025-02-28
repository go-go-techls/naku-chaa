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

// SVG をインポート
import hogeIcon from "@/public/hoge.svg";

interface ChildComponentProps {
  setImageBase64: Dispatch<SetStateAction<string>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setFeature: Dispatch<SetStateAction<string>>;
  setAdvantage: Dispatch<SetStateAction<string>>;
  setAdvice: Dispatch<SetStateAction<string>>;
  setRating: Dispatch<SetStateAction<number>>;
  setInputValue: Dispatch<SetStateAction<string>>;
  sx?: SxProps<Theme>;
}

function ImageUploadButton({
  setImageBase64,
  setTitle,
  setFeature,
  setAdvantage,
  setAdvice,
  setRating,
  setInputValue,
  sx = {},
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
    <Box sx={{ textAlign: "center" }}>
      <label htmlFor="upload-button">
        <input
          style={{ display: "none" }}
          id="upload-button"
          type="file"
          onChange={handleImageChange}
        />
        <Fab
          // color="primary"
          aria-label="upload picture"
          component="span"
          sx={sx}
        >
          <Box sx={{ textAlign: "center" }}>
            {/* imgの表示 */}
            <img
              src={hogeIcon.src}
              alt="Upload"
              style={{ width: "60px" }} // アイコンのサイズ調整
            />
            {/* タグのような「AI先生」を追加 */}
            <Typography
              variant="caption"
              sx={{
                display: "inline-block",
                mt: 0,
                px: 1,
                py: 0.2,
                backgroundColor: "#CEDCE9",
                color: "#555",
                borderRadius: "10px",
                fontSize: "0.65rem",
              }}
            >
              AI先生
            </Typography>
          </Box>
        </Fab>
      </label>
    </Box>
  );
}

export default ImageUploadButton;
