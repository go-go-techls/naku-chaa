"use client";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Box, Pagination, Skeleton } from "@mui/material";
import Link from "next/link";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DataItem } from "../api/arts/route";
import { getArts } from "@/lib/getArts";
import Header from "../components/common/Header/Header";

function ImageGrid() {
  const [data, setData] = useState<DataItem[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 14;
  const [total, setTotal] = useState<number>(1);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    getArts(setData, setTotal, page, pageSize);
    console.log("refreshed");
  }, [page]);

  return (
    <>
      <Box sx={{ position: "relative", zIndex: 10 }}>
        <Header />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ pb: 4 }}
      >
        <Grid
          container
          spacing={2}
          p={2}
          justifyContent="center"
          sx={{
            width: "100%",
            maxWidth: "1100px", // iPad 横向きでも収まるように調整
            mx: "auto",
          }}
        >
          <Grid item xs={12} sm={2.3} md={2.3} style={{ aspectRatio: "1/1" }}>
            <Link href={`/`} passHref>
              <Paper
                elevation={15}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                  padding: 1,
                }}
              >
                <AddCircleOutlineIcon fontSize="large" color="action" />
              </Paper>
            </Link>
          </Grid>

          {data.length === 0
            ? Array.from(new Array(pageSize)).map((_, index) => (
                <Grid
                  item
                  xs={12}
                  sm={2.3}
                  md={2.3}
                  style={{ aspectRatio: "1/1" }}
                  key={index}
                >
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    animation="wave"
                  />
                </Grid>
              ))
            : data.map((src, index) => (
                <Grid
                  item
                  xs={12}
                  sm={2.3}
                  md={2.3}
                  style={{ aspectRatio: "1/1" }}
                  key={index}
                >
                  <Link href={`/arts/${src.id}`} passHref>
                    <Paper
                      elevation={12}
                      sx={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${src.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        overflow: "hidden",
                        padding: 1,
                      }}
                    />
                  </Link>
                </Grid>
              ))}
        </Grid>
        <Pagination
          count={total}
          page={page}
          onChange={handleChange}
          size="small"
          sx={{ mt: 2 }}
        />
      </Box>
    </>
  );
}

export default ImageGrid;
