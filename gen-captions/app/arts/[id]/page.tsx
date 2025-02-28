"use client";
import { DataItem } from "@/app/api/arts/route";
import { getArt } from "@/lib/getArts";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ArtworkDisplay from "../../components/ArtworkDisplay";
import ArtworkDetails from "../../components/common/ArtworkDetails/ArtworkDetails";
import ArtworkTitle from "../../components/ArtworkTitle";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import Header from "@/app/components/common/Header/Header";

let theme = createTheme({
  typography: {
    fontSize: 13,
  },
});
theme = responsiveFontSizes(theme);

export default function Arts({ params }: { params: { id: number } }) {
  const [data, setData] = useState<DataItem>({} as DataItem);

  useEffect(() => {
    getArt(params.id, setData);
  }, [params.id]); // IDが変わるたびにAPIが呼び出される

  return (
    <>
      <Box sx={{ position: "relative", zIndex: 10 }}>
        <Header />
      </Box>

      {/* Flexbox Layout */}
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
            <ArtworkDisplay imageBase64={data.image} from="id" />
          </Box>
        </Box>

        {/* 右側 (ArtworkDetails) */}
        <Box
          sx={{
            flex: "1", // 残りの幅を占有
            height: "100%",
            overflowY: "auto", // 縦スクロールを有効化
            overflowX: "hidden", // 横方向のスクロールを無効化
            paddingRight: "16px",
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ p: 4, mt: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "#E3F2FD", // 薄い青色
                color: "#0D47A1", // 濃い青色
                borderRadius: "15px",
                px: 2,
                py: 0.5,
                mb: 2, // 下に余白
                width: "fit-content",
              }}
            >
              <img
                src="/teacher.svg"
                alt="Teacher"
                style={{ width: "20px", height: "20px" }}
              />
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                AI先生からのコメント
              </Typography>
            </Box>

            <ArtworkTitle title={data.title}>
              <></>
            </ArtworkTitle>
            <ArtworkDetails
              title={data.title}
              feature={data.feature}
              advantage={data.advantage}
              advice={data.advice}
              image={data.image}
              rating={data.rating}
              inputValue={data.comment}
              setRating={() => {}}
              setInputValue={() => {}}
              disable={true}
            />
            <Box style={{ height: "15vh" }}></Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
