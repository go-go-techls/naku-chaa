import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Link from "next/link";

// 画像をアイコンとして表示するためのスタイリング
const Logo = styled("img")({
  width: 40,
  height: 40,
  marginRight: 10,
});

function Header() {
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#ffffff",
        color: "#3386E7",
        boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.1)", // カスタムシャドーを設定
      }}
    >
      <Link href="/arts" passHref>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="logo">
            <Logo src="/logo.svg" alt="App Icon" />
          </IconButton>
          <Typography
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: '"Kosugi Maru", Arial, sans-serif',
              fontSize: "1.25rem", // フォントサイズを直接指定
            }}
          >
            生成AIに作品をみてもらおう by テックルズ
          </Typography>
        </Toolbar>
      </Link>
    </AppBar>
  );
}

export default Header;
