import React from "react";
import { Box, Typography } from "@mui/material";

const GeininBadge = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        backgroundColor: "#FFEBEE", // 薄い赤色
        color: "#B71C1C", // 濃い赤色
        borderRadius: "20px",
        px: 2,
        py: 0.5,
        mb: 2, // 下に余白
        width: "fit-content",
      }}
    >
      <img
        src="/geinin.svg"
        alt="Geinin"
        style={{ width: "30px", height: "30px" }}
      />
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        お笑い芸人からのコメント
      </Typography>
    </Box>
  );
};

export default GeininBadge;
