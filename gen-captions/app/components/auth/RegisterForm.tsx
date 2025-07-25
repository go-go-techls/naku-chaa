'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
  CircularProgress,
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await register(email, password, name || undefined);
      
      if (result.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/arts');
        }
      } else {
        setError(result.error || 'ユーザー登録に失敗しました。');
      }
    } catch (err) {
      setError('ユーザー登録処理中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 100px)',
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          textAlign="center"
          sx={{ marginBottom: 3 }}
        >
          新規登録
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="お名前（任意）"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="パスワード"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            helperText="8文字以上で、文字と数字を含む必要があります"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ marginTop: 3, marginBottom: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              '新規登録'
            )}
          </Button>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              すでにアカウントをお持ちの方は{' '}
              <Link href="/login" passHref>
                <MuiLink component="span" sx={{ cursor: 'pointer' }}>
                  ログイン
                </MuiLink>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}