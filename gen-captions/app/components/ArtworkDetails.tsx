import React from "react";
import {
  Typography,
  Box,
  TextField,
  IconButton,
  Divider,
  Skeleton,
} from "@mui/material";
import RadioGroupRating from "./RadioGroupRating";
import RefreshIcon from "@mui/icons-material/Refresh";

interface ChildComponentProps {
  title: string;
  feature: string;
  advantage: string;
  advice: string;
}
const ArtworkDetails = ({
  title,
  feature,
  advantage,
  advice,
}: ChildComponentProps) => {
  const handleReload = () => {
    window.location.reload(); // ページの再読み込み
  };

  return (
    <Box sx={{ p: 4 }} style={{ maxHeight: "100vh", overflow: "auto" }}>
      <Box style={{ height: "2%" }}></Box>
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
      </Box>
      <Typography mt={3} variant="h6" gutterBottom>
        こんな絵に見える
      </Typography>
      {feature ? (
        <Typography variant="body1" gutterBottom>
          {feature}
          {/* この作品は、絵画におけるアイデンティティと創造性を表現したり、自然な形状と動物の顔を組み合わせたりすることで、視聴者に新たな感情や思い出をもたらす。 */}
        </Typography>
      ) : (
        <Skeleton variant="text" height={100} width="100%" />
      )}
      <Typography mt={3} variant="h6" gutterBottom>
        この絵の良いところ
      </Typography>
      {advantage ? (
        <Typography variant="body1" gutterBottom>
          {advantage}
          {/* この作品は、絵画におけるアイデンティティと創造性を表現したり、自然な形状と動物の顔を組み合わせたりすることで、視聴者に新たな感情や思い出をもたらす。 */}
        </Typography>
      ) : (
        <Skeleton variant="text" height={100} width="100%" />
      )}
      <Typography mt={3} variant="h6" gutterBottom>
        こんな工夫もできそう
      </Typography>
      {advice ? (
        <Typography variant="body1" gutterBottom>
          {advice}
          {/* この作品は、絵画におけるアイデンティティと創造性を表現したり、自然な形状と動物の顔を組み合わせたりすることで、視聴者に新たな感情や思い出をもたらす。 */}
        </Typography>
      ) : (
        <Skeleton variant="text" height={100} width="100%" />
      )}
      <Divider></Divider>
      <Typography mt={4} variant="h6" gutterBottom>
        フィードバック
      </Typography>
      <RadioGroupRating disabled={!(title && feature && advantage && advice)} />
      <Box component="form" sx={{ mt: 1 }}>
        <TextField
          disabled={!(title && feature && advantage && advice)}
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
