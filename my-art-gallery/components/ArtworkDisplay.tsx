import React from "react";
import { Paper, Typography } from "@mui/material";

const ArtworkDisplay = () => {
  //   const imageUrl = "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"; // 画像のURLを指定
  const imageUrl = "/cat.png";
  // const imageUrl =
  // "https://storefront.saleor.io/_next/image?url=https%3A%2F%2Fstorefront1.saleor.cloud%2Fmedia%2Fthumbnails%2Fproducts%2Fsaleor-dash-force-1_thumbnail_1024.webp&w=2048&q=75";
  return (
    <Paper
      style={{
        padding: 16,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
      }}
    >
      {/* <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    > */}
      <img
        src={imageUrl}
        alt="Artwork Image"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />
      {/* </Box> */}
    </Paper>
  );
};

export default ArtworkDisplay;
