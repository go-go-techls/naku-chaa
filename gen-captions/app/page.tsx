"use client";

import { Box, Grid, IconButton } from "@mui/material";
import ArtworkDisplay from "./components/ArtworkDisplay";
import ArtworkDetails from "./components/ArtworkDetails";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useState } from "react";
import ImageUploadButton from "./components/ImageUploadButton";
import ArtworkTitle from "./components/ArtworkTitle";
import RefreshTitle from "./components/RefreshTitle";

export default function Home() {
  const [title, setTitle] = useState("");
  const [feature, setFeature] = useState("");
  const [advantage, setAdvantage] = useState("");
  const [advice, setAdvice] = useState("");
  const [imageBase64, setImageBase64] = useState("");

  // const [loading, setLoading] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <IconButton
        aria-label="戻る"
        size="large"
        sx={{ position: "fixed", top: "1rem", left: "1rem" }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <Grid
        container
        // style={{ height: "100vh", width: "100vw"}}
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          item
          xs={12}
          md={7}
          container
          style={{ height: "100vh", width: "100vw" }}
        >
          <ArtworkDisplay imageBase64={imageBase64} />
        </Grid>
        <ImageUploadButton
          setImageBase64={setImageBase64}
          setTitle={setTitle}
          setFeature={setFeature}
          setAdvantage={setAdvantage}
          setAdvice={setAdvice}
        />

        <Grid
          item
          xs={12}
          md={5}
          container
          style={{ height: "100vh", width: "100vw" }}
        >
          <Box
            sx={{ p: 4, mt: 4 }}
            style={{ maxHeight: "100vh", overflow: "auto" }}
          >
            <ArtworkTitle title={title}>
              <RefreshTitle imageBase64={imageBase64} setTitle={setTitle} />
            </ArtworkTitle>
            <ArtworkDetails
              title={title}
              feature={feature}
              advantage={advantage}
              advice={advice}
              image={imageBase64}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
