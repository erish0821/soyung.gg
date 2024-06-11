// src/PostDetail.js
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, deleteDoc, updateDoc, getDoc, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase-config";
import { Container, Button, TextField, Typography, Box, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
        setContent(docSnap.data().content);
      } else {
        console.log("No such document!");
      }
    };

    const fetchComments = async () => {
      const commentsCollectionRef = collection(db, "posts", id, "comments");
      const q = query(commentsCollectionRef, orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(q);
      setComments(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt.toDate() })));
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleDelete = async () => {
    await deleteDoc(doc(db, "posts", id));
    navigate("/community");
  };

  const handleUpdate = async () => {
    await updateDoc(doc(db, "posts", id), { content });
    setIsEditing(false);
    setPost((prevPost) => ({ ...prevPost, content })); // 상태 업데이트
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const commentsCollectionRef = collection(db, "posts", id, "comments");
    const docRef = await addDoc(commentsCollectionRef, {
      content: newComment,
      author: auth.currentUser.displayName,
      authorId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });

    const newCommentDoc = await getDoc(docRef);
    const newCommentData = { id: newCommentDoc.id, ...newCommentDoc.data(), createdAt: newCommentDoc.data().createdAt.toDate() };

    setNewComment("");
    setComments((prevComments) => [...prevComments, newCommentData]);
  };

  const handleCommentDelete = async (commentId) => {
    const commentDocRef = doc(db, "posts", id, "comments", commentId);
    await deleteDoc(commentDocRef);
    setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
  };

  return (
    <Container>
      <Typography variant="h2" gutterBottom>
        Post Detail
      </Typography>
      {post ? (
        isEditing ? (
          <Box>
            <TextField
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {post.content}
            </Typography>
            {auth.currentUser && auth.currentUser.uid === post.authorId && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={handleDelete}>
                  Delete
                </Button>
              </Box>
            )}
          </Box>
        )
      ) : (
        <Typography>Loading...</Typography>
      )}
      <Typography variant="h3" gutterBottom sx={{ mt: 4 }}>
        Comments
      </Typography>
      {auth.currentUser && (
        <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
          <TextField
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            fullWidth
            multiline
            rows={2}
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      )}
      <List>
        {comments.map((comment) => (
          <Paper key={comment.id} sx={{ mb: 2, p: 2 }}>
            <ListItem>
              <ListItemText
                primary={comment.content}
                secondary={`by ${comment.author} on ${comment.createdAt.toString()}`}
              />
              {auth.currentUser && auth.currentUser.uid === comment.authorId && (
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleCommentDelete(comment.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          </Paper>
        ))}
      </List>
      <Button component={Link} to="/community" variant="contained" sx={{ mt: 4 }}>
        Back to Community
      </Button>
    </Container>
  );
};

export default PostDetail;
