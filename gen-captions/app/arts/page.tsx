"use client";
import React, { useEffect, useState, Suspense, useCallback } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Box, Skeleton, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DataItem } from "../api/arts/route";
import { clearArtsCache, saveInfiniteScrollState, getInfiniteScrollState, clearInfiniteScrollState } from "@/lib/getArts";
import Header from "../components/common/Header/Header";

function ImageGridContent() {
  const [data, setData] = useState<DataItem[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 8; // スクロール可能な量を確保
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // データを追加する関数
  const addMoreData = useCallback(
    (newData: DataItem[], totalCount: number) => {
      setData((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueNewData = newData.filter(
          (item) => !existingIds.has(item.id)
        );
        const updatedData = [...prev, ...uniqueNewData];
        
        // hasMoreの判定をここで行う（setData内で最新の状態を使用）
        setHasMore(updatedData.length < totalCount);
        
        return updatedData;
      });
    },
    []
  );

  // データを読み込む関数
  const loadData = useCallback(
    async (pageNum: number, isRefresh = false) => {
      try {
        setError(null);
        if (pageNum === 1) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const response = await fetch(
          `/api/arts?page=${pageNum}&pageSize=${pageSize}`,
          {
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const result = await response.json();

        if (pageNum === 1 || isRefresh) {
          // 初回読み込みまたはリフレッシュの場合は置き換える
          setData(result.data);
          setHasMore(result.data.length < result.total);
        } else {
          // 追加読み込みの場合は追加する
          addMoreData(result.data, result.total);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "データの取得に失敗しました"
        );
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [addMoreData]
  );

  // 新しい作品が作成された場合の処理
  useEffect(() => {
    if (typeof window !== "undefined") {
      const newArtCreated = localStorage.getItem("newArtCreated");

      if (newArtCreated && newArtCreated !== "null") {
        clearArtsCache(false);
        clearInfiniteScrollState(); // 無限スクロール状態もクリア
        localStorage.removeItem("newArtCreated");
        // データを最初から再読み込み
        setPage(1);
        loadData(1, true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // スクロール検知機能
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !error) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }
  }, [isLoadingMore, hasMore, error, page, loadData]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.offsetHeight;
      const distanceFromBottom = documentHeight - (scrollY + windowHeight);
      
      console.log('スクロールデバッグ:', {
        scrollY,
        windowHeight,
        documentHeight,
        distanceFromBottom,
        shouldLoadMore: distanceFromBottom <= 1000,
        isLoadingMore,
        hasMore,
        error: !!error
      });
      
      // ページの底から500px手前でトリガー
      if (distanceFromBottom <= 500) {
        console.log('無限スクロールをトリガーします');
        loadMore();
      }
    };

    // スクロールイベントをスロットリング（100ms間隔）
    let timeoutId: NodeJS.Timeout;
    const throttledHandleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };

    window.addEventListener("scroll", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loadMore]);

  // 初回データ読み込み（状態復元を含む）
  useEffect(() => {
    const savedState = getInfiniteScrollState();
    if (savedState && savedState.data.length > 0) {
      // 保存された状態を復元
      setData(savedState.data);
      setPage(savedState.page);
      setHasMore(savedState.hasMore);
      setIsLoading(false);
      
      // スクロール位置を復元（少し遅延させる）
      setTimeout(() => {
        window.scrollTo(0, savedState.scrollPosition);
      }, 100);
    } else {
      // 通常の初回読み込み
      loadData(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 状態変更時に自動保存
  useEffect(() => {
    if (data.length > 0 && !isLoading) {
      const scrollPosition = window.scrollY;
      saveInfiniteScrollState(data, page, hasMore, scrollPosition);
    }
  }, [data, page, hasMore, isLoading]);

  // ページを離れる前に状態を保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (data.length > 0) {
        const scrollPosition = window.scrollY;
        saveInfiniteScrollState(data, page, hasMore, scrollPosition);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && data.length > 0) {
        const scrollPosition = window.scrollY;
        saveInfiniteScrollState(data, page, hasMore, scrollPosition);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [data, page, hasMore]);

  // エラー表示とリトライ機能
  const handleRetry = () => {
    setError(null);
    setPage(1);
    setData([]);
    loadData(1, true);
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

          {/* エラー状態の表示 */}
          {error && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
                <button onClick={handleRetry}>再試行</button>
              </Box>
            </Grid>
          )}

          {/* 初回ローディング時のスケルトン */}
          {isLoading &&
            data.length === 0 &&
            !error &&
            Array.from(new Array(8)).map((_, index) => (
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
            ))}

          {/* データの表示 */}
          {!error &&
            data.map((src, index) => (
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

        {/* 追加ローディング表示 */}
        {isLoadingMore && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>読み込み中...</Typography>
          </Box>
        )}


        {/* 全て読み込み完了メッセージ */}
        {!hasMore && data.length > 0 && !error && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">
              全ての作品を表示しました
            </Typography>
          </Box>
        )}

        {/* データが0件の場合 */}
        {!isLoading && data.length === 0 && !error && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">作品がありません</Typography>
          </Box>
        )}

        {/* スクロール用の最小限の余白 */}
        <Box sx={{ height: "20vh" }} />

      </Box>
    </>
  );
}

function ImageGrid() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <ImageGridContent />
    </Suspense>
  );
}

export default ImageGrid;
