import React, { ReactNode } from "react";
import { Typography, Box, Skeleton } from "@mui/material";

interface ArtworkTitleProps {
  title: string;
  waitingForUser: boolean;
  children?: ReactNode; // ReactNode 型を使用して任意のReact要素を受け入れる
}

const ArtworkTitle: React.FC<ArtworkTitleProps> = ({
  title,
  waitingForUser,
  children,
}) => {
  return (
    <Box display="flex" alignItems="center">
      {title ? (
        <Typography mr={0.7} variant="h4" component="h1" sx={{ flexGrow: 0 }}>
          {title}
        </Typography>
      ) : (
        <Skeleton
          variant="text"
          height={60}
          width={400}
          animation={waitingForUser ? "pulse" : "wave"} // waitingForUser=trueなら静的、falseならwave
        />
      )}
      {children}
    </Box>
  );
};

export default ArtworkTitle;
