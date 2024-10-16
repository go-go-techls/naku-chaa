"use client";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Box, Pagination } from "@mui/material";
import Link from "next/link";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import { list } from "@/lib/testList";
import { DataItem } from "../api/arts/route";
import { getArts } from "@/lib/getArts";

function ImageGrid() {
  // const images = list;
  const [data, setData] = useState<DataItem[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const [total, setTotal] = useState<number>(1);

  useEffect(() => {
    getArts(setData, setTotal, page, pageSize);
    console.log("refreshed");
  }, [page]); // IDが変わるたびにAPIが呼び出される

  return (
    <Box
      display="flex"
      flexDirection="column" // Flexbox 方向を縦に設定
      justifyContent="center"
      alignItems="center"
    >
      <Grid container spacing={5} p={5}>
        <Grid item xs={12} sm={4} style={{ aspectRatio: "1/1" }}>
          <Link href={`/`} passHref>
            <Paper
              elevation={15}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <AddCircleOutlineIcon fontSize="large" color="action" />
            </Paper>
          </Link>
        </Grid>

        {data.map((src, index) => (
          <Grid item xs={12} sm={4} style={{ aspectRatio: "1/1" }} key={index}>
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
                }}
              />
            </Link>
          </Grid>
        ))}
      </Grid>
      <Pagination count={total} page={page} onChange={handleChange} />
    </Box>
  );
}

export default ImageGrid;
