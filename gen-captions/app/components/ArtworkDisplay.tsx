import React from "react";
import { Paper, Skeleton, Typography } from "@mui/material";

interface ChildComponentProps {
  imageBase64: string;
}

const ArtworkDisplay = ({ imageBase64 }: ChildComponentProps) => {
  //   const imageUrl = "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"; // 画像のURLを指定
  const imageUrl = "/gooddog.png";
  // const imageUrl =
  // "https://storefront.saleor.io/_next/image?url=https%3A%2F%2Fstorefront1.saleor.cloud%2Fmedia%2Fthumbnails%2Fproducts%2Fsaleor-dash-force-1_thumbnail_1024.webp&w=2048&q=75";
  return (
    <Paper
      elevation={12}
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
      {imageBase64 ? (
        <img
          src={imageBase64}
          alt="Artwork Image"
          style={{ maxWidth: "95%", maxHeight: "100%" }}
        />
      ) : (
        <Skeleton
          variant="rectangular"
          style={{
            maxWidth: "95%",
            maxHeight: "100%",
            width: "100%",
            height: "auto",
            aspectRatio: "16 / 9",
          }}
        />
      )}
    </Paper>
  );
};

export default ArtworkDisplay;
