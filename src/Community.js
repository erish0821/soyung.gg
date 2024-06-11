// src/Community.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import { db, auth } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { Container, Button, Typography, Box, Pagination } from "@mui/material";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollectionRef = collection(db, "posts");
      const totalDocs = await getDocs(postsCollectionRef);
      const totalPages = Math.ceil(totalDocs.size / postsPerPage);
      setTotalPages(totalPages);

      const q = query(postsCollectionRef, orderBy("createdAt", "desc"), limit(postsPerPage));
      const querySnapshot = await getDocs(q);
      setPosts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt.toDate() })));
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    fetchPosts();

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchPagePosts = async (pageNumber) => {
    const postsCollectionRef = collection(db, "posts");
    let q = query(postsCollectionRef, orderBy("createdAt", "desc"), limit(postsPerPage));

    if (pageNumber > 1) {
      const previousPageLastDoc = await getDocs(query(postsCollectionRef, orderBy("createdAt", "desc"), limit(postsPerPage * (pageNumber - 1))));
      const lastVisibleDoc = previousPageLastDoc.docs[previousPageLastDoc.docs.length - 1];
      q = query(postsCollectionRef, orderBy("createdAt", "desc"), startAfter(lastVisibleDoc), limit(postsPerPage));
    }

    const querySnapshot = await getDocs(q);
    setPosts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt.toDate() })));
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <Typography variant="h2" gutterBottom>
        커뮤니티
      </Typography>
      {user ? (
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button variant="contained" color="primary" onClick={() => navigate("/create-post")}>
            게시글 작성
          </Button>
          <Button variant="contained" color="secondary" onClick={() => navigate("/create-suggestion")}>
            건의사항 작성
          </Button>
        </Box>
      ) : (
        <Typography variant="body1">Please sign in to post.</Typography>
      )}
      <Typography variant="h4" gutterBottom>
        자유게시판
      </Typography>
      {posts.map((post) => (
        <Box key={post.id} sx={{ mb: 3, p: 2, boxShadow: 2, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
          <Link to={`/community/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="body1">{post.content}</Typography>
          </Link>
          <Typography variant="caption" display="block" gutterBottom>
            by {post.author} on {post.createdAt.toString()}
          </Typography>
        </Box>
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => fetchPagePosts(page)}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default Community;
