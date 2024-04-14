import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Box, Fab } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

function ImageGrid() {
  const images = [
    "/cat.png",
    "/cat2.png",
    "https://storefront.saleor.io/_next/image?url=https%3A%2F%2Fstorefront1.saleor.cloud%2Fmedia%2Fthumbnails%2Fproducts%2Fsaleor-dash-force-1_thumbnail_1024.webp&w=2048&q=75",
    "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
  ];
  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover" as "cover",
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Grid container spacing={2}>
        {images.map((src, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                width: "32.4vw", // ビューポートの1/3の幅
                height: "32.4vw", // ビューポートの1/3の高さ
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                overflow: "hidden",
              }}
            />
          </Grid>
        ))}
      </Grid>
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: "fixed", bottom: 20, left: 20 }}
      >
        <CameraAltIcon />
      </Fab>
    </Box>
  );
}

export default ImageGrid;
