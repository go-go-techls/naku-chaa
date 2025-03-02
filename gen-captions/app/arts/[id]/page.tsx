"use client";

import { useEffect, useState } from "react";
import { Box, ThemeProvider, useMediaQuery } from "@mui/material";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import Header from "@/app/components/common/Header/Header";
import ArtworkDisplay from "@/app/components/ArtworkDisplay";
import ArtworkDetails from "@/app/components/common/ArtworkDetails/ArtworkDetails";
import ArtworkTitle from "@/app/components/ArtworkTitle";
import TeacherBadge from "@/app/components/TeacherBadge";
import InstructorBadge from "@/app/components/InstructorBadge";
import GeininBadge from "@/app/components/GeininBadge";
import { DataItem } from "@/app/api/arts/route";
import { getArt } from "@/lib/getArts";

let theme = createTheme({
  typography: { fontSize: 14 },
});
theme = responsiveFontSizes(theme);

export default function Arts({ params }: { params: { id: number } }) {
  const [data, setData] = useState<DataItem>({} as DataItem);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    getArt(params.id, setData);
  }, [params.id]);

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
            }}
          >
            <ArtworkDisplay imageBase64={data.image} from="id" />
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
