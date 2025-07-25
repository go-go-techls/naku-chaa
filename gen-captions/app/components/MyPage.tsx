'use client';

import React, { useEffect, useState } from 'react';
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
  Button,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useAuth } from '@/app/contexts/AuthContext';

export default function MyPage() {
  const { user, loading, refreshUser } = useAuth();
  const [artCount, setArtCount] = useState<number>(0);
  const [loadingArts, setLoadingArts] = useState(true);

  // マイページにアクセスした時にユーザー情報を確実に取得
  useEffect(() => {
    if (!loading && !user) {
      refreshUser();
    }
  }, [loading, user, refreshUser]);

  // 作品数を取得
  useEffect(() => {
    const fetchArtCount = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/arts/count', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setArtCount(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch art count:', error);
      } finally {
        setLoadingArts(false);
      }
    };

    if (user) {
      fetchArtCount();
    }
  }, [user]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h6" textAlign="center">
          読み込み中...
        </Typography>
      </Container>
    );
  }

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
          {user.avatar ? (
            <Avatar 
              src={user.avatar}
              sx={{ 
                width: 80, 
                height: 80, 
                mr: 3
              }}
              alt={user.name || user.email}
            />
          ) : (
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
          )}
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {user.name || 'ユーザー'}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip 
                icon={<CalendarTodayIcon />}
                label={`登録日: ${user.createdAt ? formatDate(user.createdAt) : '不明'}`}
                variant="outlined"
                size="small"
              />
              {user.role === 'admin' && (
                <Chip 
                  label="管理者"
                  color="primary"
                  size="small"
                  sx={{ bgcolor: '#3386E7', color: 'white' }}
                />
              )}
            </Box>
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
                {loadingArts ? '...' : artCount}
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
                {user.createdAt ? Math.ceil((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) : '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                利用日数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}