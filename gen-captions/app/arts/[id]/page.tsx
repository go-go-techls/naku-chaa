"use client";

import { useEffect, useState } from "react";
import {
  Box,
  ThemeProvider,
  useMediaQuery,
  IconButton,
  Tooltip,
} from "@mui/material";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter } from "next/navigation";
import Header from "@/app/components/common/Header/Header";
import ArtworkDisplay from "@/app/components/ArtworkDisplay";
import ArtworkDetails from "@/app/components/common/ArtworkDetails/ArtworkDetails";
import ArtworkTitle from "@/app/components/ArtworkTitle";
import TeacherBadge from "@/app/components/TeacherBadge";
import InstructorBadge from "@/app/components/InstructorBadge";
import GeininBadge from "@/app/components/GeininBadge";
import { DataItem } from "@/app/api/arts/route";
import { getArt, getAdjacentArtIds } from "@/lib/getArts";

let theme = createTheme({
  typography: { fontSize: 14 },
});
theme = responsiveFontSizes(theme);

export default function Arts({ params }: { params: { id: number } }) {
  const [data, setData] = useState<DataItem>({} as DataItem);
  const [prevId, setPrevId] = useState<number | null>(null);
  const [nextId, setNextId] = useState<number | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  useEffect(() => {
    getArt(params.id, setData);
    getAdjacentArtIds(params.id).then((ids) => {
      setPrevId(ids.prevId);
      setNextId(ids.nextId);
    });
  }, [params.id]);

  // キーボードナビゲーション
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 入力フィールドやテキストエリアにフォーカスがある場合はスキップ
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key === "ArrowLeft" && nextId) {
        event.preventDefault();
        router.push(`/arts/${nextId}`);
      } else if (event.key === "ArrowRight" && prevId) {
        event.preventDefault();
        router.push(`/arts/${prevId}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevId, nextId, router]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ position: "relative", zIndex: 10 }}>
        <Header />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            height: isMobile ? "auto" : "calc(100vh - 64px)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              flex: isMobile ? "none" : "0 0 60%",
              width: isMobile ? "100%" : "auto",
              height: isMobile ? "auto" : "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingRight: isMobile ? 0 : "24px",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            {/* 次の画像ボタン */}
            {nextId && (
              <Tooltip title="次の画像 (←)">
                <IconButton
                  onClick={() => router.push(`/arts/${nextId}`)}
                  sx={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    color: "white",
                    zIndex: 10,
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                    },
                  }}
                >
                  <ArrowBackIosIcon sx={{ transform: "translateX(5px)" }} />
                </IconButton>
              </Tooltip>
            )}

            <ArtworkDisplay imageBase64={data.image} from="id" />

            {/* 前の画像ボタン */}
            {prevId && (
              <Tooltip title="前の画像 (→)">
                <IconButton
                  onClick={() => router.push(`/arts/${prevId}`)}
                  sx={{
                    position: "absolute",
                    right: isMobile ? 16 : 40,
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    color: "white",
                    zIndex: 10,
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                    },
                  }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Box
            sx={{
              flex: "1",
              height: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              paddingRight: "16px",
              boxSizing: "border-box",
            }}
          >
            <Box sx={{ p: 4, mt: 0 }}>
              {data.character === "teacher" && <TeacherBadge />}
              {data.character === "instructor" && <InstructorBadge />}
              {data.character === "geinin" && <GeininBadge />}
              <ArtworkTitle title={data.title} waitingForUser={true} />
              <ArtworkDetails
                feature={data.feature}
                advantage={data.advantage}
                advice={data.advice}
                waitingForUser={true}
              />
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
      </Box>
    </ThemeProvider>
  );
}
