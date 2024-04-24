import React, { useState } from "react";
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

interface ChildComponentProps {
  title: string;
  feature: string;
  advantage: string;
  advice: string;
  image: string;
}
const ArtworkDetails = ({
  title,
  feature,
  advantage,
  advice,
  image,
}: ChildComponentProps) => {
  // ユーザー入力を保持するための状態変数を初期化
  const [inputValue, setInputValue] = useState("");
  const [rating, setRating] = useState(3);

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
    // window.location.reload(); // ページの再読み込み
  };

  const done = title && feature && advantage && advice;

  return (
    <>
      {/* <Box style={{ height: "2%" }}></Box>
      <Box display="flex" alignItems="center">
        {title ? (
          <Typography mr={0.7} variant="h4" component="h1" sx={{ flexGrow: 0 }}>
            {title}
          </Typography>
        ) : (
          <Skeleton variant="text" height={70} width={400} />
        )}
        <IconButton onClick={handleReload} aria-label="リロード">
          <RefreshIcon />
        </IconButton>
      </Box> */}
      <Typography mt={3} variant="h6" gutterBottom>
        こんな絵に見える
      </Typography>
      {feature ? (
        <Typography variant="body1" gutterBottom>
          {feature}
        </Typography>
      ) : (
        <Skeleton variant="text" height={80} width="100%" />
      )}
      <Typography mt={3} variant="h6" gutterBottom>
        この絵の良いところ
      </Typography>
      {advantage ? (
        <Typography variant="body1" gutterBottom>
          {advantage}
        </Typography>
      ) : (
        <Skeleton variant="text" height={80} width="100%" />
      )}
      <Typography mt={3} variant="h6" gutterBottom>
        こんな工夫もできそう
      </Typography>
      {advice ? (
        <Typography variant="body1" gutterBottom>
          {advice}
        </Typography>
      ) : (
        <Skeleton variant="text" height={80} width="100%" />
      )}
      <Divider></Divider>
      <Typography mt={4} variant="h6" gutterBottom>
        フィードバック
      </Typography>
      <RadioGroupRating disabled={!done} setRating={setRating} />
      <Box
        component="form"
        sx={{
          // display: "flex", // Flexbox container
          alignItems: "center", // Align items vertically
          width: "100%", // フォームの幅を100%に設定

          mt: 1,
        }}
      >
        <TextField
          value={inputValue} // テキストフィールドの値として状態変数を設定
          onChange={handleInputChange} // 値が変更されたときに実行する関数を設定
          disabled={!done}
          fullWidth
          label="コメントを残す"
          variant="outlined"
          multiline
          rows={2}
          sx={{ mb: 1 }}
        />
        <Button
          variant="contained"
          fullWidth
          disabled={!done}
          onClick={handleSave}
        >
          保存
        </Button>
      </Box>
    </>
  );
};

export default ArtworkDetails;
