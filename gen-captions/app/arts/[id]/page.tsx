"use client";
import { DataItem } from "@/app/api/arts/route";
import { getArt } from "@/lib/getArts";
import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
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
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          style={{ height: "100vh", width: "100vw" }}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12} md={7} style={{ height: "100vh" }}>
            <ArtworkDisplay imageBase64={data.image} />
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            style={{ maxHeight: "100vh", overflow: "auto" }}
          >
            <Box sx={{ p: 4, mt: 0 }}>
              {/* タグのような表示 */}
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
                {/* teacher.svg の表示 */}
                <img
                  src="/teacher.svg"
                  alt="Teacher"
                  style={{ width: "20px", height: "20px" }}
                />
                {/* タグのテキスト */}
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
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
