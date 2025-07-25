"use client";
import React, { useEffect, useState, Suspense } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Box, Pagination, Skeleton } from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DataItem } from "../api/arts/route";
import { getArts } from "@/lib/getArts";
import Header from "../components/common/Header/Header";

function ImageGridContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageFromURL = Number(searchParams.get("page")) || 1;
  const [data, setData] = useState<DataItem[]>([]);
  const [page, setPage] = useState(pageFromURL);
  const pageSize = 14;
  const [total, setTotal] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPage(pageFromURL);
  }, [pageFromURL]);

  useEffect(() => {
    setIsLoading(true);
    getArts(setData, setTotal, page, pageSize).finally(() => {
      setIsLoading(false);
    });
    console.log("refreshed");
  }, [page]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`?page=${value}`, { scroll: false });
  };

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
            maxWidth: "1100px",
            mx: "auto",
          }}
        >
          <Grid item xs={4} sm={2.4} md={2.4} style={{ aspectRatio: "1/1" }}>
            <Link href={`/`} passHref>
              <Paper
                elevation={3}
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

          {isLoading
            ? Array.from(new Array(pageSize)).map((_, index) => (
                <Grid
                  item
                  xs={4} // 小さい画面で3列
                  sm={2.4} // 中サイズ以上で5列
                  md={2.4}
                  style={{ aspectRatio: "1/1" }}
                  key={index}
                >
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    animation="pulse"
                  />
                </Grid>
              ))
            : data.map((src, index) => (
                <Grid
                  item
                  xs={4} // 小さい画面で3列
                  sm={2.4} // 中サイズ以上で5列
                  md={2.4}
                  style={{ aspectRatio: "1/1" }}
                  key={index}
                >
                  <Link href={`/arts/${src.id}`} passHref>
                    <Paper
                      elevation={3}
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
          size="medium"
          // sx={{ mt: 2 }}
          sx={{
            mt: 2.2,
            "& .MuiPaginationItem-root": {
              fontSize: "1.0rem", // Paginationのサイズ調整
            },
          }}
        />
      </Box>
    </>
  );
}

function ImageGrid() {
  return (
    <Suspense fallback={
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ pb: 4 }}
      >
        <Box sx={{ position: "relative", zIndex: 10 }}>
          <Header />
        </Box>
        <Grid
          container
          spacing={2}
          p={2}
          justifyContent="center"
          sx={{
            width: "100%",
            maxWidth: "1100px",
            mx: "auto",
          }}
        >
          {Array.from(new Array(15)).map((_, index) => (
            <Grid
              item
              xs={4}
              sm={2.4}
              md={2.4}
              style={{ aspectRatio: "1/1" }}
              key={index}
            >
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="pulse"
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    }>
      <ImageGridContent />
    </Suspense>
  );
}

export default ImageGrid;
