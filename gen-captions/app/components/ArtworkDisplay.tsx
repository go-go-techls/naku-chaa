import React from "react";
import { Paper, Skeleton, Typography } from "@mui/material";

interface ChildComponentProps {
  imageBase64: string;
}

const ArtworkDisplay = ({ imageBase64 }: ChildComponentProps) => {
  return (
    <Paper
      elevation={12}
      sx = {{px:4, py:5}}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        // borderRadius: "0 5vh 5vh 0",
      }}
    >
      {imageBase64 ? (
        <img
          src={imageBase64}
          alt="Artwork Image"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      ) : (
        <Skeleton
          variant="rectangular"
          style={{
            maxWidth: "100%",
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
