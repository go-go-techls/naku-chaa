import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Divider,
  Skeleton,
  Button,
} from "@mui/material";
import RadioGroupRating from "./RadioGroupRating";
import { Data, postResult } from "@/lib/postResult";
import ReactMarkdown from "react-markdown";

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
  // ユーザー入力を保持するための状態変数を初期化
  // const [inputValue, setInputValue] = useState("");
  // const [rating, setRating] = useState(3);
  const [saved, setSaved] = useState(false);

  // ユーザーがテキストフィールドに入力した値で状態を更新する関数
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSave = async () => {
    const req: Data = {
      title: title,
      feature: feature,
      advantage: advantage,
      advice: advice,
      image: image,
      rating: rating,
      comment: inputValue,
    };
    postResult(req);
    setSaved(true);
    // window.location.reload(); // ページの再読み込み
  };

  const done = title && feature && advantage && advice;

  return (
    <>
      <Typography mt={3} variant="h6" gutterBottom>
        AIがあなたの作品にコメントをつけるとすると…
      </Typography>
      {feature ? (
        <Typography variant="body1" gutterBottom>
          {/* {feature
            .replace(/\n+/g, "\n")
            .split("\n")
            .map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))} */}
          <ReactMarkdown>{feature}</ReactMarkdown>
        </Typography>
      ) : (
        <Skeleton variant="text" height={80} width="100%" />
      )}
      <Typography mt={3} variant="h6" gutterBottom>
        次の制作の…
        <br />
        参考作品
      </Typography>
      {advantage ? (
        // <Typography variant="body1" gutterBottom>
        //   {/* {advantage
        //     .replace(/\n+/g, "\n")
        //     .split("\n")
        //     .map((line, index) => (
        //       <React.Fragment key={index}>
        //         {line}
        //         <br />
        //       </React.Fragment>
        //     ))} */}
        //   <ReactMarkdown>{advantage}</ReactMarkdown>
        // </Typography>
        <ReactMarkdown>{advantage}</ReactMarkdown>
      ) : (
        <Skeleton variant="text" height={80} width="100%" />
      )}
      <Typography mt={3} variant="h6" gutterBottom>
        アドバイス
      </Typography>
      {advice ? (
        // <Typography variant="body1" gutterBottom>
        //   {/* {advice
        //     .replace(/\n+/g, "\n")
        //     .split("\n")
        //     .map((line, index) => (
        //       <React.Fragment key={index}>
        //         {line}
        //         <br />
        //       </React.Fragment>
        //     ))} */}
        //   <ReactMarkdown>{advice}</ReactMarkdown>
        // </Typography>
        <ReactMarkdown>{advice}</ReactMarkdown>
      ) : (
        <Skeleton variant="text" height={80} width="100%" />
      )}
      <Divider></Divider>
      <Typography mt={3} variant="h6" gutterBottom>
        フィードバック
      </Typography>
      <RadioGroupRating
        disabled={disable || !done || saved}
        setRating={setRating}
      />
      <Box
        component="form"
        sx={{
          alignItems: "center", // Align items vertically
          width: "100%", // フォームの幅を100%に設定
          mt: 1,
        }}
      >
        <TextField
          value={inputValue} // テキストフィールドの値として状態変数を設定
          onChange={handleInputChange} // 値が変更されたときに実行する関数を設定
          disabled={disable || !done}
          fullWidth
          placeholder="コメントを残す"
          variant="outlined"
          multiline
          rows={2}
          sx={{ mb: 1 }}
        />
        <Button
          variant="contained"
          fullWidth
          disabled={disable || !done || saved}
          onClick={handleSave}
          sx={{ mt: 1 }}
        >
          <Typography variant="body1">保存</Typography>
        </Button>
      </Box>
    </>
  );
};

export default ArtworkDetails;
