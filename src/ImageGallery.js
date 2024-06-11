// src/ImageGallery.js
import React, { useState, useEffect } from 'react';
import { TextField, Container, Box, Typography, Grid } from '@mui/material';
import { storage } from './firebase-config';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import championsData from './champions.json';

const ImageGallery = () => {
  const [championData, setChampionData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchChampions = async () => {
      const championsRef = ref(storage, "champion/");
      try {
        const championRefs = await listAll(championsRef);
        const urls = await Promise.all(
          championRefs.items.map(async (championRef) => {
            const url = await getDownloadURL(championRef);
            const id = championRef.name.replace(".png", "");
            const champion = championsData.data[id];
            if (champion) {
              return { 
                url, 
                id, 
                name: champion.name 
              };
            } else {
              return null; // JSON에 없는 챔피언은 null로 반환
            }
          })
        );

        // null 값 필터링 및 챔피언 이름으로 정렬
        const filteredUrls = urls.filter(url => url !== null);
        filteredUrls.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));

        setChampionData(filteredUrls);
      } catch (error) {
        console.error("Error fetching champions: ", error);
      }
    };

    fetchChampions();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredChampions = championData.filter((champion) =>
    champion.name.includes(searchTerm)
  );

  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          챔피언 가이드
        </Typography>
        <Grid container spacing={2} justifyContent="flex-start">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="챔피언 검색"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderRadius: '30px',
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" flexWrap="wrap" gap={2}>
        {filteredChampions.map((champion, index) => (
          <Box key={index} textAlign="center" border={1} borderRadius={2} p={2} width="150px">
            <img
              src={champion.url}
              alt={champion.name}
              style={{ width: "100px", height: "auto", borderRadius: "8px" }}
            />
            <Typography variant="body2" mt={1}>{champion.name}</Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default ImageGallery;
