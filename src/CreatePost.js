// src/CreatePost.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase-config';
import { Container, TextField, Button, Box, Typography } from '@mui/material';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() === '' || content.trim() === '') return;

    try {
      const postsCollectionRef = collection(db, 'posts');
      await addDoc(postsCollectionRef, {
        title,
        content,
        author: auth.currentUser.displayName,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      navigate('/community');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 4,
          p: 2,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          게시글 작성
        </Typography>
        <TextField
          label="제목"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="내용"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          작성하기
        </Button>
      </Box>
    </Container>
  );
}

export default CreatePost;
