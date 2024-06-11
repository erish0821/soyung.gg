// src/ItemGuide.js
import React, { useState, useEffect } from 'react';
import { TextField, Container, Box, Typography, Grid } from '@mui/material';
import { storage } from './firebase-config';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import itemsData from './items.json'; // 아이템 데이터를 가져옵니다.
import { useNavigate } from 'react-router-dom';

function ItemGuide() {
  const [itemData, setItemData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      const itemsRef = ref(storage, "item/");
      try {
        const itemRefs = await listAll(itemsRef);
        const urls = await Promise.all(
          itemRefs.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            const id = itemRef.name.replace(".png", "");
            const item = itemsData.data[id];
            if (item) {
              return { 
                url, 
                id, 
                name: item.name 
              };
            } else {
              return null; // JSON에 없는 아이템은 null로 반환
            }
          })
        );

        // null 값 필터링 및 아이템 이름으로 정렬
        const filteredUrls = urls.filter(url => url !== null);
        filteredUrls.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));

        setItemData(filteredUrls);
      } catch (error) {
        console.error("Error fetching items: ", error);
      }
    };

    fetchItems();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleItemClick = (id) => {
    navigate(`/item/${id}`);
  };

  const filteredItems = itemData.filter((item) =>
    item.name.includes(searchTerm)
  );

  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          아이템 가이드
        </Typography>
        <Grid container spacing={2} justifyContent="flex-start">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="아이템 검색"
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
        {filteredItems.map((item, index) => (
          <Box key={index} textAlign="center" border={1} borderRadius={2} p={2} width="150px">
            <img
              src={item.url}
              alt={item.name}
              style={{ width: "100px", height: "auto", borderRadius: "8px" }}
              onClick={() => handleItemClick(item.id)}
            />
            <Typography variant="body2" mt={1}>{item.name}</Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default ItemGuide;
