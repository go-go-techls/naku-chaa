import React from "react";
import { Typography, Box, TextField, IconButton, Divider } from "@mui/material";
import RadioGroupRating from "./RadioGroupRating";
import RefreshIcon from "@mui/icons-material/Refresh";

interface ChildComponentProps {
  title: string;
}
const ArtworkDetails = ({ title }: ChildComponentProps) => {
  const handleReload = () => {
    window.location.reload(); // ページの再読み込み
  };

  return (
    <Box sx={{ p: 4 }} style={{ maxHeight: "100vh", overflow: "auto" }}>
      <Box style={{ height: "25%" }}></Box>
      <Box display="flex" alignItems="center">
        <Typography mr={0.7} variant="h4" component="h1" sx={{ flexGrow: 0 }}>
          {title}
        </Typography>
        <IconButton onClick={handleReload} aria-label="リロード">
          <RefreshIcon />
        </IconButton>
      </Box>
      <Typography mt={3} variant="h6" gutterBottom>
        こんな絵に見える
      </Typography>
      <Typography variant="body1" gutterBottom>
        この作品は、絵画におけるアイデンティティと創造性を表現したり、自然な形状と動物の顔を組み合わせたりすることで、視聴者に新たな感情や思い出をもたらす。
      </Typography>
      <Typography mt={3} variant="h6" gutterBottom>
        この絵の良いところ
      </Typography>
      <Typography variant="body1" gutterBottom>
        この絵は、小さなアニメーションのキャラクターが描かれており、その中にはペンギンやサルが含まれています。キャラクターたちは、彼らが食べることに焦点を当てており、一部はパンを食べています。
      </Typography>
      <Typography mt={3} variant="h6" gutterBottom>
        こんな工夫もできそう
      </Typography>
      <Typography mb={4} variant="body1" gutterBottom>
        この作家が次の作品を制作する時のテーマや画材のアドバイスは、子供たちに楽しんでもらえる絵本風のキャラクターとデザイン、色彩、アニメーションを用いて、動物や料理、冒険、友情などのテーマを描くことが重要です。
      </Typography>
      <Divider></Divider>
      <Typography mt={4} variant="h6" gutterBottom>
        フィードバック
      </Typography>
      <RadioGroupRating />
      <Box component="form" sx={{ mt: 1 }}>
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
