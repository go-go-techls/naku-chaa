"use client";
import React, { useEffect, useState, Suspense } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Box, Pagination, Skeleton } from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DataItem } from "../api/arts/route";
import { getArts, clearArtsCache } from "@/lib/getArts";
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

  // コンポーネントマウント時とページ変更時の両方でチェック
  useEffect(() => {
    console.log('🎯 一覧ページ useEffect実行 - ページ:', page);
    if (typeof window !== 'undefined') {
      const newArtCreated = localStorage.getItem('newArtCreated');
      console.log('一覧ページ - newArtCreatedフラグ:', newArtCreated);
      
      if (newArtCreated && newArtCreated !== 'null') {
        console.log('一覧ページ - キャッシュクリア実行');
        clearArtsCache(false);
        localStorage.removeItem('newArtCreated');
        
        // 通常のデータ取得useEffectより先に実行されるように、直接実行
        console.log('一覧ページ - キャッシュバイパスでデータ再取得');
        setIsLoading(true);
        getArts(setData, setTotal, page, pageSize, true).finally(() => {
          setIsLoading(false);
          console.log('一覧ページ - データ再取得完了');
        });
        return; // 通常のデータ取得を実行しないようにreturn
      } else {
        console.log('一覧ページ - newArtCreatedフラグなし、通常処理');
      }
    }
  }, [page, pageSize]);
  
  // 初回マウント時の確認
  useEffect(() => {
    console.log('🎯 初回マウント時のフラグ確認');
    if (typeof window !== 'undefined') {
      const newArtCreated = localStorage.getItem('newArtCreated');
      console.log('初回マウント - newArtCreatedフラグ:', newArtCreated);
    }
  }, []);

  // キーボードナビゲーション
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 入力フィールドやテキストエリアにフォーカスがある場合はスキップ
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          isLoading) {
        return;
      }
      
      if (event.key === 'ArrowLeft' && page > 1) {
        event.preventDefault();
        router.push(`?page=${page - 1}`, { scroll: false });
      } else if (event.key === 'ArrowRight' && page < total) {
        event.preventDefault();
        router.push(`?page=${page + 1}`, { scroll: false });
      } else if (event.key === 'Home') {
        event.preventDefault();
        router.push(`?page=1`, { scroll: false });
      } else if (event.key === 'End') {
        event.preventDefault();
        router.push(`?page=${total}`, { scroll: false });
      } else if (event.key >= '1' && event.key <= '9') {
        // 数字キー1-9でページ移動
        const targetPage = parseInt(event.key);
        if (targetPage <= total) {
          event.preventDefault();
          router.push(`?page=${targetPage}`, { scroll: false });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page, total, isLoading, router]);

  useEffect(() => {
    console.log('🎯 通常のデータ取得 useEffect実行 - ページ:', page);
    setIsLoading(true);
    getArts(setData, setTotal, page, pageSize).finally(() => {
      setIsLoading(false);
      console.log('🎯 通常のデータ取得完了');
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
          sx={{
            mt: 2.2,
            "& .MuiPaginationItem-root": {
              fontSize: "1.0rem",
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
