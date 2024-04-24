import React from "react";
import { Paper, Skeleton, Typography } from "@mui/material";

interface ChildComponentProps {
  imageBase64: string;
}

const ArtworkDisplay = ({ imageBase64 }: ChildComponentProps) => {
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
