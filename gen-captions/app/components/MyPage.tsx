'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid2,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '@/app/contexts/AuthContext';

export default function MyPage() {
  const { user, loading, refreshUser } = useAuth();
  const [artCount, setArtCount] = useState<number>(0);
  const [loadingArts, setLoadingArts] = useState(true);
  
  // パスワード変更フォーム関連の状態
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

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

  // パスワード変更処理
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordChangeMessage({
        type: 'error',
        text: 'すべての項目を入力してください',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordChangeMessage({
        type: 'error',
        text: '新しいパスワードが一致しません',
      });
      return;
    }

    if (newPassword.length < 8 || !/^(?=.*[A-Za-z])(?=.*\d)/.test(newPassword)) {
      setPasswordChangeMessage({
        type: 'error',
        text: 'パスワードは8文字以上で、文字と数字を含む必要があります',
      });
      return;
    }

    setPasswordChangeLoading(true);
    setPasswordChangeMessage(null);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordChangeMessage({
          type: 'success',
          text: data.message,
        });
        // フォームをリセット
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // トークンがリフレッシュされた場合、ユーザー情報を再取得
        if (data.tokenRefreshed) {
          await refreshUser();
        }
        
        // 3秒後にダイアログを閉じる
        setTimeout(() => {
          setPasswordDialogOpen(false);
          setPasswordChangeMessage(null);
        }, 3000);
      } else {
        setPasswordChangeMessage({
          type: 'error',
          text: data.error,
        });
      }
    } catch (error) {
      setPasswordChangeMessage({
        type: 'error',
        text: 'パスワード変更処理中にエラーが発生しました',
      });
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  // ダイアログを閉じる時の処理
  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordChangeMessage(null);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
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
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip 
                icon={<CalendarTodayIcon />}
                label={`登録日: ${user.createdAt ? formatDate(user.createdAt) : '不明'}`}
                variant="outlined"
                size="small"
                sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.8125rem' },
                  height: { xs: 28, sm: 32 }
                }}
              />
              {user.role === 'admin' && (
                <Chip 
                  label="管理者"
                  color="primary"
                  size="small"
                  sx={{ 
                    bgcolor: '#3386E7', 
                    color: 'white',
                    fontSize: { xs: '0.7rem', sm: '0.8125rem' },
                    height: { xs: 28, sm: 32 }
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
        
        {/* パスワード変更ボタン */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<LockIcon />}
            onClick={() => setPasswordDialogOpen(true)}
            sx={{ 
              borderColor: '#3386E7',
              color: '#3386E7',
              '&:hover': {
                borderColor: '#2563EB',
                backgroundColor: 'rgba(51, 134, 231, 0.04)',
              }
            }}
          >
            パスワード変更
          </Button>
        </Box>
      </Paper>

      {/* 統計情報 */}
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
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
        </Grid2>
        
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 48, color: '#3386E7', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {user.createdAt ? Math.ceil((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                利用日数
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* パスワード変更ダイアログ */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={handleClosePasswordDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LockIcon sx={{ mr: 1, color: '#3386E7' }} />
            パスワード変更
          </Box>
        </DialogTitle>
        <DialogContent>
          {passwordChangeMessage && (
            <Alert 
              severity={passwordChangeMessage.type} 
              sx={{ mb: 2 }}
            >
              {passwordChangeMessage.text}
            </Alert>
          )}
          
          <TextField
            fullWidth
            margin="normal"
            label="現在のパスワード"
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={passwordChangeLoading}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              },
            }}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="新しいパスワード"
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={passwordChangeLoading}
            helperText="8文字以上で、文字と数字を含む必要があります"
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              },
            }}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="新しいパスワード（確認）"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={passwordChangeLoading}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClosePasswordDialog}
            disabled={passwordChangeLoading}
          >
            キャンセル
          </Button>
          <Button 
            onClick={handlePasswordChange}
            variant="contained"
            disabled={passwordChangeLoading}
            sx={{ 
              bgcolor: '#3386E7',
              '&:hover': {
                bgcolor: '#2563EB',
              }
            }}
          >
            {passwordChangeLoading ? '変更中...' : 'パスワード変更'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}