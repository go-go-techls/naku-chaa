import React, { Dispatch, SetStateAction, useState } from "react";
import { Typography, Skeleton } from "@mui/material";
import ReactMarkdown from "react-markdown";

interface ChildComponentProps {
  feature: string;
  advantage: string;
  advice: string;
  waitingForUser: boolean;
}

const ArtworkDetails = ({
  feature,
  advantage,
  advice,
  waitingForUser,
}: ChildComponentProps) => {
  return (
    <>
      <Typography mt={3} variant="h6" gutterBottom>
        あなたの作品の印象
      </Typography>
      {feature ? (
        <Typography component="div" variant="body1" gutterBottom>
          <ReactMarkdown>{feature}</ReactMarkdown>
        </Typography>
      ) : (
        <Skeleton
          variant="text"
          height={80}
          width="100%"
          animation={waitingForUser ? "pulse" : "wave"} // waitingForUser=trueなら静的、falseならwave
        />
      )}

      <Typography mt={3} variant="h6" gutterBottom>
        あなたの作品の良いところ
      </Typography>
      {advantage ? (
        <Typography component="div" variant="body1" gutterBottom>
          <ReactMarkdown>{advantage}</ReactMarkdown>
        </Typography>
      ) : (
        <Skeleton
          variant="text"
          height={80}
          width="100%"
          animation={waitingForUser ? "pulse" : "wave"} // waitingForUser=trueなら静的、falseならwave
        />
      )}

      <Typography mt={3} variant="h6" gutterBottom>
        次の作品へのアドバイス
      </Typography>
      {advice ? (
        <Typography component="div" variant="body1" gutterBottom>
          <ReactMarkdown>{advice}</ReactMarkdown>
        </Typography>
      ) : (
        <Skeleton
          variant="text"
          height={80}
          width="100%"
          animation={waitingForUser ? "pulse" : "wave"} // waitingForUser=trueなら静的、falseならwave
        />
      )}
    </>
  );
};

export default ArtworkDetails;
