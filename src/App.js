// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import ChampionGuide from './ChampionGuide';
import ItemGuide from './ItemGuide';
import MapGuide from './MapGuide';
import Community from './Community';
import PostDetail from './PostDetail';
import ChampionDetail from './ChampionDetail';
import ItemDetail from './ItemDetail';
import Login from './Login';
import MatchDetails from './MatchDetails';
import CreatePost from './CreatePost';
import CreateSuggestion from './CreateSuggestion';
import Header from './Header';
import Footer from './Footer';
import { CssBaseline, Container, Box } from '@mui/material';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Box className="flex flex-col min-h-screen">
        <Header />
        <Container component="main" sx={{ flexGrow: 1, p: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/champion-guide" element={<ChampionGuide />} />
            <Route path="/item-guide" element={<ItemGuide />} />
            <Route path="/map-guide" element={<MapGuide />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/:id" element={<PostDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/champion/:name" element={<ChampionDetail />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/match/:matchId" element={<MatchDetails />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/create-suggestion" element={<CreateSuggestion />} />
          </Routes>
        </Container>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
