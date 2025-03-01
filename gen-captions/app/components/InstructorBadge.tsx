import React from "react";
import { Box, Typography } from "@mui/material";

const InstructorBadge = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        backgroundColor: "#F1F8E9", // 薄い黄緑色
        color: "#33691E", // 濃い黄緑色
        borderRadius: "20px",
        px: 2,
        py: 0.5,
        mb: 2, // 下に余白
        width: "fit-content",
      }}
    >
      <img
        src="/instructor.svg"
        alt="Instructor"
        style={{ width: "30px", height: "30px" }}
      />
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        熱血コーチからのコメント
      </Typography>
    </Box>
  );
};

export default InstructorBadge;
