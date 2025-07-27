"use client";
import React, { useEffect, useState, Suspense } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Box, Pagination, Skeleton, Fab, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import { DataItem } from "../api/arts/route";
import { getArts, clearArtsCache } from "@/lib/getArts";
import Header from "../components/common/Header/Header";

function ImageGridContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageFromURL = Number(searchParams.get("page")) || 1;
  const [data, setData] = useState<DataItem[]>([]);
  const [page, setPage] = useState(pageFromURL);
  const pageSize = 15;
  const [total, setTotal] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPage(pageFromURL);
  }, [pageFromURL]);

  // コンポーネントマウント時とページ変更時の両方でチェック
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newArtCreated = localStorage.getItem('newArtCreated');
      
      if (newArtCreated && newArtCreated !== 'null') {
        clearArtsCache(false);
        localStorage.removeItem('newArtCreated');
        
        // 通常のデータ取得useEffectより先に実行されるように、直接実行
        setIsLoading(true);
        getArts(setData, setTotal, page, pageSize, true).finally(() => {
          setIsLoading(false);
        });
        return; // 通常のデータ取得を実行しないようにreturn
      }
    }
  }, [page, pageSize]);
  

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
    setIsLoading(true);
    getArts(setData, setTotal, page, pageSize).finally(() => {
      setIsLoading(false);
    });
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
      
      <Box 
        sx={{ 
          position: "fixed", 
          bottom: 24, 
          right: 24, 
          zIndex: 1000,
          "@keyframes pulse": {
            "0%": {
              transform: "scale(1)",
              boxShadow: "0px 2px 12px rgba(0,0,0,0.04), 0px 1px 2px rgba(0,0,0,0.06), 0 0 0 0 rgba(100, 116, 139, 0.4)"
            },
            "70%": {
              transform: "scale(1.02)",
              boxShadow: "0px 4px 16px rgba(0,0,0,0.06), 0px 2px 4px rgba(0,0,0,0.08), 0 0 0 8px rgba(100, 116, 139, 0)"
            },
            "100%": {
              transform: "scale(1)",
              boxShadow: "0px 2px 12px rgba(0,0,0,0.04), 0px 1px 2px rgba(0,0,0,0.06), 0 0 0 0 rgba(100, 116, 139, 0)"
            }
          },
          "@keyframes glow": {
            "0%, 100%": { 
              filter: "drop-shadow(0 0 5px rgba(100, 116, 139, 0.3))" 
            },
            "50%": { 
              filter: "drop-shadow(0 0 15px rgba(100, 116, 139, 0.6))" 
            }
          }
        }}
      >
        <Tooltip title="新しい作品をみてもらう" placement="left">
          <Fab
            variant="extended"
            aria-label="新しい作品をみてもらう"
            sx={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)",
              color: "#64748b",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              boxShadow: "0px 2px 12px rgba(0,0,0,0.04), 0px 1px 2px rgba(0,0,0,0.06)",
              backdropFilter: "blur(12px)",
              borderRadius: "28px",
              px: 4,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 600,
              minWidth: "140px",
              height: "56px",
              animation: "pulse 3s ease-in-out infinite",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-3px) scale(1.05)",
                background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)",
                boxShadow: "0px 6px 24px rgba(0,0,0,0.08), 0px 2px 6px rgba(0,0,0,0.1)",
                color: "#475569",
                border: "1px solid rgba(148, 163, 184, 0.4)",
                animation: "glow 1.5s ease-in-out infinite",
              },
              "&:active": {
                transform: "translateY(-1px) scale(1.02)",
              },
            }}
            component={Link}
            href="/"
          >
            <AddIcon sx={{ 
              mr: 2, 
              fontSize: "24px",
              color: "#64748b",
              transition: "all 0.3s ease"
            }} />
            みてもらう
          </Fab>
        </Tooltip>
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
