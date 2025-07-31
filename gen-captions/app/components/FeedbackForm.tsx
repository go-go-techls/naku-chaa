'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
} from '@mui/material';

interface FeedbackFormProps {
  open: boolean;
  onClose: () => void;
}

export default function FeedbackForm({ open, onClose }: FeedbackFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('内容を入力してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'フィードバックの送信に失敗しました');
      }

      setSuccess(true);
      // フォームをリセット
      setContent('');
      
      // 2秒後にダイアログを閉じる
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        ご意見をお聞かせください
      </DialogTitle>

      {success ? (
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            ご意見を送信しました！
            ご協力ありがとうございます。
          </Alert>
        </DialogContent>
      ) : (
        <>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="ご意見"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                multiline
                rows={5}
                sx={{ mb: 2 }}
                placeholder="使いにくい点、欲しい機能、気になることなど、何でもお聞かせください"
              />

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={handleClose} 
              disabled={loading}
              color="inherit"
            >
              キャンセル
            </Button>
            <Button 
              onClick={handleSubmit}
              variant="contained" 
              disabled={loading || !content.trim()}
            >
              {loading ? '送信中...' : '送信'}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}