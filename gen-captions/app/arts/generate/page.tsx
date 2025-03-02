"use client";

import { Box, Checkbox, FormControlLabel } from "@mui/material";
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
  const [snsCheck, setSnsCheck] = useState(true);
  const [character, setCharacter] = useState("");
  const [waitingForUser, setWaitingForUser] = useState(true); // ユーザー操作待ち

  const characters = [
    { name: "teacher" as const, left: "1.5rem" },
    { name: "geinin" as const, left: "8.5rem" },
    { name: "instructor" as const, left: "15.5rem" },
  ];

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
              <ArtworkTitle title={title} waitingForUser={waitingForUser}>
                {/* <RefreshTitleButton
                  imageBase64={imageBase64}
                  setTitle={setTitle}
                  disabled={!title}
                /> */}
                <></>
              </ArtworkTitle>
              <ArtworkDetails
                feature={feature}
                advantage={advantage}
                advice={advice}
                waitingForUser={waitingForUser}
              />
            </Box>
          </Box>
        </Box>

        {characters.map(({ name, left }) => (
          <ImageUploadButton
            key={name}
            character={name}
            snsCheck={snsCheck}
            setImageBase64={setImageBase64}
            setTitle={setTitle}
            setFeature={setFeature}
            setAdvantage={setAdvantage}
            setAdvice={setAdvice}
            onClick={() => {
              setCharacter(name);
              setWaitingForUser(false);
            }} // ここに直接書く
            sx={{ position: "fixed", bottom: "2rem", left }}
          />
        ))}

        <FormControlLabel
          control={
            <Checkbox
              checked={snsCheck}
              onChange={(e) => setSnsCheck(e.target.checked)}
              color="primary"
            />
          }
          label="📸 SNS 掲載 OK"
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
