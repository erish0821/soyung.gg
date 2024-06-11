// src/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => (
  <Box component="footer" sx={{ bgcolor: 'primary.main', p: 2, mt: 'auto' }}>
    <Typography variant="body2" color="inherit" align="center">
      &copy; SOYUNG.GG - 정찬우, 이희원, 최현영, 자나바자르   email : jcw0690@gmail.com
    </Typography>
  </Box>
);

export default Footer;
