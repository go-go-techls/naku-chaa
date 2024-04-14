import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ArtworkDisplay from "../components/ArtworkDisplay";
import ArtworkDetails from "../components/ArtworkDetails";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Fab from "@mui/material/Fab";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IconButton } from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <IconButton
        // onClick={}
        aria-label="戻る"
        size="large"
        sx={{ position: "absolute", top: 30, left: 30 }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      <Grid
        container
        style={{ height: "100vh" }}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12} md={7}>
          <ArtworkDisplay />
        </Grid>
        <Fab
          color="primary"
          aria-label="add"
          style={{ position: "fixed", bottom: 20, left: 20 }}
        >
          <CameraAltIcon />
        </Fab>
        <Grid item xs={12} md={5}>
          <ArtworkDetails />
        </Grid>
      </Grid>
    </Box>
  );
}
