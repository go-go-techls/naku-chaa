import React from "react";
import { Paper, Skeleton } from "@mui/material";

interface ChildComponentProps {
  imageBase64: string;
  from: "generate" | "id"; // 呼び出し元の画面を識別
}

const ArtworkDisplay = ({ imageBase64, from }: ChildComponentProps) => {
  return (
    <Paper
      elevation={8}
      sx={{ px: 4, py: 5 }}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.1)", // カスタムシャドーを設定
      }}
    >
      {imageBase64 ? (
        <img
          src={imageBase64}
          alt="Artwork Image"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      ) : from === "generate" ? (
        // generate から呼ばれた場合は first_step.png を表示
        <img
          src="/images/first_step.png"
          alt="First Step"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "100%",
            height: "auto",
            aspectRatio: "16 / 9",
            objectFit: "contain",
          }}
        />
      ) : (
        // id から呼ばれた場合は Skeleton を表示
        <Skeleton
          variant="rectangular"
          // animation="wave"
          animation="pulse"
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
