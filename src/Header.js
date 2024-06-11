// src/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Auth from './Auth';

const Header = () => (
  <AppBar position="static">
    <Toolbar className="toolbar">
      <Typography variant="h6" component="div" className="title">
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>리그 오브 레전드</Link>
      </Typography>
      <Box className="nav-links">
        <Button color="inherit" component={Link} to="/">전적 검색</Button>
        <Button color="inherit" component={Link} to="/champion-guide">챔피언 가이드</Button>
        <Button color="inherit" component={Link} to="/item-guide">아이템 가이드</Button>
        <Button color="inherit" component={Link} to="/map-guide">맵 가이드</Button>
        <Button color="inherit" component={Link} to="/community">커뮤니티</Button>
      </Box>
      <Auth />
    </Toolbar>
  </AppBar>
);

export default Header;
