// src/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => (
  <Box component="footer" sx={{ bgcolor: 'primary.main', p: 2, mt: 'auto' }}>
    <Typography variant="body2" color="inherit" align="center">
      &copy; 2024 리그 오브 레전드 전적검색 사이트
    </Typography>
  </Box>
);

export default Footer;
