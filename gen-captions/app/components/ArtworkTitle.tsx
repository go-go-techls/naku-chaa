import React, { ReactNode } from "react";
import { Typography, Box, IconButton, Skeleton } from "@mui/material";

interface ChildProps {
  title: string;
  children: ReactNode; // ReactNode 型を使用して任意のReact要素を受け入れる
}

const ArtworkTitle: React.FC<ChildProps> = ({ title, children }) => {
  return (
    <Box display="flex" alignItems="center">
      {title ? (
        <Typography mr={0.7} variant="h4" component="h1" sx={{ flexGrow: 0 }}>
          {title}
        </Typography>
      ) : (
        <Skeleton variant="text" height={60} width={400} />
      )}
      {children}
    </Box>
  );
};

export default ArtworkTitle;
