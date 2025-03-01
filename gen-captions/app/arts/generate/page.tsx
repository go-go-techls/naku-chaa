"use client";

import { Box, Checkbox, FormControlLabel, IconButton } from "@mui/material";
import ArtworkDisplay from "@/app/components/ArtworkDisplay";
import ArtworkDetails from "@/app/components/common/ArtworkDetails/ArtworkDetails";
import { useState } from "react";
import ImageUploadButton from "@/app/components/ImageUploadButton";
import ArtworkTitle from "@/app/components/ArtworkTitle";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import Header from "@/app/components/common/Header/Header";
import TeacherBadge from "@/app/components/TeacherBadge";
import InstructorBadge from "@/app/components/InstructorBadge";
import GeininBadge from "@/app/components/GeininBadge";

let theme = createTheme({
  typography: {
    fontSize: 14,
  },
});
theme = responsiveFontSizes(theme);

export default function Home() {
  const [title, setTitle] = useState("");
  const [feature, setFeature] = useState("");
  const [advantage, setAdvantage] = useState("");
  const [advice, setAdvice] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [rating, setRating] = useState(3);
  const [snsCheck, setSnsCheck] = useState(true);
  const [isComplete, setIsComplete] = useState(false); // 🔽 完了フラグ
  const [character, setCharacter] = useState("");

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ position: "relative", zIndex: 10 }}>
        <Header />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            height: "calc(100vh - 64px)", // ヘッダーの高さを引いた高さ
            overflow: "hidden", // 全体のオーバーフローを隠す
          }}
        >
          {/* 左側 (ArtworkDisplay) */}
          <Box
            sx={{
              flex: "0 0 60%", // 左側を 65% に固定
              height: "100%",
              overflow: "hidden", // スクロールを無効化
              paddingRight: "24px", // 右側だけに余白を追加
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ArtworkDisplay imageBase64={imageBase64} from="generate" />
            </Box>
          </Box>

          {/* 右側 (ArtworkDetails) */}
          <Box
            sx={{
              flex: "1", // 残りの幅を占有 (35%)
              height: "100%",
              overflowY: "auto", // 縦スクロールを有効化
              overflowX: "hidden", // 横方向のスクロールを無効化
              paddingRight: "16px",
              boxSizing: "border-box",
            }}
          >
            <Box sx={{ p: 4, mt: 0 }}>
              {/* character の値によって表示するバッジを切り替え */}
              {character === "" && <></>}
              {character === "teacher" && <TeacherBadge />}
              {character === "instructor" && <InstructorBadge />}
              {character === "geinin" && <GeininBadge />}
              <ArtworkTitle title={title}>
                {/* <RefreshTitleButton
                  imageBase64={imageBase64}
                  setTitle={setTitle}
                  disabled={!title}
                /> */}
                <></>
              </ArtworkTitle>
              <ArtworkDetails
                title={title}
                feature={feature}
                advantage={advantage}
                advice={advice}
                image={imageBase64}
                rating={rating}
                inputValue={inputValue}
                setRating={setRating}
                setInputValue={setInputValue}
                disable={false}
              />
            </Box>
          </Box>
        </Box>

        {/* 画像アップロードボタン */}
        <ImageUploadButton
          character="teacher"
          setCharacter={setCharacter}
          snsCheck={snsCheck}
          setImageBase64={setImageBase64}
          setTitle={setTitle}
          setFeature={setFeature}
          setAdvantage={setAdvantage}
          setAdvice={setAdvice}
          setRating={setRating}
          setInputValue={setInputValue}
          setIsComplete={setIsComplete} // 🔽 完了フラグのセット関数を渡す
          sx={{ position: "fixed", bottom: "2rem", left: "1.5rem" }}
        />

        <ImageUploadButton
          character="geinin"
          setCharacter={setCharacter}
          snsCheck={snsCheck}
          setImageBase64={setImageBase64}
          setTitle={setTitle}
          setFeature={setFeature}
          setAdvantage={setAdvantage}
          setAdvice={setAdvice}
          setRating={setRating}
          setInputValue={setInputValue}
          setIsComplete={setIsComplete} // 🔽 完了フラグのセット関数を渡す
          sx={{ position: "fixed", bottom: "2rem", left: "8.5rem" }}
        />

        <ImageUploadButton
          character="instructor"
          setCharacter={setCharacter}
          snsCheck={snsCheck}
          setImageBase64={setImageBase64}
          setTitle={setTitle}
          setFeature={setFeature}
          setAdvantage={setAdvantage}
          setAdvice={setAdvice}
          setRating={setRating}
          setInputValue={setInputValue}
          setIsComplete={setIsComplete} // 🔽 完了フラグのセット関数を渡す
          sx={{ position: "fixed", bottom: "2rem", left: "15.5rem" }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={snsCheck}
              onChange={(e) => setSnsCheck(e.target.checked)}
              color="primary"
            />
          }
          label="📸 SNS 投稿 OK"
          sx={{
            position: "fixed",
            bottom: "3.5rem",
            left: "23.5rem",
            "& .MuiFormControlLabel-label": {
              fontSize: "1.2rem", // フォントサイズを変更
            },
          }}
        />
      </Box>
    </ThemeProvider>
  );
}
