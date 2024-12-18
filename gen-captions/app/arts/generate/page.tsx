"use client";

import { Box, Grid, IconButton } from "@mui/material";
import ArtworkDisplay from "@/app/components/ArtworkDisplay";
import ArtworkDetails from "@/app/components/common/ArtworkDetails/ArtworkDetails";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useState } from "react";
import ImageUploadButton from "@/app/components/ImageUploadButton";
import ArtworkTitle from "@/app/components/ArtworkTitle";
import RefreshTitleButton from "@/app/components/RefreshTitleButton";
import Link from "next/link";
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

export default function Home() {
  const [title, setTitle] = useState("");
  const [feature, setFeature] = useState("");
  const [advantage, setAdvantage] = useState("");
  const [advice, setAdvice] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [rating, setRating] = useState(3);

  // const [loading, setLoading] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ position: "relative", zIndex: 10 }}>
        <Header />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        {/* <Link href="/arts" passHref>
          <IconButton
            aria-label="戻る"
            size="large"
            sx={{ position: "fixed", top: "1rem", left: "1rem" }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </Link> */}

        <Grid
          container
          style={{ height: "100vh", width: "100vw" }}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12} md={7} style={{ height: "100vh" }}>
            <ArtworkDisplay imageBase64={imageBase64} />
          </Grid>
          <ImageUploadButton
            setImageBase64={setImageBase64}
            setTitle={setTitle}
            setFeature={setFeature}
            setAdvantage={setAdvantage}
            setAdvice={setAdvice}
            setRating={setRating}
            setInputValue={setInputValue}
          />

          <Grid
            item
            xs={12}
            md={5}
            style={{ maxHeight: "100vh", overflow: "auto" }}
          >
            <Box sx={{ p: 4, mt: 4 }}>
              <Box style={{ height: "2vh" }}></Box>
              <ArtworkTitle title={title}>
                <RefreshTitleButton
                  imageBase64={imageBase64}
                  setTitle={setTitle}
                  disabled={!title}
                />
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
              <Box style={{ height: "15vh" }}></Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
