"use client";
import { DataItem } from "@/app/api/arts/route";
import { getArt } from "@/lib/getArts";
import { useEffect, useState } from "react";
import { Box, ThemeProvider } from "@mui/material";
import ArtworkDisplay from "../../components/ArtworkDisplay";
import ArtworkDetails from "../../components/common/ArtworkDetails/ArtworkDetails";
import ArtworkTitle from "../../components/ArtworkTitle";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
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

export default function Arts({ params }: { params: { id: number } }) {
  const [data, setData] = useState<DataItem>({} as DataItem);

  useEffect(() => {
    getArt(params.id, setData);
  }, [params.id]); // IDが変わるたびにAPIが呼び出される

  return (
    <ThemeProvider theme={theme}>
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
            {/* character の値によって表示するバッジを切り替え */}
            {data.character === "teacher" && <TeacherBadge />}
            {data.character === "instructor" && <InstructorBadge />}
            {data.character === "geinin" && <GeininBadge />}
            {/* character の値によって表示するバッジを切り替え */}
            <ArtworkTitle title={data.title}>
              <></>
            </ArtworkTitle>
            <ArtworkDetails
              feature={data.feature}
              advantage={data.advantage}
              advice={data.advice}
            />
            <Box style={{ height: "2vh" }}></Box>
            {/* SNS 掲載 OK/NG 表示 */}
            <Box
              sx={{
                fontSize: 16,
                fontWeight: "bold",
                color: "gray",
                textAlign: "right",
                mt: 2,
              }}
            >
              {data.is_public_allowed ? "📸 SNS 掲載 OK" : "🚫 SNS 掲載 NG"}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
