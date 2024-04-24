import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Box, Fab } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { list } from "@/lib/testList";

function ImageGrid() {
  const images = list;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Grid container spacing={2}>
        {images.map((src, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                width: "32.4vw", // ビューポートの1/3の幅
                height: "32.4vw", // ビューポートの1/3の高さ
                backgroundImage: `url(${src.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                overflow: "hidden",
              }}
            />
          </Grid>
        ))}
      </Grid>
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: "fixed", bottom: 20, left: 20 }}
      >
        <CameraAltIcon />
      </Fab>
    </Box>
  );
}

export default ImageGrid;
