"use client";

import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";

// 画像をアイコンとして表示するためのスタイリング
const Logo = styled("img")({
  width: 40,
  height: 40,
  marginRight: 10,
});

function Header() {
  const { user, logout, loading } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#ffffff",
        color: "#3386E7",
        boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar>
        <Link
          href="/arts"
          passHref
          style={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Logo src="/techls-color.svg" alt="App Icon" />
            <Typography
              component="div"
              sx={{
                fontFamily: '"Kosugi Maru", Arial, sans-serif',
                fontSize: "1.4rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                "@media (max-width: 600px)": {
                  whiteSpace: "normal",
                  lineHeight: 1.2,
                  fontSize: "1.1rem",
                },
                "@media (max-width: 400px)": {
                  fontSize: "1rem",
                },
                "@media (max-width: 350px)": {
                  fontSize: "0.9rem",
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  "@media (max-width: 600px)": {
                    display: "block",
                  },
                }}
              >
                生成AIに作品をみてもらおう
              </Box>
              <Box
                component="span"
                sx={{
                  "@media (max-width: 600px)": {
                    display: "block",
                  },
                }}
              >
                {" by テックルズ"}
              </Box>
            </Typography>
          </Box>
        </Link>

        {/* 認証状態に応じたUI */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {loading ? (
            // ロード中
            <Typography variant="body2" color="text.secondary">
              読み込み中...
            </Typography>
          ) : user ? (
            // ログイン済み
            <>
              <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 0 }}>
                {user.avatar ? (
                  <Avatar
                    src={user.avatar}
                    sx={{ width: 36, height: 36 }}
                    alt={user.name || user.email}
                  />
                ) : (
                  <Avatar sx={{ width: 36, height: 36, bgcolor: "#3386E7" }}>
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </Avatar>
                )}
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
              >
                <MenuItem disabled sx={{ opacity: 1, cursor: "default" }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {user.name || "ユーザー"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link
                    href="/mypage"
                    passHref
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      width: "100%",
                    }}
                  >
                    マイページ
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
              </Menu>
            </>
          ) : (
            // 未ログイン
            <Link href="/login" passHref>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderColor: "#3386E7",
                  color: "#3386E7",
                  "&:hover": {
                    borderColor: "#2563EB",
                    bgcolor: "rgba(51, 134, 231, 0.04)",
                  },
                }}
              >
                ログイン
              </Button>
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
