import * as React from "react";
import { Box, Grid, Fab, IconButton, Paper } from "@mui/material";
import ArtworkDisplay from "../components/ArtworkDisplay";
import ArtworkDetails from "../components/ArtworkDetails";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function Home() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <IconButton
        // onClick={}
        aria-label="戻る"
        size="large"
        sx={{ position: "fixed", top: "1rem", left: "1rem" }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      <Grid 
        container
        // style={{ height: "100vh", width: "100vw"}}
        alignItems="center"
        justifyContent="center"

      >
        <Grid item xs={12} md={7} container style={{ height: "100vh", width: "100vw"}}>
          <Paper elevation={12}>
            <ArtworkDisplay />
          </Paper>
        </Grid>
        <Fab
          color="primary"
          aria-label="add"
          style={{ position: "fixed", bottom: "1.5rem", left: "1.5rem" }}
        >
          <CameraAltIcon />
        </Fab>
        <Grid item xs={12} md={5} container style={{ height: "100vh", width: "100vw"}}>
          <ArtworkDetails />
        </Grid>
      </Grid>
    </Box>
  );
}
