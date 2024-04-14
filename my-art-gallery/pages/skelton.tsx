import React from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

function LoadingPage() {
  return (
    <Grid
      container
      style={{ height: "100vh" }}
      alignItems="center"
      justifyContent="center"
    >
      {" "}
      <Grid item xs={12} md={7}>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Grid>
      <Grid item xs={12} md={5}>
        <Skeleton variant="text" height={60} width="80%" />
        <Skeleton variant="text" height={400} width="100%" />
      </Grid>
    </Grid>
  );
}

export default LoadingPage;
