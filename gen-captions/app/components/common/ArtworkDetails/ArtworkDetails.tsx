import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Typography, Box, TextField, Skeleton } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Data, postResult } from "@/lib/postResult";

interface ChildComponentProps {
  title: string;
  feature: string;
  advantage: string;
  advice: string;
  image: string;
  rating: number;
  inputValue: string;
  setRating: Dispatch<SetStateAction<number>>;
  setInputValue: Dispatch<SetStateAction<string>>;
  disable: boolean;
}

const ArtworkDetails = ({
  title,
  feature,
  advantage,
  advice,
  image,
  rating,
  inputValue,
  setRating,
  setInputValue,
  disable,
}: ChildComponentProps) => {
  // `saved` の状態は保持するが、`done` が `true` のたびに `handleSave` を実行
  const [saved, setSaved] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <Typography mt={3} variant="h6" gutterBottom>
        あなたの作品の印象
      </Typography>
      {feature ? (
        <Typography variant="body1" gutterBottom>
          <ReactMarkdown>{feature}</ReactMarkdown>
        </Typography>
      ) : (
        <Skeleton variant="text" height={80} width="100%" />
      )}

      <Typography mt={3} variant="h6" gutterBottom>
        あなたの作品の良いところ
      </Typography>
      {advantage ? (
        <ReactMarkdown>{advantage}</ReactMarkdown>
      ) : (
        <Skeleton variant="text" height={80} width="100%" />
      )}

      <Typography mt={3} variant="h6" gutterBottom>
        次の作品へのアドバイス
      </Typography>
      {advice ? (
        <ReactMarkdown>{advice}</ReactMarkdown>
      ) : (
        <Skeleton variant="text" height={80} width="100%" />
      )}
    </>
  );
};

export default ArtworkDetails;
