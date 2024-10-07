import React, { Dispatch, SetStateAction } from "react";
import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { promptTitle } from "@/lib/prompts";
import { fetchData } from "@/lib/openai";
// import { fetchData } from "@/lib/ollama";

interface ChildProps {
  imageBase64: string;
  setTitle: Dispatch<SetStateAction<string>>;
}

const RefreshTitle = ({ imageBase64, setTitle }: ChildProps) => {
  const handleReload = () => {
    const base64Image = imageBase64.split(",")[1];
    setTitle("");
    fetchData(base64Image, promptTitle, setTitle);
  };

  return (
    <IconButton onClick={handleReload} aria-label="リロード">
      <RefreshIcon />
    </IconButton>
  );
};

export default RefreshTitle;
