import React from "react";
import { Typography, Box, TextField, IconButton } from "@mui/material";
import RadioGroupRating from "./RadioGroupRating";
import RefreshIcon from "@mui/icons-material/Refresh";

const ArtworkDetails = () => {
  const handleReload = () => {
    window.location.reload(); // ページの再読み込み
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box display="flex" alignItems="center">
        <Typography variant="h4" component="h1" sx={{ flexGrow: 0 }}>
          猫と女の子のお茶会
        </Typography>
        <IconButton onClick={handleReload} aria-label="リロード">
          <RefreshIcon />
        </IconButton>
      </Box>
      {/* <Typography variant="h4" gutterBottom>
        猫と女の子のお茶会
      </Typography> */}
      <Typography variant="h6" gutterBottom>
        こんな絵に見える
      </Typography>
      <Typography variant="body1" gutterBottom>
        女性が猫と鳥と一緒に窓に座っています。鳥が飛んでいる間、猫は口を開けています。女性はタバコを吸っているようだ。このシーンには2つのパイも表示されています。
      </Typography>
      <Typography variant="h6" gutterBottom>
        この絵の良いところ
      </Typography>
      <Typography variant="body1" gutterBottom>
        子供たちにとって楽しいイラストレーションで、猫や鳥が描かれている。女性が窓から吹き出される蒸気を手で捕まえるというユニークなシチュエーションがあり、子供たちにとって魅力的である。
      </Typography>
      <Typography variant="h6" gutterBottom>
        こんな工夫もできそう
      </Typography>
      <Typography variant="body1" gutterBottom>
        ほげほげ
      </Typography>
      <Typography variant="h6" gutterBottom>
        フィードバック
      </Typography>
      <RadioGroupRating />
      <Box component="form" sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="コメントを残す"
          variant="outlined"
          multiline
          rows={2}
        />
      </Box>
    </Box>
  );
};

export default ArtworkDetails;
