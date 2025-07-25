'use client';

import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useAuth } from '@/app/contexts/AuthContext';

export default function MyPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h6" textAlign="center">
          ユーザー情報を読み込み中...
        </Typography>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        マイページ
      </Typography>

      {/* ユーザー情報カード */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: '#3386E7', 
              mr: 3,
              fontSize: '2rem'
            }}
          >
            {(user.name || user.email).charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {user.name || 'ユーザー'}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Chip 
              icon={<CalendarTodayIcon />}
              label={`登録日: ${formatDate(user.createdAt)}`}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
      </Paper>

      {/* 統計情報 */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ArtTrackIcon sx={{ fontSize: 48, color: '#3386E7', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {user.artCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                投稿した作品数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 48, color: '#3386E7', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                メンバー
              </Typography>
              <Typography variant="body2" color="text.secondary">
                アカウント種別
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* プロフィール詳細 */}
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          アカウント情報
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              ユーザーID
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
              {user.id}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              メールアドレス
            </Typography>
            <Typography variant="body1" gutterBottom>
              {user.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              表示名
            </Typography>
            <Typography variant="body1" gutterBottom>
              {user.name || '未設定'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              登録日時
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatDate(user.createdAt)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}