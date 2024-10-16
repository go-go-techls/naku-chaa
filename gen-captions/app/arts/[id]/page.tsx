"use client";
import { DataItem } from "@/app/api/arts/route";
import { getArt } from "@/lib/getArts";
import { useEffect, useState } from "react";
import { Box, Grid, IconButton } from "@mui/material";
import ArtworkDisplay from "../../components/ArtworkDisplay";
import ArtworkDetails from "../../components/common/ArtworkDetails/ArtworkDetails";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArtworkTitle from "../../components/ArtworkTitle";
// import RefreshTitle from "../../components/RefreshTitleButton";
import Link from "next/link";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";

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
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <Link href="/arts" passHref>
          <IconButton
            aria-label="戻る"
            size="large"
            sx={{ position: "fixed", top: "1rem", left: "1rem" }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </Link>

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
            <Box sx={{ p: 4, mt: 4 }}>
              <Box style={{ height: "2vh" }}></Box>
              <ArtworkTitle title={data.title}>
                <></>
                {/* <RefreshTitle imageBase64={data.image} setTitle={() => {}} /> */}
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
    </ThemeProvider>
  );
}
