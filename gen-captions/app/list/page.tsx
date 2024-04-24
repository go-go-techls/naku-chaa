"use client";
import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import Link from "next/link";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
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
        <Grid item xs={12} sm={4}>
          <Link href={`/`} passHref>
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "32.4vw", // ビューポートの1/3の幅
                height: "32.4vw", // ビューポートの1/3の高さ
              }}
            >
              <AddCircleOutlineIcon fontSize="large" color="action" />
            </Paper>
          </Link>
        </Grid>

        {images.map((src, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Link href={`/arts/${src.id}`} passHref>
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
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ImageGrid;
