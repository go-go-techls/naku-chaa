import React from "react";
import { Box, Typography } from "@mui/material";

const TeacherBadge = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        backgroundColor: "#E3F2FD", // 薄い青色
        color: "#0D47A1", // 濃い青色
        borderRadius: "20px",
        px: 2,
        py: 0.5,
        mb: 2, // 下に余白
        width: "fit-content",
      }}
    >
      <img
        src="/teacher.svg"
        alt="Teacher"
        style={{ width: "30px", height: "30px" }}
      />
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        深読み先生からのコメント
      </Typography>
    </Box>
  );
};

export default TeacherBadge;
